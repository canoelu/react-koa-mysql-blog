import React, {Component} from 'react'
import {Form, Input, Select, Button, Spin, AutoComplete} from 'antd'
import Editor from './../components/Editor'
import {actions} from 'mirrorx'
import {history} from './../util'

const FormItem = Form.Item
const TextArea = Input.TextArea
const Option = Select.Option

const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 3},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
    }
}

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 14,
            offset: 3,
        },
    }
}

const ContentItem = ({action, req, getField, onChange}) => {
    return (
        <FormItem {...formItemLayout} wrapperCol={{xs: {span: 24}, sm: {span: 21}}} label="内容" hasFeedback>
            <Editor action={action} req={req} onChange={onChange}/>
        </FormItem>
    )
}

class PostForm extends Component {
    state = {
        btnLoading: false,
        isPublic: true,
        dataSource: []
    }

    req = null
    content = ''

    componentDidMount() {
        if (this.props.action === 'create') {
            this.props.form.setFieldsValue({
                title: '',
                description: ''
            })
            this.content = ''
        } else {
            this.req = actions.posts.getDetail(this.props.id)
                .then(res => {
                    console.log(res)
                    const {title, description, content, label} = res.data;
                    this.props.form.setFieldsValue({
                        title: title,
                        tag: label[0].name,
                        description: description
                    })
                    this.content = JSON.parse(content)
                    return this.content

                })
        }
    }


    handleSubmit = (e) => {
        e.preventDefault();
        const {action, id} = this.props
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                try {
                    this.setState({btnLoading: true})
                    await actions.posts.submit({
                        id, action,
                        params: {
                            ...values,
                            isPublic: this.state.isPublic,
                            content: this.content,
                            content_type: 'article'
                        }
                    })
                    this.props.onBackToList()
                } finally {
                    this.setState({btnLoading: false})
                }
            }
        })
    }

    onSelect(){

    }
    editorChange = (content) => {
        this.content = content
    }

    render() {
        const {dataSource} = this.state;
        const {action, detail} = this.props;
        const {getFieldDecorator} = this.props.form;
        console.log(this.props)
        if (action === 'edit' && detail.loading) {
            return <Spin/>
        } else {
            return <Form onSubmit={this.handleSubmit}>
                <FormItem hasFeedback {...formItemLayout} label="标题">
                    {getFieldDecorator('title', {
                        rules: [{required: true, message: '请填写标题'}]
                    })(<Input placeholder="请输入标题"/>)}
                </FormItem>

                <FormItem {...formItemLayout} label="标签">
                    {getFieldDecorator('tag', {
                        rules: [{required: true, message: '输入标签'}]
                    })(<AutoComplete
                        dataSource={dataSource}
                        onSelect={this.onSelect}
                        onSearch={this.handleSearch}
                        placeholder="请输入标签"
                    />)}
                </FormItem>
                <FormItem hasFeedback {...formItemLayout} label="简介">
                    {getFieldDecorator('description', {
                        rules: [{required: true, message: '请输入简介'}]
                    })(<TextArea autosize={{minRows: 4, maxRows: 6}} placeholder="请输入简介"/>)}
                </FormItem>
                <ContentItem action={action} onChange={this.editorChange} req={this.req}
                             getField={getFieldDecorator}/>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" size="default" style={{marginRight: 8}}
                            loading={this.state.btnLoading}>提交</Button>

                    <Button size="default" onClick={this.props.onBackToList}>取消</Button>
                </FormItem>
            </Form>
        }


    }
}

const WrappedPostForm = Form.create()(PostForm)

export default WrappedPostForm
