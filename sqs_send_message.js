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


var params = {
  // Remove DelaySeconds parameter and value for FIFO queues
  DelaySeconds: 10,
  MessageAttributes: {
    "Title": {
      DataType: "String",
      StringValue: "The Whistler"
    },
    "Author": {
      DataType: "String",
      StringValue: "John Grisham"
    },
    "WeeksOn": {
      DataType: "Number",
      StringValue: "6"
    }
  },
  MessageBody: "Information about current NY Times fiction bestseller for week of 12/11/2016.",
  // MessageDeduplicationId: "TheWhistler",  // Required for FIFO queues
  // MessageGroupId: "Group1",  // Required for FIFO queues
  QueueUrl: "https://sqs.eu-west-1.amazonaws.com/053741116163/firstQueue"
};

sqs.sendMessage(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data.MessageId);
  }
});