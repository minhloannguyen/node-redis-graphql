const HotelType = `
  type Hotel {
    id: ID!
    name: String!
    seoName: String
    desc: String
    lat: Float
    lng: Float
    phone: String
    email: String
    fax: String
    website: String
    checkin: String
    checkout: String
    tripAdvisiorId: String
    areaId: Int
    districtId: Int
    cityId: Int
    rating: Int
    pictures(limit: Int): [Picture]
    conveniences: [Convenience],
    ranking: Ranking
    buildTime: String
    repairTime: String
    bankName: String
    bankAccountNumber: String
    bankHolder: String
    contractStart: String
    contractFinish: String
    contractType: String
    contractCode: String
    contactName: String
    invoiceCompany: String
    invoiceAddr: String
    invoiceSendAddr: String
    taxCode: String

    # hms/pms related fields
    hmsActive: Boolean
    pmsUrl: String
    pmsActive: Boolean

    nearbyLocations(limit: Int): [Location]

    rooms: [Room]

    # flags
    ctripConnected: Boolean
  }
`

module.exports = HotelType
