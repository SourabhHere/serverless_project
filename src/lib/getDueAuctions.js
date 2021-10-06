import AWS from 'aws-sdk'

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getDueAuctions(dt){
  const params = {
    TableName: process.env.AUCTION_TABLE_NAME,
    IndexName: 'statusEndAtindex',
    KeyConditionExpression: '#status = :status AND endAt <= :now',
    ExpressionAttributeValues: {
      ':status' : 'open',
      ':now' : dt.toISOString(),
    },
    ExpressionAttributeNames:
    {
      '#status': 'status',
    }
    
  }
  
  const result = await dynamodb.query(params).promise();

  return result.Items;
}