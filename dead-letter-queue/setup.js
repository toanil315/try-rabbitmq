const amqp = require("amqplib");

async function setup() {
  const conn = await amqp.connect("amqp://admin:admin@localhost:5672");
  const ch = await conn.createChannel();

  const mainExchange = "main_exchange";
  await ch.assertExchange(mainExchange, "direct", { durable: false });
  await ch.assertQueue("main_queue", {
    durable: false,
  });
  await ch.bindQueue("main_queue", mainExchange, "task.process");

  // --- RETRY QUEUES (delay only) ---
  await ch.assertQueue("retry_1000", {
    arguments: {
      "x-message-ttl": 1000,
      "x-dead-letter-exchange": "",
      "x-dead-letter-routing-key": "main_queue",
    },
  });

  await ch.assertQueue("retry_5000", {
    arguments: {
      "x-message-ttl": 5000,
      "x-dead-letter-exchange": "",
      "x-dead-letter-routing-key": "main_queue",
    },
  });

  await ch.assertQueue("retry_15000", {
    arguments: {
      "x-message-ttl": 15000,
      "x-dead-letter-exchange": "",
      "x-dead-letter-routing-key": "main_queue",
    },
  });

  await ch.assertQueue("error_queue", { durable: false });
  console.log("Topology ready");
  await ch.close();
  await conn.close();
}

setup();
