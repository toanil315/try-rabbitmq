const amqp = require("amqplib");

async function consume() {
  const connection = await amqp.connect("amqp://admin:admin@localhost:5672");
  const channel = await connection.createChannel();

  channel.consume("main_queue", async (msg) => {
    if (!msg) return;

    const content = JSON.parse(msg.content.toString());
    const headers = msg.properties.headers || {};

    const retryCount = Number(headers["retry-attempt"]) || 0;
    console.log(`Processing`, content, `retry=${retryCount}`);

    try {
      if (Math.random() < 0.8) {
        throw new Error("Random failure");
      }

      console.log("✔ Success");
      channel.ack(msg);
    } catch (err) {
      console.log("✖ Failed");

      if (retryCount === 0) {
        channel.sendToQueue(
          "retry_1000",
          msg.content,
          attachRetryAttempt(msg.properties, 1)
        );
        channel.ack(msg);
      } else if (retryCount === 1) {
        channel.sendToQueue(
          "retry_5000",
          msg.content,
          attachRetryAttempt(msg.properties, 2)
        );
        channel.ack(msg);
      } else if (retryCount === 2) {
        channel.sendToQueue(
          "retry_15000",
          msg.content,
          attachRetryAttempt(msg.properties, 3)
        );
        channel.ack(msg);
      } else {
        channel.sendToQueue("error_queue", msg.content, msg.properties);
        channel.ack(msg);
        console.log("☠ Sent to error_queue");
      }
    }
  });

  console.log("Consumer started");
}

function attachRetryAttempt(properties, attempt) {
  return {
    ...properties,
    headers: {
      ...properties.headers,
      "retry-attempt": attempt,
    },
  };
}

consume();
