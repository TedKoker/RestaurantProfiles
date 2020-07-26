export const alertManager = store => next => action => {
    const result = next(action)
    console.log(store)
    console.log(result)
    return result
}