import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom'
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import reduxThunk from 'redux-thunk'

import App from './App';
import reducers from './reducers'
import {alertManager} from './shared/sharedLogic/reduxMiddlware'
import Signin from './components/auth/Signin'
import Signup from './components/auth/Signup'
import UserProfile from './components/auth/UserProfile'
import AddRestuarant from './components/restuarants/AddRestuarant'

const store = createStore(
  reducers,
  {
    auth: {
      authenticated: localStorage.getItem('token'),
      connectedUser: JSON.parse(localStorage.getItem('connectedUser'))
    }
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
        <Route path="/signup" component={Signup} />
        <Route path="/signin" component={Signin}/>
        <Route path="/profile" component={UserProfile}/>
        {/**Change the path from 'profile' to :_id */}
        <Route path="/newRestuarant" component={AddRestuarant}/>
      </App>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);