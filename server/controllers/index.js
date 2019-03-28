var model = require('./../model/user.js');
var User = model.User;
const user1 = new User({
    name: 'chaoshuai',
    age: 20
})

try{
    user1.save()
} catch (e) {
    console.log('保存信息出错')
    return
}
console.log('保存成功')


exports.api = api;
