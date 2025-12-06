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

      var queue = "request_queue";

      channel.assertQueue(queue, {
        durable: false,
      });

      channel.consume(
        queue,
        async function (msg) {
          console.log(" [SERVER] Received %s", msg.content.toString());

          channel.sendToQueue(
            msg.properties.replyTo,
            Buffer.from(
              `[SERVER] reply message with correlationId ${msg.properties.correlationId}`
            ),
            {
              correlationId: msg.properties.correlationId,
            }
          );
        },
        {
          noAck: true,
        }
      );
    });
  }
);
