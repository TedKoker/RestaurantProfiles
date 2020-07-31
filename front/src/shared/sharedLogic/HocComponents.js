import React, {useEffect} from 'react'
import {compose} from 'redux'
import { connect } from 'react-redux'

// export function RequireAuth(ChildComponent)  {

//     function composeComponent(props) {

//         useEffect(() => {
//             if(!props.auth) {
//                 props.history.push('/signin')
//             }
//         }, [props.auth])

//         return (
//             <ChildComponent {...props} />
//         )
//     }

//     function mapStateToProps(state) {
//         return {
//             auth: state.auth.authenticated
//         }
//     }

//     return connect(mapStateToProps)(composeComponent)
// } 

export default (ChildComponent, cnt, args) => {
    console.log('hello')
    function ComponentComposed(props) {
        useEffect(() => {
            console.log('enter')
            if(!props.auth) {
                props.history.push('/signin')
            }
        }, [props.auth])

        return (
            <ChildComponent {...props}/>
        )
    }

    function mapStateToProps(state) {
        console.log('from inside')
        return {auth: state.auth.authenticated}
    }

    return connect(mapStateToProps)(ComponentComposed)
    // return compose(connect(mapStateToProps),
    //      ...cnt(args))(ComponentComposed)
}