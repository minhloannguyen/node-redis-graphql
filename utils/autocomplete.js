const debug = require('debug')('mt:contents-api:utils:autocomplete')
const { chunk, isEmpty } = require('lodash')
const deburr = require('./deburr')
const { mysql, redis } = require('../models')

function makeArgs(hotel, indexName, docName) {
    // FT.ADD myIdx doc2 1.0 FIELDS title "hello php" body "lorem ipsum" url "http://redis.io"
    const args = []
    args.push('FT.ADD')
    args.push(indexName)
    args.push(docName)
    args.push('1.0') // default score
    args.push('FIELDS')

    Object.keys(hotel).forEach(key => {
        args.push(key)
        args.push(String(hotel[key]).toLowerCase())
    })

    return args
}

async function loadToRediSearch(hotels, indexName) {
    debug('loadToRediSearch')
    const p = redis.pipeline()
    hotels.forEach(h => {
        const args = makeArgs(h, indexName, h.id)
        p.call(...args)
    })

    p.exec(err => {
        if (err) {
            return Promise.reject(err)
        }
        return Promise.resolve(true)
    })
}

async function populateCache(indexName) {
    debug('populateCache')
    let hotels = await mysql('hotels')
        .select(
            'hot_id as id',
            'hot_name_temp as name',
            'hot_address_temp as address'
        )
        .whereNotNull('hot_name_temp')
        .whereNotNull('hot_address_temp')

    // addding deburr name and address
    hotels = hotels.map(h => {
        h.deburrName = deburr(h.name, ' ')
        h.deburrAddress = deburr(h.address, ' ')
        return h
    })

    // hotel name and deburrName takes more priority than address
    const args = [
        'FT.CREATE',
        indexName,
        'SCHEMA',
        'id',
        'TEXT',
        'name',
        'TEXT',
        'WEIGHT',
        '5.0',
        'address',
        'TEXT',
        'deburrName',
        'TEXT',
        'WEIGHT',
        '4.0',
        'deburrAddress',
        'TEXT'
    ]
    // create the index
    await redis.call(...args)
    const chunks = chunk(hotels, 500)
    debug(`splitting ${hotels.length} hotels into ${chunks.length} chunks`)
    const loadAll = []
    chunks.forEach(c => {
        loadAll.push(loadToRediSearch(c, indexName))
    })

    return Promise.all(loadAll)
}

function arrayToObject(reply) {
    if (Array.isArray(reply)) {
        const obj = {}
        for (let i = 0; i < reply.length; i += 2) {
            obj[reply[i]] = reply[i + 1]
        }
        return obj
    }
    return reply
}

// TODO:
// refactor this
// reply varies on the FT.SEARCH command (eg. WITHSCORES or without WITHSCORES)

function parseReply(reply) {
    const [count, ...data] = reply
    const items = []
    for (let i = 0; i < count; i += 1) {
        const properties = arrayToObject(data[i * 3 + 2])
        if (!isEmpty(properties)) {
            items.push({
                id: data[i * 3],
                score: data[i * 3 + 1],
                ...properties
            })
        }
    }
    return items
}

module.exports = {
    parseReply,
    populateCache
}
