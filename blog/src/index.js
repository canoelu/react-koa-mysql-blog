import React from 'react';
import {render, actions} from 'mirrorx'

import './store'
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
render(<App/>, document.getElementById('root'));
registerServiceWorker();
actions.login.getToken()
