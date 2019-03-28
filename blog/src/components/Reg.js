import React from 'react'
import {actions} from 'mirrorx'
import {Form, Icon, Input, Button} from 'antd'
import styled from 'styled-components'

const FormItem = Form.Item

const RegisterForm = styled(Form)`

`

const LoginButton = styled(Button)`
  width: 100%;
`

class NormalRegisterForm extends React.Component {
    state = {
        confirmDirty: false,
        sending: false
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({sending: true})
                actions.login.register(values)
                    .then(() => {
                        this.props.form.setFieldsValue({
                            username: '',
                            avatar: '',
                            password: '', password_confirmation: ''
                        })
                        this.setState({sending: false})
                        actions.login.showModal(false)
                    })
                    .catch(() => this.setState({sending: false}))
            }
        })
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value
        this.setState({confirmDirty: this.state.confirmDirty || !!value})
    }

    checkPassword = (rule, value, callback) => {
        const form = this.props.form
        if (value && value !== form.getFieldValue('password')) {
            callback('两次输入的密码不一致')
        } else {
            callback()
        }
    }

    checkConfirm = (rule, value, callback) => {
        const form = this.props.form
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], {force: true})
        }
        callback()
    }

    changeType() {
        actions.login.setModalType('login')
    }

    render() {
        const {getFieldDecorator} = this.props.form
        return (
            <RegisterForm onSubmit={this.handleSubmit}>
                <FormItem>
                    {getFieldDecorator('username', {
                        rules: [{required: true, message: '请输入用户名'}],
                    })(
                        <Input prefix={<Icon type="user" style={{fontSize: 13}}/>} placeholder="用户名"/>
                    )}
                </FormItem>

                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [
                            {required: true, message: '请输入密码'},
                            {validator: this.checkConfirm}
                        ]
                    })(
                        <Input prefix={<Icon type="lock" style={{fontSize: 13}}/>} type="password" placeholder="密码"/>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password_confirmation', {
                        rules: [{
                            required: true, message: '请确认输入的密码',
                        }, {
                            validator: this.checkPassword,
                        }],
                    })(
                        <Input prefix={<Icon type="lock" style={{fontSize: 13}}/>} type="password"
                               onBlur={this.handleConfirmBlur} placeholder="确认密码"/>
                    )}
                </FormItem>
                <FormItem style={{marginBottom: 0}}>
                    <LoginButton type="primary" htmlType="submit" loading={this.state.sending}>
                        注册
                    </LoginButton>
                    <a onClick={this.changeType}>
                        <Icon type="left"/>
                        返回登录
                    </a>
                </FormItem>
            </RegisterForm>
        )
    }
}

const WrappedNormalRegisterForm = Form.create()(NormalRegisterForm)

export default WrappedNormalRegisterForm