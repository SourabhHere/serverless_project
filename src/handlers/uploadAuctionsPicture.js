import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import createError from 'http-errors'
import { getAuctionById } from '../handlers/getAuction'
import { uploadAuctionPictureToS3 } from '../lib/uploadPictureToS3'
import { uploadPictureToDynamoDB } from '../lib/uploadPictureToDynamoDB'
import validator from '@middy/validator'
import { inputSchema } from '../lib/validators/uploadAuctionPictureSchema'

async function uploadAuctionsPicture (event) {
  const { id } = event.pathParameters
  const auction = await getAuctionById(id)
  if (auction.creator !== event.requestContext.authorizer.email) {
    throw new createError.Unauthorized('you are not the seller of this auction')
  }
  const base64 = event.body.replace(/^data:image\/\w+;base64,/, '')
  const buffer = Buffer.from(base64, 'base64')
  let urlLocation
  let updatedAuction
  try {
    urlLocation = await uploadAuctionPictureToS3(auction.id + '.jpeg', buffer)
    updatedAuction = await uploadPictureToDynamoDB(id, urlLocation)
  } catch (error) {
    console.log(error)
    throw new createError.InternalServerError(error)
  }
  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction)
  }
}

export const handler = middy(uploadAuctionsPicture)
  .use(httpErrorHandler())
  .use(validator({ inputSchema }))
