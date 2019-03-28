import React, {Component} from 'react'
import {Link, actions, connect} from 'mirrorx'
import Header from '../components/Header'

const ConnHeader = connect((state, props) => {
    let avatar = state.app.defaultAvatar

    return {
        currentPath: state.app.currentPath,
        layout: state.app.layout,
        user: state.login,
        avatar,
    }
})(Header);

const FixedHeader = ({height, hideSearch, paddingRight}) => {
    return (
        <div>
            <ConnHeader style={{position: 'fixed', width: '100%', zIndex: 7, paddingRight}} hideSearch={hideSearch}
            />
        </div>
    )
}

const ConnFixedHeader = connect((state, props) => {
    return {
        currentPath: state.app.currentPath,
        height: state.app.layout.header,
        hideSearch: props.hideSearch,
        paddingRight: state.app.bodyPaddingRight,
    }
})(FixedHeader);

export default ConnHeader

export {ConnFixedHeader as FixedHeader}