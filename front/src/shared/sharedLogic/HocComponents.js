import React, {useEffect} from 'react'
import {compose} from 'redux'
import { connect } from 'react-redux'

export  function RequireAuth (ChildComponent) {

    function ComponentComposed(props) {
        
        useEffect(() => {
            if(!props.auth) {
                props.history.push('/signin')
            }
        }, [props.auth])

        return (
            <ChildComponent {...props}/>
        )
    }

    function mapStateToProps(state) {
        return {auth: state.auth.authenticated}
    }

    // return compose(
    //     //connect(mapStateToProps),
    //     reduxConnection(args)
    // )(ComponentComposed)
    return connect(mapStateToProps)(ComponentComposed)
}

export  function OnlyGuests (ChildComponent) {

    function ComponentComposed(props) {
        
        useEffect(() => {
            if(props.auth) {
                props.history.push('/profile')
            }
        }, [props.auth])

        return (
            <ChildComponent {...props}/>
        )
    }

    function mapStateToProps(state) {
        return {auth: state.auth.authenticated}
    }

    return connect(mapStateToProps)(ComponentComposed)
}