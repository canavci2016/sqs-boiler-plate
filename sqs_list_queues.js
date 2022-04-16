var AWS = require('aws-sdk');
// Set the region

var credentials = new AWS.SharedIniFileCredentials({profile: 'work-account'});
credentials.accessKeyId = process.env.AMAZON_ACCESS_KEY_ID;
credentials.secretAccessKey = process.env.AMAZON_SECRET_ACCESS_KEY;
AWS.config.update({region: 'eu-west-1'});


// Create an SQS service object
var sqs = new AWS.SQS({apiVersion: '2012-11-05', credentials});

var params = {};

sqs.listQueues(params, function (err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data.QueueUrls);
  }
});