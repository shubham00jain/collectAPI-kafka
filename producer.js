const kafka =  require('kafka-node');
const axios = require('axios');
const test = require('./test');

const client = new kafka.KafkaClient("http://localhost:2181", "my-client-id", {
    sessionTimeout: 300,
    spinDelay: 100,
    retries: 2
});

const producer = new kafka.HighLevelProducer(client);
producer.on("ready", function() {
    console.log("Kafka Producer is connected and ready.");
});

// For this demo we just log producer errors to the console.
producer.on("error", function(error) {
    console.error(error);
});

const KafkaService = {
    sendRecord: ({ nameOfRespondant,gender,age,hobbies,phone,location,data }, callback = () => {}) => {

        const event = {
            timestamp: Date.now(),
            nameOfRespondant: nameOfRespondant,
            gender: gender,
            age:age,
            hobbies:hobbies,
            phone:phone,
            location:location,
            data: data
        };

        const buffer = new Buffer.from(JSON.stringify(event));

        // Create a new payload
        const record = [
            {
                topic: "webevents.dev",
                messages: buffer,
                attributes: 1 /* Use GZip compression for the payload */
            }
        ];

        //Send record to Kafka and log result/error
        producer.send(record, callback);
    }
};

module.exports = KafkaService;