module.exports = {
    /** 'emailRegex' check if it is a valid email adress */
    emailRegex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    
    /** 'passwordRegex' checks for valid password
     *  Valid password must contain Atleast 8 characters, 
     *  One lowercase, one uppercase, one number and one special character, No whitspaces
     */
    passwordRegex: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,})$/
}