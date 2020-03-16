import React from 'react'

const User = ({ name }) => (
  <div className='user'>{name}</div>
)

export default class UserList extends React.Component {
  render () {
    const { users = [] } = this.props
    return (
      <div className='friend_list'>
        <h4>Users online</h4>
        <div className='list'>
          {users.map((user) => {
            return <User key={user.id} name={user.username} />
          })}
        </div>
      </div>
    )
  }
}
