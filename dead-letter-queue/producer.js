const amqp = require("amqplib");

async function publish() {
  const conn = await amqp.connect("amqp://admin:admin@localhost:5672");
  const ch = await conn.createChannel();

  const exchange = "main_exchange";
  const routingKey = "task.process";

  const payload = { orderId: 123 };

  ch.publish(exchange, routingKey, Buffer.from(JSON.stringify(payload)));
  console.log("Message published");
}

publish();
