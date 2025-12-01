const amqp = require("amqplib/callback_api");

amqp.connect(
  "amqp://admin:admin@localhost:5672",

  function (connectionError, connection) {
    if (connectionError) {
      throw connectionError;
    }

    connection.createChannel(async function (createChannelError, channel) {
      if (createChannelError) {
        throw createChannelError;
      }
      var queue = "letter_box";

      channel.assertQueue(queue, {
        durable: false,
      });

      let i = 0;

      while (true) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const msg = `Message ${i++}`;

        channel.sendToQueue(queue, Buffer.from(msg));
        console.log("[x] Sent %s", msg);
      }
    });
  }
);
