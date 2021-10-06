import createError from 'http-errors'
import {getDueAuctions} from '../lib/getDueAuctions'
import {closeAuctions} from '../lib/closeAuctions'

async function processAuctions(event, context){
  try{
    let auctions = await getDueAuctions(new Date());
    // process auction for closing it
    let result;
    result = auctions.map( auction => closeAuctions(auction));
    await Promise.all(result);
    return {
        closed: result.length
      };
  } catch(error){
    console.log(error);
    throw new createError.InternalServerError(error);
  }
}

export const handler = processAuctions;