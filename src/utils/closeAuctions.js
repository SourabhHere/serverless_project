import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const dynamodb = new DocumentClient();

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
  
  let result = await dynamodb.update(params).promise();

  return result;
}