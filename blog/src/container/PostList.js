import React, {Component} from 'react'

import {FixedHeader} from "./ConnHeader";
import {connect, actions, Route} from 'mirrorx'
import styled from 'styled-components'
import {history} from './../util'
import ListTabel from './../components/ListTabel'

const Main = styled.div`
  width: 1000px;
  margin: ${props => props.margin}px auto;
  @media only screen and (max-width: 700px) {
    width: 100%;
    padding: 0 10px;
    margin-top: 60px;
  }
`

const Title = styled.h1`
  margin: 25px 0;
  text-align: center;
`

class PostList extends Component {
    state = {
        pageLoading: true,
    }

    componentDidMount() {
        actions.posts.resetList();
        // actions.posts.getPagePosts()
    }

    render() {
        const {list, layout} = this.props

        const {margin} = layout
        return (
            <div>
                <Main margin={margin}>
                    <Title>文章列表</Title>
                    <ListTabel {...this.props.list}/>
                </Main>
            </div>

        )
    }
}

export default connect((state, props) => {
    const id = props.match.params.id | 0
    return {
        layout: state.app.layout,
        action: !id ? 'create' : 'edit',
        id,
        list: state.posts.list,
    }
})(PostList)
