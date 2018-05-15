const debug = require('debug')('mt:details-api:models:user')
const { mysql } = require('./')

async function fetchUser(loginName, password) {
    debug('fetchUser', loginName, password)
    const rows = await mysql('admin_user')
        .select(
            'adm_loginname as loginName',
            'adm_name as name',
            'adm_email as email'
        )
        .where('adm_loginname', loginName)
    // TODO: comment for now because i don't know how to encrypt password yet
    // .andWhere('adm_password', hashAndSalt(password))

    if (rows.length === 0) {
        throw new Error('user not found')
    }
    debug(rows)
    return rows[0]
}

module.exports = {
    fetchUser
}
