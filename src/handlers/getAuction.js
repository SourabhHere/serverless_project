import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import httpError from 'http-errors'
import commonMiddleware from '../lib/commonMiddleware';

const dynamodb = new DocumentClient();

export async function getAuctionById(id){
  let auction;

  try {
    let result = await dynamodb.get({
      TableName: process.env.AUCTION_TABLE_NAME,
      Key: {id}
    }).promise();
    auction = result.Item;
  }catch(error){
    console.log(error)
    throw new httpError.InternalServerError(error)
  }
  if(!auction){
    throw new httpError.NotFound(`not Found with id : , "${id}"`);
  }
  
  return auction;
}


async function getAuction(event, context) {
  let auction;
  let statusCode = 200;
  const { id } = event.pathParameters;

  auction = await getAuctionById(id);
  
  return {
    statusCode: statusCode,
    body: JSON.stringify(auction),
  };
}

export const handler = commonMiddleware(getAuction);