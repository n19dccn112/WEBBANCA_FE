import React, {Component} from 'react'
import {get, put} from '../../api/callAPI';
import AuthService from '../../services/AuthService';
import Avatar from './Avatar';
import Message from "../../util/Message";

export default class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      status: '',
      orderStatus: [],
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
    const user = AuthService.getCurrentUser();
    get(`orders`, {"userId": user.userId})
        .then(res => {
          if (res && res.status === 200) {
            this.setState({
              orders: res.data,
            })
            let orderStatus = []
            res.data.map((value, key) => {
              get(`orderStatus/${value.orderStatusId}`)
                  .then(res => {
                    if (res !== undefined) {
                      if (res.status === 200) {
                        orderStatus[key] = res.data
                        // console.log("orderStatus1: ", res.data)
                      }
                    }
                  })
            })
            setTimeout(() => this.setState({orderStatus: orderStatus}), 1000)
          }
        })
  }
  handleCancel(e, statusId, orderId) {
    if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng?')) {
      console.log(orderId);
      this.cancelOrder(e, statusId, orderId);
    }
    setTimeout(() => {
      this.setState({
        isShow: false
      });
    }, 2000);
  }
  cancelOrder(e, statusId, orderId) {
    // e.preventDefault();
    console.log("cancelOrder: ", statusId)
    if (statusId === 1) {
      let params = {};
      params['orderStatusId'] = 5
      if (orderId) {
        put(`orders/${orderId}`, params)
            .then(res => {
                  if (res && res.status === 202) {
                    this.setState({
                      message: `Hủy đơn hàng thành công!`,
                      type: 'success'
                    });
                    console.log(res);
                    const user = AuthService.getCurrentUser();
                    get(`orders`, {"userId": user.userId})
                        .then(res => {
                          if (res && res.status === 200) {
                            this.setState({
                              orders: res.data,
                            })
                            let orderStatus1 = []
                            res.data.map((value, key) => {
                              get(`orderStatus/${value.orderStatusId}`)
                                  .then(res => {
                                    if (res !== undefined) {
                                      if (res.status === 200) {
                                        orderStatus1[key] = res.data
                                        console.log("orderStatus1: ", res.data)
                                      }
                                    }
                                  })
                            })
                            this.setState({
                              orderStatus: orderStatus1
                            });
                          }
                        })
                  }
                },
                err => {
                  err.response && this.setState({
                    message: `${err.response.data.error} ${err.response.data.message}`,
                    type: 'danger',
                  });
                })
      }
    }else{
      this.setState({
        message: `Sửa đơn hàng thất bại!`,
        type: 'danger'
      });
    }
  }
  render() {
    return (
        <>
          <section className="hero">
            <div className="container">
              <div className="hero-content pb-5 text-center">
                <h1 className="hero-heading">Tất cả đơn đặt hàng của bạn</h1>
                <div className="row">
                  <div className="col-xl-8 offset-xl-2">
                    <p className="lead">Tất cả đơn đặt hàng của bạn được lưu trữ tại đây.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <Message isShow={this.state.isShow} type={this.state.type} message={this.state.message}
                   key={this.state.message}/>
          <section>
            <div className="container">
              <div className="row">
                <div className="col-lg-8 col-xl-9">
                  <table className="table table-borderless table-hover table-responsive-md">
                    <thead className="bg-light">
                    <tr>
                      <th className="py-4 text-uppercase text-sm">Đơn hàng #</th>
                      <th className="py-4 text-uppercase text-sm">Trạng thái</th>
                      <th className="py-4 text-uppercase text-sm">Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Object.keys(this.state.orderStatus).length !== 0 && this.state.orders.map((order, index) => (
                            <tr key={index}>
                              <th className="py-4 align-middle"># {order.orderId}</th>
                              <td className="py-4 align-middle">
                                <span className={`badge p-2 text-uppercase ${this.label[order.orderStatusId]}`}
                                      style={{marginLeft: "-20px"}}>
                                  {this.state.orderStatus[index].orderStatusName}</span>
                              </td>
                              <td className="py-4 align-middle text-center">
                                <a className="edit-button" href={`/orders/${order.orderId}`} style={{marginLeft: "-120px"}}>
                                  <i className="fas fa-eye"></i>
                                </a>
                                {order.orderStatusId === 1 &&
                                    <a className="delete-button" style={{marginLeft: "20px", color: "black"}}
                                       onClick={(e) => this.handleCancel(e, order.orderStatusId, order.orderId)}>
                                      <i className="fas fa-trash"></i>
                                    </a>}
                              </td>
                            </tr>
                        )
                    )}
                    </tbody>
                  </table>
                </div>
                {/* Customer Sidebar*/}
                <Avatar/>
                {/* /Customer Sidebar*/}
              </div>
            </div>
          </section>
        </>
    )
  }
}
