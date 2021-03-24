import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMiddleware';
import createError from 'http-errors';
import { getAuctionById } from '../handlers/getAuction';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
  const { id } = event.pathParameters;
  const { amount } = event.body;

  const params = {
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Key: { id },
      UpdateExpression:'set highestBid.amount = :amount',
      ExpressionAttributeValues: {
          ':amount': amount,
      },
      ReturnValues: 'ALL_NEW',
  };

  let auction = await getAuctionById(id);

  if (auction.highestBid.amount >= amount) {
    throw new createError.Forbidden(`The bid amount should be greater than ${auction.highestBid.amount}`);
  }

  let updatedAuction;

  try {
    const result = await dynamodb.update(params).promise();
    updatedAuction = result.Attributes;
  } catch(error) {
      console.log(error);
      throw new createError.InternalServerError(error);
  }
  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
}

export const handler = commonMiddleware(placeBid);