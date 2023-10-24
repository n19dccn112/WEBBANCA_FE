import React, {Component} from 'react'

import get from '../../api/callAPI';
import User from './User';

export default class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    }
  }
  componentDidMount() {
    get('users')
        .then(res => {
          if (res !== undefined)
            if (res.status === 200)
              this.setState({
                users: res.data
              });
        });
  }
  render() {
    var listUsers = this.state.users
    return (
        listUsers.map((user, index) => {
          return (
              <User key={index}
                    id={user.userId}
                    username={user.username}
                    roleName={user.roleName}
                    deleteUser={(id) => this.props.deleteUser(id)}
              />
          )

        })
    );
  }
}
