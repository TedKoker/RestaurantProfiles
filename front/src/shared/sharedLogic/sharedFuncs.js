export function strToObj(str) {
    if(str[0]!=="{" && str[str.length-1]!=="}") {
        return str
    }

    let fixStr = str.slice(1, str.length-1)
                    .split(",")
                    .map(x=> x.split(":").map(y=>y.trim()).map(z=>{
                        if(z[0]==="\"" && z[z.length-1]==="\"") {
                            return z
                        } else {
                            return `\"${z}\"`
                        }
                    }).join(":"))
                    .join(",")
    console.log(fixStr)
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

export function stringToPropName (str) {
    return str.trim()
                .split(/ \s*/).map((value, index) => {
                    if(index!==0) {
                        return `${value[0].toUpperCase()}${value.substring(1)}`
                    } else {
                        return value
                    }
                }).join("")
}