const queryEntryPoints = `
  type RootQuery {
    hotel(id: String!): Hotel
    hotels: [Hotel]
    suggestions(query: String!, limit: Int): [Suggestion]
    tour(id: String!): Tour
    booking(id: String!): Booking
  }
`

module.exports = queryEntryPoints
