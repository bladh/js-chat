// import the express and express-ws libraries
const express = require('express')
const expressWs = require('express-ws')
const uuid = require('uuid/v4')

// create a new express application
const app = express()
// decorate the app instance with express-ws to have it
// implement websockets
expressWs(app)

// Create a new set to hold each clients socket connection
const connections = new Set()
const users = {}

const broadcast = (message) => {
  connections.forEach((conn) => conn.send(JSON.stringify(message)))
}

const update_user_list = () => {
  const user_list = Object.keys(users).map((id) => {
    return {username: users[id].name, id:id }
  })
  const json = JSON.stringify({
    user_list: user_list,
  })
  connections.forEach((conn) => {
    conn.send(json)
  })
}

const privmsg = (from_id, to_id, message) => {
  if (!'from_id' in users) {
    console.log("Sending privmsg from nonexisting user")
    return
  }
  if (!'to_id' in users) {
    console.log("Sending privmsg to nonexisting user")
    return
  }
  const msg = {
    'username': users[from_id].name,
    'text': message,
    'private': true,
  }
  users[to_id].ws.send(JSON.stringify(msg))
}

// We define a handler that will be called everytime a new
// Websocket connection is made
const wsHandler = (ws) => {
  // Add the connection to our set
  connections.add(ws)
  const id = uuid()
  var name;

  // We define the handler to be called everytime this
  // connection receives a new message from the client
  ws.on('message', (message) => {
    data = JSON.parse(message)

    if ('username' in data && !name) {
      if (data.username === 'Administrator') {
        ws.send(JSON.stringify({username: "Administrator", text:"I don't think so."}))
        connections.delete(ws)
        return
      }

      name = data.username
      users[id] = {
        name: name,
        ws: ws,
      }
      const welcome = {
        username: "Administrator",
        text: "Welcome " + name
      }
      update_user_list()
      ws.send(JSON.stringify({username: "Administrator", text:"Welcome " + name + "."}))
    } else {
      if (!name) {
        console.log("Received message from connection that has not set a username")
        return
      }
      console.log("Message from " + name)
      const chat = {
        username: name,
        text: data.text
      }
      broadcast(chat)
    }
  })

  // Once the client disconnects, the `close` handler is called
  ws.on('close', () => {
    // The closed connection is removed from the set
    connections.delete(ws)
    delete users[id];
    update_user_list()
  })
}

// add our websocket handler to the '/chat' route
app.ws('/chat', wsHandler)

// host the static files in the build directory
// (we will be using this later)
app.use(express.static('build'))

// start the server, listening to port 8080
app.listen(8080)
