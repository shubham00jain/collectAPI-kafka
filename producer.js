const kafka =  require('kafka-node');
const response = require('./getRecentResponse');

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

let lastResponseID = "";

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
            console.log("New Response not Found!");
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
                topic: "webevents.dev",
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