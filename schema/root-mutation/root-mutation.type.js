const RootMutation = `
  type RootMutation {
    updateHotel (
      id: ID!
      name: String!
    ): Hotel
  }
`
module.exports = RootMutation
