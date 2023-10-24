import React, {Component} from 'react'
import {Fade} from 'reactstrap';

export default class Validate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      isShow: false,
      type: 'valid',
    }
  }

  componentDidMount() {
    this.setState({
      message: this.props.message,
      isShow: this.props.isShow ? this.props.isShow : false,
      type: this.props.type ? this.props.type : 'valid',
    })
  }

  render() {
    return (
        <>
          {this.state.isShow && <Fade in={true}>
            <div className={`${this.state.type}-feedback`}>{this.state.message}</div>
          </Fade>}
        </>
    )
  }
}

