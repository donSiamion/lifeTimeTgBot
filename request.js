import fetch from 'node-fetch'

let botToken = '5756457218:AAFmqyYMN2XsJW5i0iExXKIIuctHO2PGjhg'

const sleep = m => new Promise(r => setTimeout(r, m))

async function sendMessage(urlEnd, body) {
    console.log(JSON.stringify(body))
    const response = await fetch('https://api.telegram.org/bot' + botToken + urlEnd, {
        method: 'post',
        body,
        headers: {'Content-Type': 'application/x-www-form-urlencoded', 'accept': 'application/json'}
    });
    const data = await response.json();
    
    console.log(data.ok)
}

export default {
    sendMessage,
    sleep
}