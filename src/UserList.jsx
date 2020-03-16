import React from 'react'

const User = ({ user }) => (
  <div className='user'>
    <button>Privmsg</button>
    {user.username}
  </div>
)

export default class UserList extends React.Component {
  render () {
    console.log("Re-rendering userlist!")
    const { users = [], priv_msg_user } = this.props
    return (
      <div className='friend_list'>
        <h4>Users online</h4>
        <div className='list'>
          {users.map((user) => {
            return <User key={user.id} user={user} />
          })}
        </div>
      </div>
    )
  }
}
