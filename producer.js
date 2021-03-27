const kafka =  require('kafka-node');
const response = require('./util/getRecentResponse');
const config  = require('./config');

// Creating the Kafka Client.
const client = new kafka.KafkaClient(`http://${config.KafkaHost}`, 1, {
    sessionTimeout: 300,
    spinDelay: 100,
    retries: 2,
});

const producer = new kafka.HighLevelProducer(client);

producer.on("ready", function() {
    console.log("Kafka Producer is connected and ready.");
});

// This logs producer error to the console.
producer.on("error", function(error) {
    console.error(error);
});

let lastResponseID = "";

// The logic for Kafka producer.
const KafkaService = {
    sendRecord: async function (formID, Secret, httpClient ) {

        const newResponse = await response.getRecentResponse( formID, Secret, httpClient);          
        
        if (lastResponseID != newResponse[0]['responseId']) {
            lastResponseID = newResponse[0]['responseId'];
        } else {
            return;
        }

        console.log("[Producer] publishing log for response with response-id: ", lastResponseID)

        if (!newResponse) {
            console.log("New Response not Found.");
            return;
        }
        const event = {
            timestamp: Date.now(),
            nameOfRespondant: newResponse[0],
            gender: newResponse[1],
            age: newResponse[2],
            hobbies: newResponse[3],
            phone: newResponse[4],
            location: newResponse[5],
            //data: data
        };

        const buffer = new Buffer.from(JSON.stringify(event));

        // Create a new payload
        const record = [
            {
                topic: `${config.KafkaTopic}`,
                messages: buffer,
                attributes: 1 /* Use GZip compression for the payload */
            }
        ];

        //Send record to Kafka and log result/error
        producer.send(record, function(err, data){
            if (String(err) != 'null') {
                console.log("[Producer] unable to send the log with error: ", err)
            }
        });
    }
};

exports.KafkaService = KafkaService;