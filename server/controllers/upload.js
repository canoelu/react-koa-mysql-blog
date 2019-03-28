const mongoose = require('mongoose')
const fs = require('fs');

module.exports = upload = async (ctx, next) => {
    // 文件上传
    const file = ctx.request.body.files.file;//这儿的file要和前端的name一致
    const date = new Date();
    const reader = fs.createReadStream(file.path); // 创建可读流
    const ext = file.name.split('.').pop(); // 获取上传文件扩展名
    const newPath = `static/uploads/${date.getTime().toString()}.${ext}`;
    const upStream = fs.createWriteStream(newPath); // 创建可写流
    await  reader.pipe(upStream); // 可读流通过管道写入可写流
    ctx.response.status = 200;
    ctx.body = {
        pathName: newPath
    }
}