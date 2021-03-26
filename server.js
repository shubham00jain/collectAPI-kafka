const producer = require('./producer');
const axios = require('axios');
const CronJob = require('node-schedule');
require('dotenv').config();

// Cron calls the producer after every 10 seconds
const job = CronJob.scheduleJob('*/10 * * * * *', function() {
    producer.KafkaService.sendRecord(`${process.env.FORM_ID}`, `${process.env.SECRET}`, axios);
})