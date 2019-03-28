import React from 'react'
import {actions} from 'mirrorx'
import {Form, Icon, Input, Button, Checkbox} from 'antd'
import styled from 'styled-components'

const FormItem = Form.Item

const LoginForm = styled(Form)`

`;

const Forgot = styled.a`
  float: right;
`

const LoginButton = styled(Button)`
  width: 100%;
`

class NormalLoginForm extends React.Component {
    state = {
        sending: false
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({sending: true})
                actions.login.login(values)
                    .then(() => {
                        this.props.form.setFieldsValue({
                            username: '', password: '', remember: false
                        })
                        this.setState({sending: false})
                        actions.login.showModal(false)
                    })
                    .catch(() => this.setState({sending: false}))
            }
        })
    }

    changeType() {
        actions.login.setModalType('register')
    }

    render() {
        const {getFieldDecorator} = this.props.form
        return (
            <LoginForm onSubmit={this.handleSubmit}>
                <FormItem>
                    {getFieldDecorator('username', {
                        rules: [{required: true, message: '请输入要用户名'}],
                    })(
                        <Input prefix={<Icon type="user" style={{fontSize: 13}}/>} placeholder="用户名"/>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{required: true, message: '请输入密码'}],
                    })(
                        <Input prefix={<Icon type="lock" style={{fontSize: 13}}/>} type="password" placeholder="密码"/>
                    )}
                </FormItem>
                <FormItem style={{marginBottom: 0}}>
                    {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: false,
                    })(
                        <Checkbox>记住我</Checkbox>
                    )}
                    <Forgot>忘记密码</Forgot>
                    <LoginButton type="primary" htmlType="submit" loading={this.state.sending}>
                        登录
                    </LoginButton>
                    或 <a onClick={this.changeType}>立即注册！</a>
                </FormItem>
            </LoginForm>
        )
    }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm)

export default WrappedNormalLoginForm