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

      const exchange = "direct-exchange";

      channel.assertExchange(exchange, "direct", {
        durable: false,
      });

      const msg = "Message";

      channel.publish(exchange, "payment-only", Buffer.from(msg));
      //   channel.publish(exchange, "analytic-only", Buffer.from(msg));
      //   channel.publish(exchange, "both", Buffer.from(msg));

      console.log("[x] Sent %s", msg);
    });
  }
);
