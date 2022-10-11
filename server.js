import * as http from 'http'
import request from './request.js'
import usersFunctions from './users.js'
import timer from "./timer.js"

const hostname = '127.0.0.1'
const port = 3000

const users = usersFunctions.getUsers()

const settingsButtons = `reply_markup={
  "keyboard": [
    [{ "text": "add" },
     { "text": "reduce" }
    ],[
     { "text": "price" },
     { "text": "balance" }
    ],[
      { "text": "start" },
      { "text": "parameters" }
    ],[
      { "text": "average costs"}
    ]
  ]}`

const menu = `reply_markup={
  "keyboard": [
    [
      { "text": "menu" }
    ]
  ]}`

const priceButtons = `reply_markup={
  "keyboard": [
    [{ "text": "5" },
     { "text": "10" }
    ],[
     { "text": "20" },
     { "text": "50" }
    ]
  ]}`

const removeMarkup = `reply_markup={"remove_keyboard": true}`

const server = http.createServer((req, res) => {
  let body = []
  req.on('data', (chunk) => {
    body.push(chunk)
  }).on('end', () => {
    body = Buffer.concat(body).toString()
    console.log(body)
    let message = JSON.parse(body).message
    let chat = message.chat
    let user = {
      id: chat.id,
      name: chat.username
    }

    if (req.entities) {

    }

    if (!users[user.id]) {
      usersFunctions.addUser(user)
      usersFunctions.setTime(user)
      request.sendMessage('/sendMessage', JSON.stringify(settingsButtons))
    } else {
      let user = users[user.id]
      let menuItemGeted = false
      switch (message.text) {
        case "add":
        case "reduce":
        case "price":
        case "balance":
          user.lastMessage = message.text
          request.sendMessage('/sendMessage', JSON.stringify(priceButtons))
          menuItemGeted = true
          break
        case "start":
          request.sendMessage('/sendMessage', JSON.stringify(menu))
          menuItemGeted = true
          this.timer(users)
          break
        case "parameters":
          request.sendMessage('/sendMessage', JSON.stringify(users))
          menuItemGeted = true
          break
        case "menu":
          request.sendMessage('/sendMessage', JSON.stringify(settingsButtons))
          menuItemGeted = true
          break
        case "average costs":
          user.lastMessage = "averageCost"
          request.sendMessage('/sendMessage', JSON.stringify({text: "enter yor month average costs"}))
          menuItemGeted = true
          break
        default:
          break
      }

      if (!menuItemGeted && +message.text >= 0) {
        if (["add", "reduce", "price", "balance"].includes(user.lastMessage)) {
          let value = +message.text
          let key = user.lastMessage
          switch (user.lastMessage) {
            case "price":
              user[key] = value
              break
            case "balance":
              user[key] = value * (user.price/2592000 || 1)
              break
            case "add":
              users.addValue(user, value)
              break
            case "reduce":
              users.reduceValue(user, value)
              break
            default:
              break
          }
          request.sendMessage('/sendMessage', JSON.stringify(menu))
        }

        if (user.lastMessage == 'averageCost') {
          let key = user.lastMessage
          user[key] = +message.text
          request.sendMessage('/sendMessage', JSON.stringify(menu))
        }
      }
    }
    
  });

  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello World')
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})