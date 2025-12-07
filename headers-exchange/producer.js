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

      const headersExchange = "headers_exchange";

      channel.assertExchange(headersExchange, "headers", {
        durable: false,
      });

      const message = "This message will send to headers exchange";
      const headers = {
        name: "brian",
        age: 4,
        notEvaluateProps: "any",
      };

      channel.publish(headersExchange, "", Buffer.from(message), {
        headers,
      });

      console.log("Sent:", message, " with headers: ", headers);
    });
  }
);
