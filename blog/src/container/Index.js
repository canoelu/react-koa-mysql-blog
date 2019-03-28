import React, {Component} from 'react'
import {actions, connect, Route, Switch, Redirect} from 'mirrorx'
import {BackTop, Button} from 'antd'
import {FixedHeader} from "./ConnHeader";
import Main from "./Main";

import LoginModal from './LoginModal'
import Post from "./Post";
import User from "./User";
import PostList from "./PostList";
import Article from "./Article";
import Content from "./Content";
import styled from "styled-components";

const Footer = styled.div`
    background:#e1e1e1;
    height:80px;
    line-height:80px;
    text-align:center
`
const MainContent = styled.div`
    min-height:500px
`

const PrivateRoute = ({component: Component, status, ...rest}) => {
    return <Route {...rest} render={props => {
        switch (status) {
            case 'online':
                return <Component {...props}/>
            case 'offline':
                return <Redirect to={{
                    pathname: '/login',
                    state: {from: props.location}
                }}/>
            default:
                return null
        }
    }
    }/>
};

class Index extends Component {

    constructor(props) {
        super(props)
    }

    componentWillMount() {
        actions.app.routeChange(this.props.location)
        this.unlisten = this.props.history.listen((location) => {
            actions.app.routeChange(location)
        })
    }

    componentWillUnmount() {
        this.unlisten()
    }

    componentDidMount() {
        actions.posts.resetList();
    }

    render() {
        const userStatus = this.props.userStatus;

        return <div>
            <FixedHeader/>
            <MainContent>
                <Switch>
                    <Route exact path="/index" component={Main}/>
                    <Route path="/content/:id" component={Content}/>
                    <Route path="/article" component={Article}/>
                    <PrivateRoute path="/user" status={userStatus} component={User}/>
                    <PrivateRoute status={userStatus} path="/post/:id" component={Post}/>
                    <PrivateRoute status={userStatus} path="/post" component={Post}/>
                    <PrivateRoute status={userStatus} path="/posts/list" component={PostList}/>
                    <Redirect to="/index"/>
                </Switch>
            </MainContent>
            <Footer>
                canoe汐露的学习之路，记录天南地北，记录花草树木，记录你我他，记录····
            </Footer>
            <BackTop>
                <Button icon="up" size="large" style={{width: 40, height: 40, fontSize: 20}}/>
            </BackTop>
            <LoginModal/>

        </div>
    }
}

const ConnIndex = connect(state => {
    return {
        userStatus: state.login.status,

    }
})(Index);
export default ConnIndex