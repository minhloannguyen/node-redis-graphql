const glob = require('fast-glob')
const path = require('path')

const files = glob
    .sync('**/*.resolvers.js', { cwd: __dirname })
    .map(f => path.resolve(__dirname, f))

// eslint-disable-next-line
const resolvers = files.map(f => require(f))
    .reduce((acc, resolver) => ({ ...acc, ...resolver }), {})

module.exports = resolvers
