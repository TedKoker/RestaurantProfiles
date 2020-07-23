import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import reduxThunk from 'redux-thunk'

import App from './App';
import reducers from './reducers'
import Signin from './components/auth/Signin'
import Signup from './components/auth/Signup'
import WelcomeUser from './components/WelcomeUser'

const store = createStore(
  reducers,
  {
    auth: {authenticated: localStorage.getItem('token')}
  },
  applyMiddleware(reduxThunk)
)

/**Create High Oreder Components,
 * That does not give acssess to 'login'
 * 
 * Create Pages for normal users to check restuarant profiles,
 * thta will be a home page
 */

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App>
        <Route path="/" exact component={Signup} />
        <Route path="/signin" component={Signin}/>
      </App>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);