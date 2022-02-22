exports.stats = {
  querystring: {
    type: 'object',
    additionalProperties: false,
    required: ['from', 'symbol'],
    properties: {
      symbol: { type: 'string' },
      from: { type: 'string' }
    }
  }
}

exports.topNFTs = {
  querystring: {
    type: 'object',
    additionalProperties: false,
    properties: {
      symbol: { type: 'string' },
      from: { type: 'string' }
    }
  }
}

exports.topTraders = {
  querystring: {
    type: 'object',
    additionalProperties: false,
    properties: {
      symbol: { type: 'string' },
      all_time: {
        type: 'boolean',
        default: true
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

exports.mintHistory = {
  querystring: {
    type: 'object',
    additionalProperties: false,
    required: ['mint'],
    properties: {
      mint: { type: 'string' },
    }
  }
}

exports.symbolRequired = {
  querystring: {
    type: 'object',
    additionalProperties: false,
    required: ['symbol'],
    properties: {
      symbol: { type: 'string' },
    }
  }
}

exports.walletRequired = {
  querystring: {
    type: 'object',
    additionalProperties: false,
    required: ['wallet'],
    properties: {
      wallet: { type: 'string' },
    }
  }
}

exports.tmpSymbolOrMintRequired = {
  querystring: {
    type: 'object',
    additionalProperties: false,
    required: ['symbol'],
    properties: {
      symbol: { type: 'string' },
      mint: { type: 'string' }
    }
  }
}

exports.walletHistory = {
  querystring: {
    type: 'object',
    additionalProperties: false,
    required: ['wallet'],
    properties: {
      wallet: { type: 'string' },
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
