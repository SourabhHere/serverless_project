import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import httpError from 'http-errors'
import commonMiddleware from '../utils/commonMiddleware';


const dynamodb = new DocumentClient();

async function getAuctions(event, context) {
  let auctions;
  let statusCode = 200;

  try{
    auctions = await dynamodb.scan({
      TableName: process.env.AUCTION_TABLE_NAME
    }).promise();

  }catch(error){
    console.log(error)
    throw new httpError.InternalServerError(error)
  }


  return {
    statusCode: statusCode,
    body: JSON.stringify(auctions),
  };
}

export const handler = commonMiddleware(getAuctions);