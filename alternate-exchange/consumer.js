const amqp = require("amqplib/callback_api");

amqp.connect(
  "amqp://admin:admin@localhost:5672",
  function (connectionError, connection) {
    if (connectionError) {
      throw connectionError;
    }
    connection.createChannel(function (channelCreationError, channel) {
      if (channelCreationError) {
        throw channelCreationError;
      }

      const exchange = "direct-exchange";
      const alternateExchange = "alternate-exchange";

      channel.assertExchange(alternateExchange, "fanout", {
        durable: false,
      });

      channel.assertExchange(exchange, "direct", {
        durable: false,
        alternateExchange: alternateExchange,
      });

      channel.assertQueue(
        "main-queue",
        {
          exclusive: true,
        },
        function (assertQueueError, queue) {
          if (assertQueueError) {
            throw assertQueueError;
          }

          channel.bindQueue(
            queue.queue,
            exchange,
            "alternate-exchange-routing-key"
          );

          channel.consume(queue.queue, async function (msg) {
            console.log("MAIN Consumer Received %s", msg.content.toString());
            channel.ack(msg);
          });
        }
      );

      channel.assertQueue(
        "alternate-queue",
        {
          exclusive: true,
        },
        function (assertQueueError, queue) {
          if (assertQueueError) {
            throw assertQueueError;
          }

          channel.bindQueue(queue.queue, alternateExchange, "");

          channel.consume(queue.queue, async function (msg) {
            console.log(
              "ALTERNATE Consumer Received %s",
              msg.content.toString()
            );
            channel.ack(msg);
          });
        }
      );
    });
  }
);
