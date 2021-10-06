import AWS from "aws-sdk";

const dynamodb = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS();

export async function closeAuctions(auction){
  const params = {
    TableName: process.env.AUCTION_TABLE_NAME,
    Key: {id:auction.id } ,
    UpdateExpression: 'set #status = :status',
    ExpressionAttributeValues: {
      ':status' : 'closed',
    },
    ExpressionAttributeNames:
    {
      '#status': 'status',
    }
  }
  
  await dynamodb.update(params).promise();
  
  const notifySeller = sqs.sendMessage({
    QueueUrl: process.env.MAIL_QUEUE_URL,
    MessageBody: JSON.stringify({
        subject: "Your Item is Sold",
        recipient: creator,
        body: `Your item ${title} has been sold for ${amount}`
    }),
  }).promise();
  const notifyBidder = sqs.sendMessage({
    QueueUrl: process.env.MAIL_QUEUE_URL,
    MessageBody: JSON.stringify({
        subject: "You Won an auction",
        recipient: bidder,
        body: `The auction ${title} is bought for $ ${amount}`
    }),
  }).promise();

  return Promise.all({
    notifyBidder,
    notifySeller
  });
}