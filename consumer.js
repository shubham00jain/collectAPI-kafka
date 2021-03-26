const kafka =  require('kafka-node');

const client = new kafka.KafkaClient("http://localhost:2181");

const topics = [
    {
        topic: "webevents.dev"
    }
];
const options = {
    autoCommit: true,
    fetchMaxWaitMs: 1000,
    fetchMaxBytes: 1024 * 1024,
    encoding: "buffer"
};

const consumer = new kafka.Consumer(client, topics, options);

consumer.on("message", function(message) {

    // Read string into a buffer.
    var buf = new Buffer(message.value, "binary"); 
    var decodedMessage = JSON.parse(buf.toString());


    console.log("The data has been consumed!!!");
    //Events is a Sequelize Model Object. 
    return Events.create({
        nameOfRespondant: decodedMessage.nameOfRespondant,
        gender: decodedMessage.gender,
        age: decodedMessage.age,
        hobbies: decodedMessage.hobbies,
        phone: decodedMessage.phone,
        location: decodedMessage.location,
        //data: JSON.stringify(decodedMessage.data),
        createdAt: new Date()
    });
});

consumer.on("error", function(err) {
    console.log("error", err);
});

process.on("SIGINT", function() {
    consumer.close(true, function() {
        process.exit();
    });
});