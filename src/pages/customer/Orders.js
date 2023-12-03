import React, {Component} from 'react'
import {get, put} from '../../api/callAPI';
import AuthService from '../../services/AuthService';
import Avatar from './Avatar';
import Message from "../../util/Message";
import moment from "moment";

export default class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      status: '',
      orderStatus: [],
      selectStatusId: 1,
      ordersWithStatus: []
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
            let reversedOrder = res.data.slice().reverse();
            let orderHasStatus = []
            let orderWithStatus = []
            reversedOrder.map((value, key) => {
              let order = value
              get(`orderStatus/${value.orderStatusId}`)
                  .then(res1 => {
                    if (res1 !== undefined) {
                      if (res1.status === 200) {
                        order['orderStatusName'] = res1.data.orderStatusName
                        // console.log("orderStatus1: ", res1.data)
                        orderHasStatus.push(order)
                      }
                    }
                  })
              if (value.orderStatusId === this.state.selectStatusId)
                orderWithStatus.push(value)
            })
            setTimeout(() => {
              this.setState({
                orders: orderHasStatus,
                ordersWithStatus: orderWithStatus
              })
            }, 1000)
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
                            let reversedOrder = res.data.slice().reverse();
                            let orderStatus1s = []
                            reversedOrder.map((value, key) => {
                              let orderStatus1 = value
                              get(`orderStatus/${value.orderStatusId}`)
                                  .then(res1 => {
                                    if (res1 !== undefined) {
                                      if (res1.status === 200) {
                                        orderStatus1['orderStatusName'] = res1.data.orderStatusName
                                        console.log("orderStatus1: ", res1.data)
                                        orderStatus1s.push(orderStatus1)
                                      }
                                    }
                                  })
                            })
                            setTimeout(() => {
                              this.setState({orders: orderStatus1s,})}, 1000)
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
  handleOnChangeStatus(e){
    let selectStatusId = e.target.value
    console.log("selectStatusId: ", selectStatusId, typeof selectStatusId)
    let orderWithStatus = []
    this.state.orders.map((value, key) => {
      if (value.orderStatusId.toString() === selectStatusId)
        orderWithStatus.push(value)
    })
    setTimeout(() => {
      this.setState({
        ordersWithStatus: orderWithStatus,
        selectStatusId: selectStatusId
      })
    }, 1000)
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
          <div className="form-group col-3 mb-2" style={{marginLeft: "500px"}}>
            <select className='form-select' value={this.state.selectStatusId}
                    onChange={(e) => this.handleOnChangeStatus(e)}>
              <option value={1}>CHỜ XÁC NHẬN</option>
              <option value={2}>CHỜ LẤY HÀNG</option>
              <option value={3}>CHỜ GIAO HÀNG</option>
              <option value={4}>ĐÃ GIAO</option>
              <option value={5}>ĐÃ HỦY</option>
            </select>
          </div>
          <section>
            <div className="container">
              <div className="row">
                <div className="col-lg-8 col-xl-9">
                  <table className="table table-borderless table-hover table-responsive-md">
                    <thead className="bg-light">
                    <tr>
                      <th className="py-4 text-uppercase text-sm">Đơn hàng #</th>
                      <th className="py-4 text-uppercase text-sm">Thanh toán</th>
                      <th className="py-4 text-uppercase text-sm">Ngày đặt hàng</th>
                      <th className="py-4 text-uppercase text-sm">Trạng thái</th>
                      <th className="py-4 text-uppercase text-sm">Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Object.keys(this.state.ordersWithStatus).length !== 0 && this.state.ordersWithStatus.map((order, index) => (
                            <tr key={index}>
                              <th className="py-4 align-middle"># {order.orderId}</th>
                              <td className="py-4 align-middle">
                                <span className={`badge p-2 text-uppercase ${order.paymentDate === null ? 'badge-danger-light1' : 'badge-warning-light1'}`}>
                                  {order.orderStatusId === 5 ? '' : order.paymentDate !== null ? 'Đã thanh toán' : 'Chưa thanh toán'}</span>
                              </td>
                              <td className="py-4 align-middle">
                                <span className="">
                                  {moment(order.orderTimeStart).format('DD/MM/YYYY HH:mm:ss')}</span>
                              </td>
                              <td className="py-4 align-middle">
                                <span className={`badge p-2 text-uppercase ${this.label[order.orderStatusId]}`}>
                                  {order.orderStatusName}</span>
                              </td>
                              <td className="py-4 align-middle text-center">
                                <a className="edit-button" href={`/orders/${order.orderId}`}>
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
