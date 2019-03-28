import React, {Component} from 'react';
import {Switch, Route, Redirect, Router, connect} from 'mirrorx'
import Layout from './container/Layout'
import Index from './container/Index'
import Login from './components/Login'
import Reg from './components/Reg'
import Content from './container/Content'
import {history} from './util/'

class App extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/login" component={Login}/>
                    <Route path="/reg" component={Reg}/>
                    <Route path="*" component={Index}/>
                </Switch>
            </Router>
        );
    }
}

const connApp = connect(state => {
    return {
        login: state.login
    }
})(App);

export default connApp;
