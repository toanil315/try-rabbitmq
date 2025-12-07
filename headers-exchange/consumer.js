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

      const headersExchange = "headers_exchange";

      channel.assertExchange(headersExchange, "headers", {
        durable: false,
      });

      var queue = "headers_exchange_queue";

      channel.assertQueue(
        queue,
        {
          durable: false,
        },
        function (assertQueueError, queue) {
          if (assertQueueError) {
            throw assertQueueError;
          }

          const bindArguments = {
            "x-match": "all",
            name: "brian",
            age: 40,
          };

          channel.bindQueue(queue.queue, headersExchange, "", bindArguments);

          channel.consume(queue.queue, async function (msg) {
            console.log("Received: %s", msg.content.toString());
            channel.ack(msg);
          });
        }
      );
    });
  }
);
