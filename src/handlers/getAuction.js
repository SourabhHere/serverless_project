import AWS from 'aws-sdk'
import httpError from 'http-errors'
import commonMiddleware from '../lib/commonMiddleware'

const dynamodb = new AWS.DynamoDB.DocumentClient()

export async function getAuctionById (id) {
  let auction

  try {
    const result = await dynamodb.get({
      TableName: process.env.AUCTION_TABLE_NAME,
      Key: { id }
    }).promise()
    auction = result.Item
  } catch (error) {
    console.log(error)
    throw new httpError.InternalServerError(error)
  }
  if (!auction) {
    throw new httpError.NotFound(`not Found with id : , "${id}"`)
  }

  return auction
}

async function getAuction (event, context) {
  const { id } = event.pathParameters
  const auction = await getAuctionById(id)

  return {
    statusCode: 200,
    body: JSON.stringify(auction)
  }
}

export const handler = commonMiddleware(getAuction)
