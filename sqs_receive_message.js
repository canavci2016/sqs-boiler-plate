var AWS = require('aws-sdk');
// Set the region

var credentials = new AWS.SharedIniFileCredentials({profile: 'work-account'});
credentials.accessKeyId = process.env.AMAZON_ACCESS_KEY_ID;
credentials.secretAccessKey = process.env.AMAZON_SECRET_ACCESS_KEY;
AWS.config.update({region: 'eu-west-1'});


// Create an SQS service object
var sqs = new AWS.SQS({apiVersion: '2012-11-05', credentials});

var params = {
  QueueName: 'firstQueue',
  Attributes: {
    'DelaySeconds': '60',
    'MessageRetentionPeriod': '86400'
  }
};

sqs.createQueue(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data.QueueUrl);
  }
});

var queueURL = "https://sqs.eu-west-1.amazonaws.com/053741116163/firstQueue";

var params = {
  AttributeNames: [
    "SentTimestamp"
  ],
  MaxNumberOfMessages: 10,
  MessageAttributeNames: [
    "All"
  ],
  QueueUrl: queueURL,
  VisibilityTimeout: 20,
  WaitTimeSeconds: 0
};

sqs.receiveMessage(params, function(err, data) {
  if (err) {
    console.log("Receive Error", err);
  } else if (data.Messages) {
    console.log(data.attributes);
    var deleteParams = {
      QueueUrl: queueURL,
      ReceiptHandle: data.Messages[0].ReceiptHandle
    };
    sqs.deleteMessage(deleteParams, function(err, data) {
      if (err) {
        console.log("Delete Error", err);
      } else {
        console.log("Message Deleted", data);
      }
    });
  }
});