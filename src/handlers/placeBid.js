import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import httpError from 'http-errors';
import validator from '@middy/validator';
import { inputSchema } from '../lib/validators/placeBidSchema';
import commonMiddleware from '../lib/commonMiddleware';
import { getAuctionById as getAuction } from './getAuction';

const dynamodb = new DocumentClient();

async function placeBid(event, context) {
  let statusCode = 200;
  const { id } = event.pathParameters;

  let { amount } = event.body;
  let auction = await getAuction(id);

  if (auction.status != "open"){
    throw new httpError.Forbidden(`the bid placing functionality is closed on this auction`)
  }

  if (amount <= auction.highestBid.amount) {
    throw new httpError.Forbidden(`bid must be higher than "${ auction.highestBid.amount }"`);
  }

  const params = {
    TableName: process.env.AUCTION_TABLE_NAME,
    Key: {id},
    UpdateExpression: 'set highestBid.amount = :amount',
    ExpressionAttributeValues: {
      ':amount': amount,
    },
    ReturnValues: 'ALL_NEW'
  };

  let updatedAuction;

  try {
    const result = await dynamodb.update(params).promise();
    updatedAuction = result.Attributes;
    
  } catch (error) {
    console.log(error);
    throw new httpError.InternalServerError(error);
    
  }


  return {
    statusCode: statusCode,
    body: JSON.stringify(updatedAuction),
  };
}

export const handler = commonMiddleware(placeBid)
  .use(validator({inputSchema}));