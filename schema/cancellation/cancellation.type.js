const CancellationType = `
  type Cancellation {
    id: ID!
    from: String
    to: String
    policyType: String
    cancelTime: String
  }
`

module.exports = CancellationType
