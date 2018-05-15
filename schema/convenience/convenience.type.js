const ConvenienceType = `
  type Convenience {
    id: ID!
    name: String!
    param: String!
    value: String
    type: String
    hot: String
    active: String
    landing: String
    class: String
    parentId: String
    groupId: String
  }
`

module.exports = ConvenienceType
