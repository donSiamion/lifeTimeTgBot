import * as http from 'http';
import request from './request.js'
import users from './users.js'

const hostname = '127.0.0.1'
const port = 3000

const users = users.getUsers()

const menuButtons = `reply_markup={
  "keyboard": [
    [{ "text": "add" },
     { "text": "reduce" }
    ],[
     { "text": "price" },
     { "text": "value" }
    ],[
      { "text": "starting" }
    ]
  ]}`

const priceMenu = `reply_markup={
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
      console.log(user)
      users.addUser(user)
      request.sendMessage('/sendMessage', JSON.stringify(menuButtons))
    } else {
      switch (message.text) {
        case "add":
        case "reduce":
        case "price":
        case "value":
          user.lastMessage = message.text    
          request.sendMessage('/sendMessage', JSON.stringify(priceMenu))
        case "5":
        case "10":
        case "20":
        case "50":
          let key = user.lastMessage
          user[key] = +message.text
          users.updateUser(user)
          request.sendMessage('/sendMessage', JSON.stringify(removeMarkup))
        default:
          break;
      }
    }
    
  });

  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello World')
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
});

