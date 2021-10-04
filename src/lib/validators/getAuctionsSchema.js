export const inputSchema = {
    type: 'object',
    properties: {
      queryStringParameters: {
        type: 'object',
        properties: {
          status: { type: 'string', 
          enum: ['open', 'closed']
        }
        },
        required: ['status'] // Insert here all required event properties
      }
    }
};