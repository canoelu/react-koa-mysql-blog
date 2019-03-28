const jwt = require('jsonwebtoken');
const md5 = require('md5');
const UserMod = require('./../model/user')
const config = require('./../config')

class User {
    constructor() {

    }

    async userReg(ctx, next) {
        const {username, password, avatar} = ctx.request.body;
        const user = await UserMod.findOne({username: username});
        if (user) {
            ctx.response.status = 409;
            ctx.response.body = {
                success: false,
                message: 'the user has reg'
            }
        } else {
            const newUser = new UserMod({
                username, password, avatar
            });
            const res = await newUser.save();
            if (res) {
                ctx.response.status = 200;
                ctx.response.body = {
                    success: true,
                    result: {
                        username: res.username,
                        meta: res.mata
                    }
                }
            }
        }
    }

    async login(ctx, next) {
        const {username, password} = ctx.request.body;
        const user = await UserMod.findOne({username: username});
        let match = false;
        if (user) match = await user.comparePassword(password, user.password);

        if (match) {
            ctx.session.user = {
                username: user.username,
                _id: user._id
            };
            ctx.cookies.set('user', {
                username: user.username,
                _id: user._id
            }, {
                domain: 'localhost',  // 写cookie所在的域名
                path: '/index',       // 写cookie所在的路径
                maxAge: 60 * 60 * 1000, // cookie有效时长
                httpOnly: false,  // 是否只用于http请求中获取
                overwrite: false  // 是否允许重写
            });
            const token = user.getToken();
            user.token = token;
            ctx.response.status = 200;
            ctx.response.body = {
                success: true,
                data: {
                    username: user.username,
                    token: token
                }
            }

        }

    }

    async findUser(ctx, next) {
        const user = ctx.session.user;
        console.log(user)
        const {username} = user;
        try {
            const user = await UserMod.findOne({username: username});
            ctx.response.status = 200;
            ctx.response.body = {
                success: true,
                data: {
                    username: user.username,
                }
            }
        } catch(e) {
            console.log(e)
        }

    }

    loginOut() {

    }

    findUsers() {

    }

    getToken() {
        return jwt.sign({name: this.username}, config.secret, {
            expiresIn: 7200
        })
    }


}

module.exports = new User()
