exports.topNFTs = {
  querystring: {
    type: 'object',
    additionalProperties: false,
    properties: {
      symbol: { type: 'string' },
      days: {
        type: 'integer',
        maximum: 365,
        default: 1
      },
      sortBy: {
        type: 'string',
        enum: ['volume', 'count'],
        default: 'volume'
      }
    }
  }
}

exports.topTrades = {
  querystring: {
    type: 'object',
    additionalProperties: false,
    properties: {
      symbol: { type: 'string' },
      days: {
        type: 'integer',
        maximum: 365,
        default: 1
      }
    }
  }
}

exports.topTraders = {
  querystring: {
    type: 'object',
    additionalProperties: false,
    properties: {
      symbol: { type: 'string' },
      days: {
        type: 'integer',
        maximum: 365,
        default: 1
      },
      type: {
        type: 'string',
        enum: ['buyers', 'sellers'],
        default: 'buyers'
      },
      sortBy: {
        type: 'string',
        enum: ['volume', 'count'],
        default: 'volume'
      }
    }
  }
}

exports.collection = {
  querystring: {
    type: 'object',
    required: ['symbol'],
    additionalProperties: false,
    properties: {
      symbol: {
        type: 'string',
      },
      mint: {
        type: 'boolean',
        default: false
      }
    }
  }
}

exports.days = {
  querystring: {
    type: 'object',
    additionalProperties: false,
    properties: {
      days: {
        type: 'integer',
        maximum: 365,
        default: 1
      },
    }
  }
}

exports.floor = {
  querystring: {
    type: 'object',
    additionalProperties: false,
    required: ['symbol'],
    properties: {
      days: {
        type: 'integer',
        maximum: 365,
        default: 1
      },
      symbol: {
        type: 'string',
      }
    }
  }
}
