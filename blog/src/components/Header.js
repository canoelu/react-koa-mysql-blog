import React, {Component} from 'react'
import {Input, Button, Dropdown, Menu, Icon, AutoComplete, Badge} from 'antd'
import {Link, actions} from 'mirrorx'
import styled from 'styled-components'
import {history} from '../util/index'
import {triangle} from 'polished'
import logo from '../asserts/logo.jpg'

const StyledHeader = styled.header`
  background-color: #fff;
  box-shadow: 0 1px 2px 0 rgba(0,0,0,0.1);
  margin-bottom:10px;
  .container {
    position: relative;
    width: ${props => props.w}px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    padding-top: 19px;
    padding-bottom: 20px;
    justify-content: space-between;
    height: 100%;
  }
  .nav-customer{
    width:100%;
    height:40px;
    background-color: #1e1e1e;
    font-size: 11px;
    }
  .flex-align-center {
    display: flex;
    align-items: center;
  }
  .btn-search {
    display: none;
    font-size: 20px;
    color: #aaa;
  }
  .search {
    width: 200px;
  }
`;
const Logo = styled.div`
     font-size: 20px;
      font-weight: bold;
      margin-right: 15px;
      a {
        text-decoration: none;
      }
`;
const User = styled.div`
    display: flex;
  flex-direction: row-reverse;
  margin-left: 20px;
`;
const StyledMenu = styled(Menu)`
  margin-top: 16px;
  padding: 6px 0;
  color: #333;
  &:before {
    content: '';
    position: absolute;
    top: -9px;
    margin-left: -9px;
    left: 50%;
    ${triangle({pointingDirection: 'top', width: '18px', height: '9px', foregroundColor: '#ddd'})}
  }
  &:after {
    content: '';
    position: absolute;
    top: -8px;
    margin-left: -8px;
    left: 50%;
    ${triangle({pointingDirection: 'top', width: '16px', height: '8px', foregroundColor: '#fff'})}
  }
  .ant-dropdown-menu-item, .ant-dropdown-menu-submenu-title {
    font-size: 14px;
    padding: 8px 25px;
    .anticon {
      margin-right: 3px;
    }
  }
  .ant-badge-count {
    height: 16px;
    line-height: 16px;
  }
`;
const Channel = styled.div`
  font-size: 15px;
  a {
    display: inline-block;
    padding: 0 15px;
    margin: 0 5px;
    min-width: 50px;
    text-align: center;
    border-radius: 4px;
    line-height: 26px;
    color: #888;
    &:hover {
      text-decoration:underline;
      transition: all .25s ease-out;

    }
    &.active {
      text-decoration:underline;
      transition: all .25s ease-out;
      color: #acb1b4;
    }
  }
  @media only screen and (max-width: 700px) {
    position: absolute;
    top: 52px;
    left: 0;
    width: 100%;
    background-color: #fafafa;
    overflow-x: auto;
    white-space: nowrap;
    border-top: 1px solid #eee;
    box-shadow: 0 1px 2px 0 rgba(0,0,0,0.1);
    a {
      line-height: 35px;
      &.active {
        color: #f46e65;
        background-color: transparent;
        position: relative;
        &:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          height: 2px;
          width: 100%;
          background-color: #f46e65;
        }
      }
    }
  }
`;
const Avatar = styled.div`
  display: inline-block;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background-color: #eee;
  background-position: 50% 50%;
  background-size: cover;
  background-image: url(${props => props.src});
  cursor: pointer;
`

const menu = [{
    name: '主页',
    url: '/index'
}, {
    name: '文章',
    url: '/article'
},
    {
        name: '生活随笔',
        url: '/life'
    }, {
        name: '关于我',
        url: '/about'
    }
]

class Header extends Component {
    constructor(props) {
        super(props)
        this.state = {
            choose: {}
        }
    }

    showLogin() {
        actions.login.showModal(true)
    }

    chooseMenu = (item) => {
        this.setState({
            choose: item
        })
    }

    onSearch = (val) => {
        history.push('/article')
        actions.posts.resetList()
        actions.posts.updateList({
            keyword: val
        })
        actions.posts.getPostsList()
    }

    render() {
        const DropdownMenu = (
            <StyledMenu>
                <Menu.Item>
                    <Link to={`/user`}>
                        <Icon type="user"/>
                        <span>个人主页</span>
                    </Link>
                </Menu.Item>
                <Menu.Item>
                    <Link to={`/posts/list`}>
                        <Icon type="profile"/>
                        <span>文章列表</span>
                    </Link>
                </Menu.Item>
                <Menu.Item>
                    <Link to="/post">
                        <Icon type="edit"/>
                        <span>写文章</span>
                    </Link>
                </Menu.Item>
                <Menu.Item>
                    <div onClick={this.logout}>
                        <Icon type="logout"/>
                        <span>退出</span>
                    </div>
                </Menu.Item>
            </StyledMenu>
        )
        const {layout, hideSearch, user, suggest, avatar, unread, currentPath} = this.props
        console.log(currentPath)
        const {header: height, width} = layout;
        return <StyledHeader h={height} w={width}>
            <div className='nav-customer'>汐汐小窝</div>
            <div className={`container`}>
                <div className="flex-align-center left-header">
                    <Logo>
                        <Link to="/">
                            <img src={logo}/>
                        </Link>
                    </Logo>
                    <Channel span={10}>
                        {
                            menu.map((item, idx) => {
                                return <Link to={item.url} key={idx}
                                             className={currentPath === item.url ? 'active' : ''}
                                             onClick={(e) => this.chooseMenu(item)}>{item.name}</Link>
                            })
                        }

                    </Channel>
                </div>
                <div className="flex-align-center right-header">
                    {
                        hideSearch
                            ? null
                            : <Input.Search placeholder="搜索"
                                            size="default"
                                            ref={input => this.searchIpt = input}
                                            onSearch={value => this.onSearch(value)}/>
                    }
                    {hideSearch ? null : <Icon type="search" className="btn-search" onClick={this.showMobileSearch}/>}
                    <User id="user-header">
                        {
                            user.status === 'online'
                                ? <Dropdown getPopupContainer={this.getUserNode} trigger={['click', 'hover']}
                                            placement="bottomCenter" overlay={DropdownMenu}>
                                    <Badge count={unread} dot={!!unread}>
                                        <Avatar src={avatar}/>
                                    </Badge>
                                </Dropdown>
                                : <Button onClick={this.showLogin}>登录</Button>
                        }
                    </User>
                </div>
            </div>
        </StyledHeader>
    }
}

export default Header