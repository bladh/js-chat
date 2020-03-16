import React from 'react'
import './App.css'

import MessageWindow from './MessageWindow'
import TextBar from './TextBar'
import { registerOnMessageCallback, send } from './websocket'

export class App extends React.Component {
  state = {
    messages: [],
    username: null
  }

  constructor (props) {
    super(props)
    registerOnMessageCallback(this.onMessageReceived.bind(this))
  }

  onMessageReceived (msg) {
    msg = JSON.parse(msg)
    this.setState({
      messages: this.state.messages.concat(msg)
    })
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
      <div className='container'>
        <h1>YuChat</h1>
        <MessageWindow messages={this.state.messages} username={this.state.username} />
        <TextBar onSend={sendMessage} />
      </div>
    )
  }
}

export default App
