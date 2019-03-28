import React, {Component} from 'react'
import {Form, Icon, message, Button} from 'antd';
import {connect, actions} from 'mirrorx'
import styled from 'styled-components'
import Avatar from './../components/common/Avatar'

const FormItem = Form.Item;
const UserWrap = styled.div`
    width:${props => props.w}px;
    margin:0 auto;
`

class ConnUser extends Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        actions.user.getUserInfo()
    }

    render() {
        const {width} = this.props.layout;
        return <UserWrap w={width}>

            <Avatar></Avatar>
        </UserWrap>
    }
}

export default connect(state => {
    return {
        layout: state.app.layout
    }
})(ConnUser)