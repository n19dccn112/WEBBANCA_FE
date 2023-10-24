import React, {Component} from 'react'
import {Fade} from 'reactstrap';

export default class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      isShow: false,
      type: 'success',
    }
  }

  componentDidMount() {
    if (this.props.isShow) {
      this.setState({
        message: this.props.message,
        isShow: this.props.isShow ? this.props.isShow : false,
        type: this.props.type ? this.props.type : 'success',
      })
      setTimeout(() => {
        this.setState({
          isShow: false,
        });
      }, 3500);
    }

  }

  render() {
    return (
        <>
          {this.state.isShow && <Fade in={true}>
            <div className={`alert alert-${this.state.type}`}>{this.state.message}</div>
          </Fade>}
        </>
    )
  }
}
