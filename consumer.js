// Imports for Kafka
const kafka =  require('kafka-node');
const config  = require('./config');

// Imports for sheets api
const { google } = require('googleapis');
const keys = require('./keys.json');


// Authorizing the sheets client.
const sheetsclient = new google.auth.JWT(
    keys.client_email, null, keys.private_key, ['https://www.googleapis.com/auth/spreadsheets']
);
sheetsclient.authorize(function(err, tokens){

    if(err){
        console.log(err);
        return;
    }else{
        console.log("Google Sheets Client is connected and ready");
    }
    
})

//Consumer listening to the config.KafkaTopic
const client = new kafka.KafkaClient(`http://${config.KafkaHost}`);

const topics = [
    {
        topic: `${config.KafkaTopic}`
    }
];
const options = {
    autoCommit: true,
    encoding: "buffer"
};

const consumer = new kafka.Consumer(client, topics, options);


// Calling the sheets API if the consumer does not return any error.
consumer.on("message", async function(message) {
    
    try{
        
        // Read string into a buffer.
        var buf = new Buffer(message.value, "binary"); 
        var decodedMessage = JSON.parse(buf.toString());
        
        console.log("[Consumer] consuming log for response with response-id:",decodedMessage['nameOfRespondant']['responseId'] );


        const gsapi = google.sheets({version:'v4', auth: sheetsclient});
        
        // This array contains the heading of the sheets.
        let arr1 = [8];        
        arr1[0] = 'Response Id';
        arr1[1] = 'Name';
        arr1[2] = 'Gender';
        arr1[3] = 'Age';
        arr1[4] = 'Hobbies';
        arr1[5] = 'Mobile';
        arr1[6] = 'Location - Latitude';
        arr1[7] = 'Location - Longitude';

        // This array contains the data of the sheets.
        let arr2 = [];
        arr2.push(decodedMessage['nameOfRespondant']['responseId'],
        decodedMessage['nameOfRespondant']['text'],
        decodedMessage['gender']['text'],
        decodedMessage['age']['text'],
        decodedMessage['hobbies']['text'],
        decodedMessage['phone']['text'],
        decodedMessage['location']['location']['coordinates'][0]['latitude'], 
        decodedMessage['location']['location']['coordinates'][0]['longitude'] );

        // A 2-D array that contains arr1 and arr2.
        let newDataArray = [2];
        newDataArray[0] = arr1;
        newDataArray[1] = arr2;

        //console.log(newDataArray);

        // Request with request parameters.
        const request = {
            spreadsheetId: '19uaEgcy-3D0ryYqibWz2JCl2L1vaCbYxPVAKeod5cJs',
            range: 'Sheet1!A1',
            resource : {majorDimension: "ROWS",
                        values: newDataArray},
            valueInputOption: 'USER_ENTERED'
        }

        const data = await gsapi.spreadsheets.values.append(request);
        console.log("Response with Response Id", decodedMessage['nameOfRespondant']['responseId'], "sucessfully submiited to sheets.");
    }catch(err){
        console.log(err);
    }

});

// Logging error to the console (if any).
consumer.on("error", function(err) {
    console.log("error", err);
});

process.on("SIGINT", function() {
    consumer.close(true, function() {
        process.exit();
    });
});