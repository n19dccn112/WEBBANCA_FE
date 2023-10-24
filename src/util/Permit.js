import React, {Component} from 'react'

export default class Permit extends Component {
  render() {
    return (
        <div className="container">
          <div className="alert alert-danger">
            Bạn không có quyền
          </div>
        </div>
    )
  }
}
