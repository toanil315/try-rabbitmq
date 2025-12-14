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
      const alternateExchange = "alternate-exchange";

      channel.assertExchange(alternateExchange, "fanout", {
        durable: false,
      });

      channel.assertExchange(exchange, "direct", {
        durable: false,
        alternateExchange: alternateExchange,
      });

      const msg = "Message";
      //   channel.publish(
      //     exchange,
      //     "alternate-exchange-routing-key",
      //     Buffer.from(msg)
      //   );
      channel.publish(exchange, "fallback-routing-key", Buffer.from(msg));
      console.log("[x] Sent %s", msg);
    });
  }
);
