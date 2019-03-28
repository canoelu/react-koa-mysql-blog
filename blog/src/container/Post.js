import React, {Component} from 'react'
import {FixedHeader} from "./ConnHeader";
import {connect, actions, Route} from 'mirrorx'
import styled from 'styled-components'
import Form from '../components/EditorForm'
import {history} from './../util'

const Main = styled.div`
  width: 700px;
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

class Post extends Component {
    state = {
        pageLoading: true,
        btnLoading: false
    }

    componentDidMount() {

    }

    gotoList = () => {
        history.push('/posts/list')

    }

    render() {
        const {layout, id, action, detail} = this.props
        const {margin} = layout;
        return (
            <div>
                <Main margin={margin}>
                    <Title>{action === 'create' ? '创建文章' : "修改文章"}</Title>
                    <Form id={id} action={action} onBackToList={this.gotoList} detail={detail}/>
                </Main>

            </div>
        )
    }
}

export default connect((state, props) => {
    const id = props.match.params.id || 0
    return {
        layout: state.app.layout,
        detail: state.posts.detail,
        action: !id ? 'create' : 'edit',
        id,
    }
})(Post)
