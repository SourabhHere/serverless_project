import AWS from 'aws-sdk'
const s3 = new AWS.S3()

export async function uploadAuctionPictureToS3 (key, body) {
  const { Location } = await s3.upload({
    Bucket: process.env.AUCTION_BUCKET_NAME,
    Key: key,
    encoding: 'base64',
    Body: body,
    ContentType: 'image/jpeg'
  }).promise()
  return Location
}
