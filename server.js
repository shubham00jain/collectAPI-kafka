const producer = require('./producer');
const axios = require('axios');
const CronJob = require('node-schedule');
const config  = require('./config');

// CronJob to call the producer after every 10 seconds
const job = CronJob.scheduleJob('*/10 * * * * *', function() {
    console.log("A new Cron job has started.");
    producer.KafkaService.sendRecord(`${config.Form_ID}`, `${config.Secret}`, axios);
})