//
const amqp = require("amqplib");

const logger = require("./logger");
let connection = null;
let channel = null;
const EXCHANGE_NAME = "facebook_events";

async function connectToRabbitMQ() {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();

    await channel.assertExchange(EXCHANGE_NAME, "topic", {
      durable: false,
    });
    logger.info("connected to rabbit mq");
  } catch (error) {
    logger.error("Error connecting to rabbit mq");
  }
}

async function publishEvent(routingKey, message) {
  if (!channel) {
    await connectToRabbitMQ();
  }
}

module.exports = {
  connectToRabbitMQ,
  publishEvent,
};
