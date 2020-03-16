import React from 'react'

const User = ({ name }) => (
  <div className='user'>{name}</div>
)

export default class UserList extends React.Component {
  render () {
    const { users = [] } = this.props
    return (
      <div className='friend_list'>
        <h4>Friends</h4>
        <div className='list'>
          {users.map((user, i) => {
            return <User key={i} name={user} />
          })}
        </div>
      </div>
    )
  }
}
