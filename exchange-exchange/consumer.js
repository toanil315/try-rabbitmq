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

      const fanoutExchange = "fanout_exchange";

      channel.assertExchange(fanoutExchange, "fanout", {
        durable: false,
      });

      var queue = "letter_box";

      channel.assertQueue(
        queue,
        {
          durable: true,
        },
        function (assertQueueError, queue) {
          if (assertQueueError) {
            throw assertQueueError;
          }

          console.log(queue.queue);

          channel.bindQueue(queue.queue, fanoutExchange, "");

          channel.consume(queue.queue, async function (msg) {
            console.log("Received: %s", msg.content.toString());
            channel.ack(msg);
          });
        }
      );
    });
  }
);
