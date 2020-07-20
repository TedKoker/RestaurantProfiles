import React, { useEffect, useRef, useState, useCallback } from 'react';
import {connect} from 'react-redux'
import Alert from 'react-bootstrap/Alert'
import {CSSTransition} from 'react-transition-group'
import './app.scss'

import HeadNav from './components/HeadNav'
import { Fade } from 'react-bootstrap';

function App(props) {

  const [isAlertOpen, setAlert] = useState(true)

  const [alertTop, setAlertTop] = useState(0)

  const handleClick = useCallback(() => {
    setAlert(!isAlertOpen)
  })

  const headRef = useRef()

  
  useEffect(() => {
    console.log(headRef)
    if(headRef) {
      setAlertTop(window.getComputedStyle(headRef.current).getPropertyValue('height'))
      //console.log(headRef)
    }
  }, [headRef])

  return (
    <>
      <HeadNav ref={headRef}/>
      <Alert variant="danger" 
        show={isAlertOpen} 
        onClick={handleClick} 
        transition={Fade} 
        style={{top: alertTop}} 
        dismissible>
        <Alert.Heading>Oops...</Alert.Heading>
        test
      </Alert>
      <button onClick={handleClick}>test</button>
      <div className="main-div">
        {props.children}
      </div>
    </>
  );
}

function mapToProps(state) {
  //console.log('map to props', state)
  return {auth: state.auth.authenticated}
}

export default connect(mapToProps)(App);
