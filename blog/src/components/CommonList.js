import React, {Component} from 'react'
import {Link, actions} from 'mirrorx'
import {Spin, Icon, Alert, Button} from 'antd'
import styled from 'styled-components'
import parseDate from './../util/parseDate'
import debounce from 'lodash/debounce'

const ListItem = styled.div`
    margin:10px;
    .article-date{
        display:flex;
        justify-content:space-between;
        line-height: 26px;
        color: #acb1b4;
        span{
            margin-left:5px;
        }
    }
`

const StyledTitle = styled.h2`
  display: flex;
  font-size: 20px;
  line-height: 1.4;
  white-space: normal;
  overflow: hidden;
  justify-content:space-between;
  a{
    color:#1e1e1e
  }
  a:hover{
    color:#acb1b4;
    transition:all .25s ease-out
  }
  .title{
      width:80%;
      text-overflow: ellipsis;
      overflow:hidden;

  }
  .username{
    float: left;
    line-height: 26px;
    padding-left: 30px;
    color: #acb1b4;
  }
  
  @media only screen and (max-width: 700px) {
    font-size: 18px;
    line-height: 22px;
  }
`
const Desc = styled.div`
    margin:10px 0;
    line-height: 1.4;
    min-height:50px;
    max-height:200px;

`
const LoadMore = styled.div`
  display: flex;
  align-items: center;
  height: 60px;
  justify-content: center;
`
const Title = ({id, title, tag}) => (
    <StyledTitle>
        <Link to={`/content/${id}`}>
            <span className='title'>{title}</span>

        </Link>

    </StyledTitle>
)
const Footer = ({date, username}) => (<div className='article-date'>
    <div>
        <Icon type='clock-circle-o'/>
        <span>{parseDate(date)}</span>
    </div>

    <div className='username'>{username}</div>
</div>)


const Description = ({description}) => (<Desc>{description}</Desc>)

class ArticleItem extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {title, author, description, meta, _id} = this.props;
        const username = author && author.username;
        const date = meta && meta.updateAt;
        return <ListItem>
            <Title title={title} id={_id}/>
            <Description description={description}/>
            <Footer date={date} username={username}/>
        </ListItem>
    }

}

class CommonList extends Component {
    isBottom = (offset = 200) => {
        return (window.pageYOffset + window.innerHeight) >= (document.documentElement.scrollHeight - offset)
    }
    autoLoadMore = debounce(() => {
        console.log(this.isBottom())
        const {status} = this.props;
        if (this.isBottom() && status !== 'loading' && status !== 'noMore') {
            this.loadMore()
        }
    }, 300)
    loadMore = () => {
        actions.posts.nextPage()
        actions.posts.getPostsList()
    }

    componentWillMount() {
        window.addEventListener('scroll', this.autoLoadMore, false)
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.autoLoadMore)
    }


    render() {
        const {status, list} = this.props;
        const {data} = list
        return <div>
            {
                data.map(item => <ArticleItem {...item} key={item._id}/>)
            }

            <LoadMore>
                {
                    ({
                        loading: <Spin/>,
                        noMore: <Alert message="没有更多数据了" type="warning" style={{flex: 1}}/>,
                        failed: <Alert message="获取数据失败" type="error" style={{flex: 1}}/>,
                        loaded: <Button onClick={() => this.loadMore()}>加载更多</Button>
                    })[this.props.status]
                }
            </LoadMore>
        </div>
    }
}

export default CommonList;