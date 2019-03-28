import React, {Component} from 'react'
import {connect,actions} from 'mirrorx'
import styled from 'styled-components'
import bg from '../asserts/bg.jpg'
import TagList from './TagList'
import CommonList from './../components/CommonList'

const Wrap = styled.div`
  display:flex;  
  width: ${props => props.w}px;
  margin: 10px auto;
  background-color:'#f7f8f9';

  .block-left {
    width: ${props => props.left}px;
    margin-right: ${props => props.margin}px;
  }
  .block-right {
    width: ${props => props.right}px;
  }
  @media only screen and (max-width: 700px) {
    margin-top: 35px;
    .block-right {
      display: none;
    }
    .block-left {
      width: 100%;
      margin-right: 0;
      padding: 0 10px;
    }
    width: 100%;
  }
`
const MainWrap = styled.div`
    background-color:#f7f8f9
`
const EveryDay = styled.div`
    display:flex;
    width: 100%;
    height:500px;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background-color: #FFFFFF;
    background-repeat: no-repeat;
    text-align: center;
    background-position: center center;
    background-size: cover;
    box-sizing: border-box;
    background-image:url(${bg});
    margin-bottom:35px;
`
const CenterText = styled.h1`
    display:flex;
    font-size: 32px;
    line-height: 40px;
    color: #FFFFFF;
    max-width: 580px;
`


class MainPage extends Component {
    componentDidMount() {
        actions.posts.resetList()
        actions.posts.getPostsList()
    }

    render() {
        const {layout, list, status} = this.props
        const w = layout.width;
        const left = layout.left;
        const right = layout.right;

        return <MainWrap>
            <EveryDay>
                <CenterText>有一只小船飘在海洋中，摇摇摆摆</CenterText>
            </EveryDay>
            <TagList/>
            <Wrap left={left} w={w} right={right}>

                <div className="block-left">
                    <CommonList list={list} status={list.status}/>
                </div>
                <div className="block-right"></div>
            </Wrap>
        </MainWrap>

    }
}

const ConnMain = connect((state, props) => {
    return {
        layout: state.app.layout,
        list: state.posts.list,
    }
})(MainPage)

export default ConnMain