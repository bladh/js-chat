import React from 'react'
import './App.css'

import MessageWindow from './MessageWindow'
import UserList from './UserList.jsx'
import TextBar from './TextBar'
import { registerOnMessageCallback, send } from './websocket'

export class App extends React.Component {
  state = {
    messages: [],
    users: [],
    username: null
  }

  constructor (props) {
    super(props)
    registerOnMessageCallback(this.onMessageReceived.bind(this))
  }

  onMessageReceived (msg) {
    msg = JSON.parse(msg)
    if ('text' in msg) {
      this.setState({
        messages: this.state.messages.concat(msg)
      })
    }
    if ('user_list' in msg) {
      console.log("Set new users")
      console.log(msg)
      this.setState({users: msg.user_list})
    }
  }

  logIn (name) {
    this.setState({ username: name })
    const login_message = {
      username: name
    }
    send(JSON.stringify(login_message))
  }

  sendMessage (text) {
    const message = {
      text: text
    }
    send(JSON.stringify(message))
  }

  render () {
    const logIn = this.logIn.bind(this)
    const sendMessage = this.sendMessage.bind(this)

    if (this.state.username === null) {
      return (
        <div className='container'>
          <h1>YuChat</h1>
          <div className='enter_name'>Enter username</div>
          <TextBar onSend={logIn} />
        </div>
      )
    }
    return (
      <>
      <h1>YuChat</h1>
      <div className='content'>
        <div className='container'>
          <MessageWindow messages={this.state.messages} username={this.state.username} />
          <TextBar onSend={sendMessage} />
        </div>
        <UserList users={this.state.users}/>
      </div>
      </>
    )
  }
}

export default App
