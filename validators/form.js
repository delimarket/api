const make = function (message, type) {
    let ret = {}

    if(type==0) {
        ret.type='error'
    } else {
        ret.type='succes'
    }

    ret.message=message

    return ret
}

//phone

const v_phone = (ph) => {
    let regex = /[0-9]/

    if(ph.length!=9) {
        return false
    }

    for(let letter of ph) {
        if(!regex.test(letter)) {
            return false
        }
    }

    return true
}

//name

const v_name = (n) => {
    let regex = [/[a-z]/, /[A-Z]/]
    let pl_znaki = 'ńśćłżźóęą'

    for (let letter of n) {
        if(!regex[0].test(letter) && !regex[1].test(letter) && letter!=" " && pl_znaki.indexOf(letter)<0) { return {statut:false} }
    }

    if(n.search(" ")<0) { return {statut:false} }

    let ret = ""
    n=n.split(" ")
    n.map((word) => {
        word=word[0].toUpperCase()+word.substr(1)
        ret+=word+" "
    })

    return {
        statut:true,
        word:ret.substring(0,ret.length-1)
    }
}

console.log(v_name("piotr Baranski"))
console.log(v_name("Piotr Barański"))
console.log(v_name("jasdbfsdfisd"))

module.exports={
    make,
    v_phone,
    v_name
}