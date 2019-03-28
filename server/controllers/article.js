const mongoose = require('mongoose');
const ArticleMod = require('./../model/article');
const UserMod = require('./../model/user');
const LabelMod = require('./../model/label');
const uuid = require('uuid');

class Article {
    constructor() {
    }

    /**
     * 新建文章
     * @param ctx
     * @param next
     * @returns {Promise<void>}
     */
    async new(ctx, next) {
        const key = uuid.v4();
        const {title, content, description, tag, isPublish} = ctx.request.body;
        if (title === '') {
            ctx.throw(400, '标题不能为空')
        }
        if (content === '') {
            ctx.throw(400, '文章内容不能为空')
        }
        let articleMode, article;
        try {
            const user = ctx.session.user;
            let label ;
            label= await LabelMod.findOne({name: tag})
            if (!label) {
                label = await new LabelMod({name: tag}).save()
            }
            if (user) {
                articleMode = new ArticleMod({
                    title: title,
                    content: content,
                    label: label,
                    description: description,
                    author: user,
                    isPublish: isPublish
                });
                article = await articleMode.save();

                ctx.response.status = 200;
                ctx.body = {
                    message: '保存成功',
                    data: {
                        _id: article._id,
                    }
                }
            }
        } catch (e) {
            ctx.response.status = 400;
            ctx.body = {
                message: '保存失败',
            }
        }

    }

    /**
     * 返回文章列表
     * @param ctx
     * @returns {Promise<void>}
     */
    async list(ctx) {
        const size = 10 || 100;
        const page = ctx.request.query.page || 0;
        const sort = ctx.request.query.sort || -1;
        const tagId = ctx.request.query.tagId || '';
        const keyword = ctx.request.query.keyword || '';
        let skip = 0;
        let currentData, count;
        if (page !== 0) {
            skip = size * (page - 1)
        }
        if (tagId) {
            currentData = await ArticleMod.find({label: {_id: tagId}})
                .populate({path: 'label', select: 'name'})
                .populate({path: 'author', select: 'username'})
                .sort({'meta.updateAt': sort})
                .limit(parseInt(size))
                .skip(parseInt(skip));

            count = await ArticleMod.count({label: {_id: tagId}}).catch(err => {
                this.throw(500, '服务器内部错误')
            })
        } else if (keyword) {
            currentData = await ArticleMod.find({title: {$regex: keyword}})
                .populate({path: 'label', select: 'name  artCount'})
                .populate({path: 'author', select: 'username'})
                .sort({'meta.updateAt': sort})
                .limit(parseInt(size))
                .skip(parseInt(skip));
            count = await ArticleMod.count({title: {$regex: keyword}}).catch(err => {
                this.throw(500, '服务器内部错误')
            })
        }
        else {
            currentData = await ArticleMod.find()
                .populate({path: 'label'})
                .populate({path: 'author'})
                .sort({'meta.updateAt': sort})
                .limit(parseInt(size))
                .skip(parseInt(skip));
            count = await ArticleMod.count().catch(err => {
                this.throw(500, '服务器内部错误')
            })
        }

        ctx.body = {
            message: 'success',
            count: count,
            data: currentData
        }
    }

    /**
     *
     * @param ctx
     * @returns {Promise<void>}
     */
    async update(ctx) {

        const {content, description, title, id, label} = ctx.request.body
        if (title === '') {
            ctx.throw(400, '标题不能为空')
        }
        if (content === '') {
            ctx.throw(400, '文章内容不能为空')
        }
        const article = await ArticleMod.findByIdAndUpdate(id, {$set: ctx.request.body}).catch(err => {
            if (err.name === 'CastError') {
                ctx.throw(400, '_id不存在');
            } else {
                ctx.throw(500, '服务器内部错误')
            }
        });

        ctx.response.status = 200;
        ctx.body = {
            success: 'true',
            data: article
        }

    }

    /**
     * 删除文章
     * @param ctx
     * @returns {Promise<void>}
     */
    async delete(ctx) {
        const _id = ctx.params.id;
        try {
            // 删除文章
            await ArticleMod.remove({_id: _id})
            ctx.response.status = 200;
            ctx.body = {
                id: _id,
                message: 'success'
            }


        } catch (e) {
            ctx.body = {
                message: 'failed'
            }
        }


    }

    /**
     * 查找文章
     * @param ctx
     * @returns {Promise<void>}
     */
    async findOne(ctx) {
        const _id = ctx.params.id;
        if (_id) {
            const data = await ArticleMod.findOne({_id: _id})
                .populate({path: 'label', select: 'name  artCount'})
                .populate({path: 'author', select: 'username'});
            ctx.response.status = 200;
            ctx.body = {
                message: 'success',
                data: data
            }
        }
    }

    async findByKeyword(ctx) {
        const keyword = ctx.params.keyword;

    }

}

module.exports = new Article()
