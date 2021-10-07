export const inputSchema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        amount: { type: 'number' }
      },
      required: ['amount']
    }
  }
}
