# Collect API Microservice using Kafka broker

![alt text](https://github.com/shubham00jain/collectAPI-microservice/blob/main/Design%20Specification.png?raw=true)



This is a microservice called **Middle Monster** which **GETS** data from the Collect APIs servers and then a **producer** works on the data and **publishes** it to a **kafka broker**. The **consumers** then can subscribe to a particular topic of the broker and consume the data as per their need.

This approach seperates the producer and consumer and therefore third party consumers can easily work in a **plug-and-play** fashion by listening to any topic and streaming data from it.

## Implementation

* In the **server.js** file, a CronJob calls the Collect API at an interval of every 10 seconds and if any new entry has come then it calls the producer.

* In the **producer.js** file, a asynchronous call to the collect API is made. After this call, the producer publishes the data to the kafka broker.
* In **consumer.js** file, the the consumer first listens to the topic and then the writes the data to a google sheet.


The results can be shown here:

https://docs.google.com/spreadsheets/d/19uaEgcy-3D0ryYqibWz2JCl2L1vaCbYxPVAKeod5cJs/edit#gid=0



To increase the scalability and to achieve eventual consistency we should implement a SQL based DB like Postgre. After the producer produces the data, a **worker-thread** should write the response to the Database and another **worker-thread** should read from the database and publish the kafka logs. This will ensure that the service is able to handle situations like power outages, lots of entries in a small amount of time etc. After this, the consumer service can stream the data as per their requirement.



# Installation 

One approach to run the code is to use the docker file. It is as follows:

1. Start the kafka broker and zookeeper using:

```
run docker-compose up
```

2. Now start the consumer in another terminal using:

```
node consumer.js
```

## 

Another approach is to download the kafka broker and run the zookeeper and kafka server manually. It is as follows:

1. Download the kafka broker using this link:

   ```
   https://www.apache.org/dyn/closer.cgi?path=/kafka/2.7.0/kafka_2.13-2.7.0.tgz
   ```

2. Unzip the tar file:

   ```
   tar -xzf kafka_2.13-2.7.0.tgz
   cd kafka_2.13-2.7.0
   ```

3. Start the kafka environment, in 2 seperate terminals:

   ```
   bin/zookeeper-server-start.sh config/zookeeper.properties
   bin/kafka-server-start.sh config/server.properties
   ```

4.  Create a new topic using:

   ```
   node util/createTopic.js
   ```

5. Run the producer using:

   ```
   node server.js
   ```

6. Run the Google Client API service using:

   ```
   node consumer.js
   ```





