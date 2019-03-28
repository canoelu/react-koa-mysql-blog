import React, {Component} from 'react'
import TagList from './TagList'
import CommonList from './../components/CommonList'
import {connect, actions} from 'mirrorx'
import styled from 'styled-components'

const Wrap = styled.div`
    width:${props => props.w}px;
    margin:20px auto;
    
`

class Article extends Component {
    constructor(props) {
        super(props)

    }

    componentDidMount() {

    }

    render() {
        const {list} = this.props;
        const {width} = this.props.layout;
        return <Wrap w={width}>
            <TagList/>
            <CommonList list={list} status={list.status}/>
        </Wrap>
    }
}

export default connect(state => {
    return {
        layout: state.app.layout,
        list: state.posts.list
    }
})(Article)