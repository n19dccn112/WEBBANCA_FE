import React, {Component} from 'react'
import ProductList from '../../components/products/ProductList';
import {del} from '../../api/callAPI';

import Message from '../../util/Message';
import OrderList from "../../components/orders/OrderList";

export default class TableOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: [],
      orders: {},
      total: 0,
      type: 'success',
      isShow: false,
      message: '',
      key: 0,
    }
  }
  async doDelete(id) {
    console.log("000000000000000: " + id)
    del(`orders/${id}`)
        .then(res => {
              if (res && res.status === 202)
                this.setState({
                  message: `Xóa đơn hàng ${res.data.productName} thành công!`,
                  key: id,
                  type: 'success',
                });
              console.log(res);
            },
            err => {
              this.setState({
                message: `${err.response.data.error} ${err.response.data.message}`,
                type: 'danger',
              });
            })
    await this.setState({
      isShow: !this.setState.isShow,
    })
  }
  componentDidMount() {
    console.log(window.location.search);
  }
  handleDelete(id) {
    if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
      console.log(id);
      this.doDelete(id);
    }
    setTimeout(() => {
      this.setState({
        isShow: false
      });
    }, 2000);
  }
  render() {
    return (
        <>
          <Message isShow={this.state.isShow} type={this.state.type} message={this.state.message} key={this.state.message}/>

          <table className="table table-borderless table-hover table-responsive-md">
            <thead className="bg-light">
            <tr>
              <th className="py-4 text-uppercase text-sm text-center">Đơn hàng #</th>
              <th className="py-4 text-uppercase text-sm text-center">Số tiền</th>
              <th className="py-4 text-uppercase text-sm text-center">Mã khách hàng</th>
              <th className="py-4 text-uppercase text-sm text-center">PT thanh toán</th>
              <th className="py-4 text-uppercase text-sm text-center">Trạng thái</th>
              <th className="py-4 text-uppercase text-sm text-center">Hành động</th>
            </tr>
            </thead>
            <tbody>
            <OrderList isTable={true} deleteOrder={(id) => this.handleDelete(id)} key={this.state.key}/>
            </tbody>
          </table>
        </>
    )
  }
}
