const userModel = require('../libs/mysql');
const jwt = require('jsonwebtoken');

exports.getPostsList = async (ctx, next) => {
    let {page, size} = ctx.params;
    ctx.response.status = 200;

}