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

      const exchange = "topic-exchange";

      channel.assertExchange(exchange, "topic", {
        durable: false,
      });

      const msg = "Message";

      channel.publish(exchange, "user.vn.payment", Buffer.from(msg)); // => this is routed to all consumer because contains pattern *.vn.*, user.#, #.payment
      channel.publish(exchange, "business.vn.purchase", Buffer.from(msg)); // => this is routed to only analytic consumer because contains pattern *.vn.*

      console.log("[x] Sent %s", msg);
    });
  }
);
