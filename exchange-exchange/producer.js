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

      const directExchange = "direct_exchange";
      const fanoutExchange = "fanout_exchange";

      channel.assertExchange(directExchange, "direct", {
        durable: false,
      });

      channel.assertExchange(fanoutExchange, "fanout", {
        durable: false,
      });

      channel.bindExchange(
        fanoutExchange,
        directExchange,
        "",
        {},
        function (bindExchangeError) {
          if (bindExchangeError) throw bindExchangeError;

          const message =
            "This message will send to direct exchange -> fan out exchange -> queue";

          channel.publish(directExchange, "", Buffer.from(message));
          console.log("Sent:", message);
        }
      );
    });
  }
);
