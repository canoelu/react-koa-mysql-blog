const mongoose = require('mongoose')
const LabelMod = require('./../model/label')

class Label {
    constructor() {

    }

    async new(ctx) {
        const {name} = ctx.request.body;
        let label = await LabelMod.findOne({name: name})

        if (!label) {
            const newLabel = await new LabelMod({name: name}).save()
            ctx.body = {
                err_code: 0,
                message: "添加Label成功",
                data: newLabel
            }
            return
        }
        ctx.body = {
            err_code: 1,
            message: 'Label已存在',
        }
    }

    async delete(ctx) {
        const _id = ctx.request.body._id

        try {
            await LabelMod.remove({_id: _id})
        } catch (e) {
            ctx.body = {
                success: false,
                message: e,
            }
        }

        ctx.body = {
            err_code: 0,
            message: '删除成功'
        }
    }

    async list(ctx) {
        const {size = 100, page = 0, sort = -1} = ctx.request.query;
        let labels = await LabelMod.find({}, ['name','article'])
            .populate({path: 'article', select: 'title description label meta author', populate: {path: 'label'}})
            .limit(parseInt(size))
            .skip(parseInt(page))
            .sort({'artCount': sort})
        console.log(labels)
        ctx.response.status = 200;
        ctx.body = {
            success: true,
            data: labels
        }

    }

    async update(ctx) {
        const {name, color, _id} = ctx.request.body

        let label = await LabelMod.findOne({_id: _id})
        label.name = name
        label.color = color
        label = await label.save()

        ctx.body = {
            err_code: 0,
            message: '修改label成功',
            data: label
        }

    }
}

module.exports = new Label()
