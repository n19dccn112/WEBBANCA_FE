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
            if (res.status === 200) {
              this.setState({
                users: res.data
              });

              if (this.props.handleNumberPage !== undefined)
                this.props.handleNumberPage(Math.round(Object.keys(res.data).length/10))
            }
        });
  }
  render() {
    var listUsers = this.state.users
    return (
        listUsers.map((user, index) => {
          if (index < this.props.maxNumber && index >= this.props.minNumber)
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
