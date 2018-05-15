const LocationType = `
  type Location {
    id: ID!
    name: String!
    desc: String
    lat: Float
    lng: Float
    districtId: Int
    cityId: Int
    pictureUrl: String
    order: Int
  }
`

module.exports = LocationType
