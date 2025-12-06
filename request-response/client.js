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
      var requestQueue = "request_queue";
      var replyQueue = "reply_queue";

      channel.assertQueue(requestQueue, {
        durable: false,
      });

      channel.assertQueue(replyQueue, {
        durable: false,
      });

      channel.sendToQueue(requestQueue, Buffer.from("[CLIENT] send message"), {
        correlationId: "correlationId",
        replyTo: replyQueue,
      });

      channel.consume(
        replyQueue,
        function (msg) {
          console.log(
            " [CLIENT] Got %s",
            msg.content.toString(),
            " with correlationId: ",
            msg.properties.correlationId
          );
        },
        {
          noAck: true,
        }
      );
    });
  }
);
