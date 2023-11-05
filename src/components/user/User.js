import React, {Component} from 'react'
import {get} from "../../api/callAPI";

export default class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: [],
    }
  }
  componentDidMount() {
    setTimeout(() => {
      get('userDetails', {"userId": this.props.id})
          .then(res => {
            if (res !== undefined) {
              if (res.status === 200) {
                  this.setState({
                    user: res.data
                  });

                if (Object.keys(res.data).length === 0) {
                  get('userProducts', {"userId": this.props.id})
                      .then(res => {
                        if (res !== undefined) {
                          if (res.status === 200) {
                            this.setState({
                              user: res.data
                            });
                            if (Object.keys(res.data).length === 0) {
                              get('orders', {"userId": this.props.id})
                                  .then(res => {
                                    if (res !== undefined) {
                                      if (res.status === 200) {
                                        this.setState({
                                          orders: res.data
                                        });
                                      }
                                    }
                                  })
                            }
                          }
                        }
                      })
                }
              }
            }
          })
    }, 500)
  }
  render() {
    return (
        <tr>
          <th className="py-4 align-middle"># {this.props.id}</th>
          <td className="py-4 align-middle">{this.props.username}</td>
          <td className="py-4 align-middle">{this.props.roleName}</td>
          <td className="py-4 align-middle">
            <a className="edit-button" key={`'UpdateUser'${this.props.id}}`}
               style={{marginLeft: "15px"}} href={`customers/${this.props.id}`}>
              <i className="fas fa-pencil-alt"></i></a>
            {Object.keys(this.state.user).length === 0 && this.props.roleName !== "ROLE_SHOP" &&
            <a className="delete-button" style={{marginLeft: "20px", color: "black"}} key={`'DeleteUser'${this.props.id}`}
               onClick={(e) => this.props.deleteUser(this.props.id)}>
              <i className="fas fa-trash"></i>
            </a>}
          </td>
        </tr>
    )
  }
}
