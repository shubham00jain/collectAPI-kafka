require('dotenv').config();

const config = {
  KafkaHost:process.env.KAFKA_HOST,
  KafkaTopic: process.env.KAFKA_TOPIC,
  Form_ID: process.env.FORM_ID,
  Secret: process.env.SECRET
};

module.exports = config;