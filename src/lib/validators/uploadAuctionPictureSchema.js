export const inputSchema = {
  type: 'object',
  properties: {
    body: {
      type: 'string',
      minLength: 1,
      pattern: '=$'
    }
  }
}
