import request from './request.js'

function start(user) {
    user.timerStart = true
    sendTimerMessage(user)
}

function stop(user) {
    user.timerStart = false
    delete user.timerMessageId
}

function sendTimerMessage(user) {
    if (!user.timerMessageId) {
        let resp = request.sendMessage('/sendMessage', JSON.stringify({text: getUserTime(user)}))
        user.timerMessageId = resp.message_id
    } else {
        user.balance = user.balance - 1
        if (user.timerStart) {
            request.sendMessage('/editMessageText', JSON.stringify({
                message_id: user.timerMessageId,
                text: getUserTime(user)
            }))
            setTimeout((user)=> {sendTimerMessage(user)}, 1000)
        }
    }

}

function getUserTime(user) {
    let second = ('0' + ~~(user.balance%60)).slice(-2)
    let min = ('0' + ~~(user.balance/60)%60).slice(-2)
    let hour = ('0' + ~~(user.balance/3600)%24).slice(-2)
    let day = ~~(user.balance/86400)%7
    let month = ('0' + ~~(user.balance/2592000)%12).slice(-2)
    let year = ('000' + ~~(user.balance/31536000)).slice(-4)

    return `${year}:${month}:${day}:${hour}:${min}:${second}`
}

export default {
    start,
    stop
}