const Koa = require('koa');
const path = require('path');
const bodyParser = require('koa-bodyparser');
const mongoose = require('mongoose');
const config = require('./config/index.js');
const cors = require('koa-cors');
const Router = require('./routers/route')
const koabody = require('koa-body')
let static = require('koa-static');


const app = new Koa();
const session = require('koa-session');
app.keys = ['some secret hurr'];

mongoose.Promise = global.Promise;
mongoose.connect(config.database);


//cors
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000', // web前端服务器地址
}))
app.use(koabody({multipart: true}));
app.use(static(__dirname + '/static'))

//需要解析body,不然获取不到
app.use(bodyParser({
    formLimit: '10mb'
}));
const CONFIG = {
    key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    overwrite: true,
    /** (boolean) can overwrite or not (default true) */
    httpOnly: true,
    /** (boolean) httpOnly or not (default true) */
    signed: true,
    /** (boolean) signed or not (default true) */
    rolling: false,
    /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};
app.use(session(CONFIG, app));

//router
app.use(Router);

app.listen(config.port);

