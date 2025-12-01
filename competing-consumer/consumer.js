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

      var queue = "letter_box";

      channel.assertQueue(queue, {
        durable: false,
      });

      channel.prefetch(1);

      channel.consume(
        queue,
        async function (msg) {
          await new Promise((resolve) => setTimeout(resolve, 5000));
          console.log(" [x] Received %s", msg.content.toString());
          channel.ack(msg);
        },
        {
          noAck: false,
        }
      );
    });
  }
);
