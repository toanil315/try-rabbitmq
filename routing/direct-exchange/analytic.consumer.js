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

      channel.assertExchange(exchange, "direct", {
        durable: false,
      });

      channel.assertQueue(
        "",
        {
          exclusive: true,
        },
        function (assertQueueError, queue) {
          if (assertQueueError) {
            throw assertQueueError;
          }

          channel.bindQueue(queue.queue, exchange, "analytic-only");
          channel.bindQueue(queue.queue, exchange, "both");

          channel.consume(queue.queue, async function (msg) {
            console.log(
              "Analytic Consumer Received %s",
              msg.content.toString()
            );
            channel.ack(msg);
          });
        }
      );
    });
  }
);
