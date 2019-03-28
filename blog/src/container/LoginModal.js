import React from 'react'
import {connect, actions} from 'mirrorx'
import {Modal} from 'antd'
import styled from 'styled-components'
import Login from '../components/Login'
import Register from '../components/Reg'

const Title = styled.h3`
  margin-bottom: 20px;
  text-align: center;
  font-size: 20px;
`

class LoginModal extends React.Component {
    close() {
        actions.login.showModal(false)
    }

    render() {
        return (
            <Modal
                onCancel={this.close}
                footer={null} visible={this.props.show}
                width={340}
            >
                {
                    this.props.type === 'login'
                        ? <div>
                            <Title>登录</Title>
                            <Login/>
                        </div>
                        : <div>
                            <Title>注册</Title>
                            <Register/>
                        </div>
                }
            </Modal>
        )
    }
}

const ConnLoginModal = connect(
    state => {
        const {show, type} = state.login.loginModal
        return {
            show, type
        }
    }
)(LoginModal)

export default ConnLoginModal