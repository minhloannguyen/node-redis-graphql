const RoomType = `
  type Room {
    id: ID!
    name: String
    desc: String
    price: Float
    maxCapacity: Int
    maxExtraBed: Int
    maxChild: Int
    childAge: Int

    pictureUrl: String
    availableCount: Int
    userId: Int
    bedType: String
    view: String

    pmsRoomId: Int

    surcharge: String
    isDeleted: Boolean
    smoking: Boolean
    isFromPMS: Boolean

    cancellations: [Cancellation]
    conveniences: [Convenience]
  }
`

module.exports = RoomType
