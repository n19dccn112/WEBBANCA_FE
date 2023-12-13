import React, {Component} from 'react'
import ProductList from '../../components/products/ProductList';
import {del} from '../../api/callAPI';

import Message from '../../util/Message';
import OrderList from "../../components/orders/OrderList";
import PageSlide from "../pageFoot/PageSlide";

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
      minNumber: 0,
      maxNumber: 10,
      numberIndex: 1,
      pageComponent: [],
      numberPage: 1,
      selectStatusId: "1",
    }
  }
  handleOnChangeStatus(e){
    let selectStatusId = e.target.value
    setTimeout(() => {
      this.setState({
        selectStatusId: selectStatusId
      })
    }, 1000)
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

          <br/>
          <h1 className="title text-center">QUẢN LÝ ĐƠN HÀNG</h1>
          <div className="form-group col-3 mb-2" style={{marginLeft: "600px"}}>
            <select className='form-select' value={this.state.selectStatusId}
                    onChange={(e) => this.handleOnChangeStatus(e)}>
              <option value={1}>CHỜ XÁC NHẬN</option>
              <option value={2}>CHỜ LẤY HÀNG</option>
              <option value={3}>CHỜ GIAO HÀNG</option>
              <option value={4}>ĐÃ GIAO</option>
              <option value={5}>ĐÃ HỦY</option>
            </select>
          </div>
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
            <OrderList
                selectStatusId={this.state.selectStatusId}
                isTable={true} deleteOrder={(id) => this.handleDelete(id)} key={this.state.key}/>
            </tbody>
          </table>
        </>
    )
  }
}
