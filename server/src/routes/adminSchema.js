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
      }
    }
  }
}
