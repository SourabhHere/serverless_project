import AWS from 'aws-sdk'

const dynamodb = new AWS.DynamoDB.DocumentClient()

export function uploadPictureToDynamoDB (id, urlLocation) {
  const params = {
    TableName: process.env.AUCTION_TABLE_NAME,
    Key: { id },
    UpdateExpression: 'set auctionPicture = :urlLocation',
    ExpressionAttributeValues: {
      ':urlLocation': urlLocation
    },
    ReturnValues: 'ALL_NEW'
  }

  const result = dynamodb.update(params).promise()
  return result.Attributes
}
