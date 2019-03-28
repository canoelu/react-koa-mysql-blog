import React, {Component} from 'react'
import {actions, connect} from 'mirrorx'
import styled from 'styled-components'

const TagWrap = styled.div`
    display:flex;
    flex-wrap:wrap;
    width:${props => props.w}px;
    margin: 10px auto;
    .tag-list{
        color: #acb1b4;
        padding: 15px 0 ;
        li{
            list-style: none;
            float: left;
            padding: 0 15px;
            a{
                display: inline-block
                color:#1e1e1e;
                padding: 2px 10px;
                border:1px solid #acb1b4;
                border-radius:5px;
                transition: all .3s ease-in-out;
            }
          
            a.active,a:hover{
                background-color: #1e1e1e;
                color: #f7f8f9;
                transition: all .3s ease-in-out;
                text-decoration: none
            }
        }
        
`

class TagList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tag: {}
        }
    }

    componentDidMount() {
        actions.posts.getTagList();
    }

    chooseTag = (tag) => {
        this.setState({
            tag
        });
        actions.posts.resetList();
        actions.posts.updateList({
            tagId: tag._id
        })
        actions.posts.getPostsList()
    }

    render() {
        const {layout} = this.props;
        const w = layout.width;
        const {list} = this.props.tag;
        return <TagWrap w={w}>
            <ul className='tag-list'>
                <li>
                    <span>VIEW BY</span>
                </li>

                {
                    list && list.map((item, idx) => {
                        return <li key={idx}
                                   onClick={() => {
                                       this.chooseTag(item)
                                   }}>
                            <a className={this.state.tag._id === item._id ? 'active' : ''}>{item.name}</a>
                        </li>
                    })
                }
            </ul>
        </TagWrap>
    }
}

export default connect(state => {
    return {
        layout: state.app.layout,
        tag: state.posts.tag
    }
})(TagList)