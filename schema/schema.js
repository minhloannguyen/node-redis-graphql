const glob = require('fast-glob')
const path = require('path')
const resolvers = require('./resolvers')
const { makeExecutableSchema } = require('graphql-tools')

const SchemaDefinition = `
  schema {
    query: RootQuery,
    mutation: RootMutation
  }
`

const files = glob
    .sync('**/*.type.js', { cwd: __dirname })
    .map(f => path.resolve(__dirname, f))

// eslint-disable-next-line
const types = files.map(f => require(f))
const typeDefs = [SchemaDefinition].concat(types)

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
})

module.exports = schema
