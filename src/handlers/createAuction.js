import {v4 as uuid} from 'uuid';
import aws from 'aws-sdk';
import httpError from 'http-errors'
import commonMiddleware from '../utils/commonMiddleware';


const dynamodb = new aws.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  const body = JSON.parse(event.body);
  const dated = new Date();
  let statusCode = 200;
  let auction = {};
  let endDate = new Date();
  endDate.setHours(endDate.getHours() +1);
  if(body.title != undefined && body.title != null) {
  auction = {
    id: uuid(),
    title:body.title,
    addedAt: dated.toString(),
    status: "open",
    highestBid : {
      amount: 0
    },
    endAt: endDate.toISOString(),
  };
  statusCode = 201;
  }
  else
  {
    auction = {
      title:"data not given",
    };
    statusCode = 400;
  }

  try{
    await dynamodb.put({
      TableName: process.env.AUCTION_TABLE_NAME,
      Item: auction,}
      ).promise();  
  } catch (error){
    console.log(error)
    throw new httpError.InternalServerError(error)
  }
  
  return {
    statusCode: statusCode,
    body: JSON.stringify(auction),
  };
}

export const handler = commonMiddleware(createAuction);