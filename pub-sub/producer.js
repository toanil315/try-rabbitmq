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

      const exchange = "pubsub";

      channel.assertExchange(exchange, "fanout", {
        durable: false,
      });

      const msg = "Message";
      channel.publish(exchange, "", Buffer.from(msg));
      console.log("[x] Sent %s", msg);
    });
  }
);
