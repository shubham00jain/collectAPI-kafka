const producer = require('./producer');
const axios = require('axios');
const CronJob = require('node-schedule');
//const consumer = require('./consumer');


const job = CronJob.scheduleJob('*/10 * * * * *', function() {
    producer.KafkaService.sendRecord('"mcGkTHWMPSoHGYXfzjWD"', "747e298d99dab12b80d0b81013a6542b", axios);
})