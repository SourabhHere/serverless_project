import createError from 'http-errors'
import { getDueAuctions } from '../lib/getDueAuctions'
import { closeAuction } from '../lib/closeAuctions'

async function processAuctions (event, context) {
  try {
    const auctions = await getDueAuctions(new Date())
    // process auction for closing it
    const result = auctions.map(auction => closeAuction(auction))
    await Promise.all(result)
    return {
      closed: result.length
    }
  } catch (error) {
    console.log(error)
    throw new createError.InternalServerError(error)
  }
}

export const handler = processAuctions
