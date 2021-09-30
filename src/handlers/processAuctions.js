import {getDueAuctions} from '../utils/getDueAuctions'

async function processAuctions(event, context){
  let auctions = await getDueAuctions(Date());
  console.log(auctions);
}

export const handler = processAuctions;