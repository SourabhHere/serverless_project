import createError from 'http-errors'
import {getDueAuctions} from '../utils/getDueAuctions'
import {closeAuctions} from '../utils/closeAuctions'

async function processAuctions(event, context){
  try{
    let auctions = await getDueAuctions(new Date());
    // process auction for closing it
    let result;
    result = auctions.map( auction => closeAuctions(auction));
    await Promise.all(result);
    return {
      statusCode: 200,
      body: {
        closed: result.length
      }
      };
  } catch(error){
    console.log(error);
    throw new createError.InternalServerError(error);
  }
}

export const handler = processAuctions;