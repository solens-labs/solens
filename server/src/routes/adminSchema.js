exports.updateEverything = {
  body: {
    type: 'object',
    required: ['symbols'],
    properties: {
      symbols: { 
        type: 'array',
        items: {
          type: 'string'
        }
      },
      startDate: {
        type: 'string',
        default: '2021-06-30'
      }
    }
  }
}
