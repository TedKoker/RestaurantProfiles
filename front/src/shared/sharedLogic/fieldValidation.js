export const required = (value) => {
    if(value) {
        return false
    } else {
        return 'field is required'
    }
}

export const mustBePattern = (regex, errMessage) => value => {
    if(regex.test(value)) {
        return false
    } else {
        return errMessage
    }
}

export const mustBeLength = number => value => {
    if(value.length < number) {
        return `Must be at least ${number} characters long`
    } else {
        return false
    }
}