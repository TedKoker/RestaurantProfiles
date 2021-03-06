import React, { useEffect, useRef, useState, useCallback } from 'react';
import {connect} from 'react-redux'
import Alert from 'react-bootstrap/Alert'
import { Fade } from 'react-bootstrap';
import './app.scss'

import HeadNav from './components/HeadNav'
import * as actions from './actions'

function App(props) {

  const [isAlertOpen, setAlert] = useState(alert.errorMessage !== undefined)

  const [alertTop, setAlertTop] = useState(0)

  const handleClick = useCallback(() => {
    setAlert(false)
  })

  useEffect(() => {
    if(!isAlertOpen) {
      /**The purpose of the TimeOut function is to wait
       * untill the animation is finished to nullify all of the errors,
       * to prevent bugs in the animation
       */
      setTimeout(() => {
        props.nullifyAuthErrors()
      }, 200)
    }
  },[isAlertOpen])

  const headRef = useRef()

  
  useEffect(() => {
    if(headRef) {
      setAlertTop(window.getComputedStyle(headRef.current).getPropertyValue('height'))
    }
  }, [headRef])

  useEffect(() => {
    setAlert(props.alert !== undefined && props.alert !== "" )
  },[props])

  return (
    <div>
      <HeadNav ref={headRef}>
        
      <Alert variant={props.alertVariant}
        show={isAlertOpen} 
        onClick={handleClick} 
        transition={Fade} 
        //style={{bottom: 50}} 
        dismissible>
        <Alert.Heading as="h6">{props.alertHeading}</Alert.Heading>
        {props.alert}
      </Alert>
      </HeadNav>
      <div className="main-div">
        {props.children}
      </div>
    </div>
  );
}

function mapToProps(state) {
  let alertVariant, alertHeading, alertMessage

  if(state.auth.errorMessage) {
    alertVariant="danger"
    alertHeading="Oops..."
    alertMessage=state.auth.errorMessage
  }
  if(state.auth.successMessage) {
    alertVariant="success"
    alertHeading = "Welcome"
    alertMessage = state.auth.successMessage
  }

  if(state.actionAlert.actionSucceed) {
    alertVariant="success"
    alertHeading = "Action Succeed"
    alertMessage = state.actionAlert.actionSucceed
  }

  if(state.actionAlert.actionFaild) {
    alertVariant="danger"
    alertHeading = "Action faild"
    alertMessage = state.actionAlert.actionFaild
  }

  return {
    auth: state.auth.authenticated,
    alert: alertMessage,
    alertVariant, alertHeading
    /**
     * When I will have a couple types of alerts,
     * use the || symbol and put all of the varibles from redux, and react will take the first that is true
     */
  }
}

export default connect(mapToProps, actions)(App);
