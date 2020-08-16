export function strToObj(str) {
    if(str[0]!=="{" && str[str.length-1]!=="}") {
        return str
    }

    let fixStr = str.slice(1, str.length-1)
                    .split(",")
                    .map(x=> x.split(":").map(y=>y.trim()).map(z=>`\"${z}\"`).join(":"))
                    .join(",")
    
    return JSON.parse(`{${fixStr}}`)
}

export function arrToObj(arr) {
    if(!Array.isArray(arr)) {
        return arr
    }

    const funcArr = [...arr]
    // console.log(funcArr)

    return funcArr.map(value => {
        if(Array.isArray(value)) {
            return arrToObj(value)
        } else {
            return strToObj(value)
        }
    })
}