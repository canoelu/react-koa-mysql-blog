import React, {Component} from 'react'
import {actions, connect} from 'mirrorx'
import {FixedHeader} from "./ConnHeader";

class Layout extends Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {

    }

    render() {
        return <div>user</div>
    }
}

const ConnLayout = connect(state => {
    return {
        userStatus: state.login.status
    }
})(Layout);
export default ConnLayout