//
const amqp = require("amqplib");
let connection = null;
let channel = null;

const EXCHANGE_NAME = "facebook_events";

async function connectToRabbitMQ() {
  try {
  } catch (e) {}
}

module.exports = { connectToRabbitMQ };
