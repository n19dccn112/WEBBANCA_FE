import React, {Component} from 'react'
import {get} from "../../api/callAPI";

export default class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderDetails: [],
      orderStatusName: ''
    }
    this.label = {
      1: "badge-info-light",
      2: "badge-success-light",
      3: "badge-warning-light",
      4: "badge-danger-light",
      5: "badge-secondary-light"
    }
  }
  componentDidMount() {
    console.log("componentDidMount orders", this.props.id)
    get('orderDetails', {"orderId": this.props.id})
        .then(res => {
          if (res !== undefined) {
            if (res.status === 200) {
              console.log("res.data: orders", res.data)
              this.setState({
                orderDetails: res.data
              });
            }
          }
        })
    get(`orderStatus/${this.props.orderStatusId}`)
        .then(res => {
          if (res !== undefined) {
            if (res.status === 200) {
              this.setState({
                orderStatusName: res.data.orderStatusName
              });
            }
          }
        })
  }
render() {
    if (this.props.isTable)
      return (
          <tr>
            <th className="py-4 align-middle"># {this.props.id}</th>
            <td className="py-4 align-middle text-center">{this.props.paymentAmount} vnđ</td>
            <td className="py-4 align-middle text-center"># {this.props.userId}</td>
            <td className="py-4 align-middle text-center">{this.props.paymentMethodId === 1 ? 'Paypal' : 'Tiền mặt'}</td>

            <td className="py-4 align-middle">
                <span className={`badge p-2 text-uppercase ${this.label[this.props.orderStatusId]}`}>{this.state.orderStatusName}</span>
            </td>

            <td className="py-4 align-middle text-center">
              <a className="edit-button" key={`'UpdateOrder'${this.props.id}}`}
                 style={{marginLeft: "15px"}} href={`orders/${this.props.id}`}>
                <i className="fas fa-pencil-alt"></i>
              </a>
              <a className="seen-button" href={`/orders/${this.props.id}`} style={{marginLeft: "20px"}}>
                <i className="fas fa-eye"></i>
              </a>
              {/*{Object.keys(this.state.orderDetails).length === 0 &&*/}
              {/*    <a className="delete-button" style={{marginLeft: "20px", color: "black"}} key={`'DeleteOrder'${this.props.id}`}*/}
              {/*       onClick={(e) => this.props.deleteOrder(this.props.id)}>*/}
              {/*      <i className="fas fa-trash"></i>*/}
              {/*    </a>}*/}
            </td>
          </tr>
      )
  }
}