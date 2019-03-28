const Router = require('koa-router');
const router = new Router();
const User = require('../controllers/user');
const Article = require('../controllers/article');
const Label = require('../controllers/label');
const upload = require('../controllers/upload');
router.post('/post', Article.new)
    .post('/login', User.login)
    .get('/userInfo', User.findUser)
    .put('/post', Article.update)
    .put('/query', Article.findByKeyword)
    .get('/posts', Article.list)
    .delete('/post/:id', Article.delete)
    .get('/post/:id', Article.findOne)
    .post('/register', User.userReg)
    .get('/tags', Label.list)
    .delete('/tags/:id', Label.delete)
    .post('/upload', upload);

module.exports = router.routes();
