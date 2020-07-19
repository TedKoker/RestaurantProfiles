import React, { useEffect } from 'react';
import {connect} from 'react-redux'
import './app.scss'

import HeadNav from './components/HeadNav'

function App(props) {
  useEffect(() => {
    //console.log(props)
  },[props])
  return (
    <div>
      <HeadNav />
      <div className="main-div">
        {props.children}
      </div>
    </div>
  );
}

function mapToProps(state) {
  //console.log('map to props', state)
  return {auth: state.auth.authenticated}
}

export default connect(mapToProps)(App);
