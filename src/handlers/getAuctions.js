import AWS from 'aws-sdk'
import httpError from 'http-errors'
import commonMiddleware from '../lib/commonMiddleware'
import validator from '@middy/validator'
import { inputSchema } from '../lib/validators/getAuctionsSchema'

const dynamodb = new AWS.DynamoDB.DocumentClient()

async function getAuctions (event, context) {
  let auctions

  const { status } = event.queryStringParameters

  const params = {
    TableName: process.env.AUCTION_TABLE_NAME,
    IndexName: 'statusEndAtindex',
    KeyConditionExpression: '#status = :status',
    ExpressionAttributeValues: {
      ':status': status
    },
    ExpressionAttributeNames:
    {
      '#status': 'status'
    }
  }

  try {
    const result = await dynamodb.query(params).promise()
    auctions = result.Items
  } catch (error) {
    console.log(error)
    throw new httpError.InternalServerError(error)
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions)
  }
}

export const handler = commonMiddleware(getAuctions)
  .use(validator({ inputSchema }))
