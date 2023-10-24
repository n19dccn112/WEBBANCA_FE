import React, {Component} from 'react'

import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Button from 'react-validation/build/button';
import CheckButton from 'react-validation/build/button';

import {get, post, put} from '../../api/callAPI';
import {withRouter} from 'react-router-dom';
import Message from '../../util/Message';
import {phone, required,} from "../../util/constrain";
import "react-datepicker/dist/react-datepicker.css";
import AuthService from "../../services/AuthService";

class FormOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      key: 0,
      phone: '',
      status: '',
      statusId: '',
      listData: [],
      name: '',
      type: 'success',
      isShow: false,
      message: '',
      amount: {},
      beginStatusId: 0,
      orderDetails: [],
    }
    this.constNext = {"1": ["1", "2", "5"],"2": ["2", "3", "5"], "3": ["3"], "4": ["4"], "5": ["5"]}
    // const choXacNhanStatusNext =  ["1", "2", "5"]
    // const choLayHangStatusNext =  ["2", "3", "5"]
    // const choGiaoHangStatusNext =  ["3"]
    // const daGiaoStatusNext = ["4"]
    // const daHuyNext = ["5"]
  }
  componentDidMount() {
    const orderId = this.props.match.params.id;
    const user = AuthService.getCurrentUser();
    if (!user) return;
    get(`orders/${orderId}`)
        .then(res => {
          if (res && res.status === 200) {
            this.setState({
              order: res.data,
              phone: res.data.orderPhone,
              statusId: res.data.orderStatusId,
              beginStatusId: res.data.orderStatusId,
            })
            // console.log("orders: ", res.data)
            get(`orderStatus/${res.data.orderStatusId}`)
                .then(res => {
                  if (res !== undefined) {
                    if (res.status === 200) {
                      this.setState({
                        status: res.data.orderStatusName,
                        orderStatus: res.data})
                      if(this.constNext[this.state.statusId])
                        console.log("this.constNext[this.state.statusId]: ", this.constNext[this.state.statusId],
                            this.constNext[this.state.statusId].includes("1"))
                    }
                  }
                })
          }
        })
    get('orderDetails', {"orderId": orderId})
        .then(res => {
          if (res && res.status === 200) {
            let amount = {}
            Object(res.data).map((value, key) => (amount[value.orderDetailId] = 0))
            this.setState({
              orderDetails: res.data,
              amount: amount
            })
            let unitDetails = []
            Object.values(res.data).map((value, index) => {
              get(`unitDetail/${value.unitDetailId}`)
                  .then(res => {
                    if (res && res.status === 200) {
                      unitDetails.push(res.data)
                    }
                  })
            })
            setTimeout(() => this.setState({unitDetails: unitDetails}), 500)
            let listData = []
            let total = 0
            setTimeout(() => {
              Object.values(unitDetails).map((unitDetail, index) =>{
                let orderDetail = this.state.orderDetails.filter(item => item.unitDetailId === unitDetail.unitDetailId);
                // console.log("orderDetail: ", orderDetail)
                get(`products/${unitDetail.productId}`)
                    .then(res2 => {
                      if (res2 && res2.status === 200) {
                        // const products = res2.data;
                        console.log("orderDetail 888: ", orderDetail, index)
                        listData.push([res2.data.productId, res2.data.productName, res2.data.images,
                          unitDetail.productPrice, orderDetail[0].amount]);
                      }
                    })
              })
              setTimeout(() => this.setState({
                listData: listData,
                total: total
              }), 500)
            }, 500)
          }
        })
  }
  statusOnChange(e) {
    console.log("e.target.value: ", e.target.value, e.target.value === '1')
    this.setState({
      statusId: e.target.value,
      status: e.target.value === '1' ? 'Chờ xác nhận' : e.target.value === '2' ? 'Chờ lấy hàng' :
          e.target.value === '3' ? 'Chờ giao hàng' : e.target.value === '4' ? 'Đã giao' :
              e.target.value === '5' ? 'Đã hủy' : 'Chọn'
    })
  }
  async doCreate(e) {
    e.preventDefault();
    if (this.props.match.params.id) {
      put(`orders/${this.props.match.params.id}`,
          {
            'orderStatusId': parseInt(this.state.statusId, 10),
            'reAmounts': this.state.amount
            })
          .then(res => {
                if (res && res.status === 202) {
                  if (res.data.orderStatusId === parseInt(this.state.statusId, 10)) {
                    this.setState({
                      message: `Cập nhập trạng thái đơn hàng thành công!`,
                      type: 'success'
                    });
                    console.log(res.data);
                  }else {
                    this.setState({
                      message: `Cập nhập trạng thái đơn hàng thất bại (hết sản phẩm)!`,
                      type: 'danger'
                    });
                    console.log(res.data);
                  }
                }
              },
              err => {
                err.response && this.setState({
                  message: `${err.response.data.error} ${err.response.data.message}`,
                  type: 'danger',
                });
              })
      await this.setState({
        isShow: !this.setState.isShow,
      })
    }
  }
  async handleChange(e, soluong, index) {
    if (e.target.value < 0) return
    if (e.target.value > soluong){
      this.setState({
        message: `Số lượng nhập vào đã quá số lượng xuất kho!`,
        type: 'danger',
        isShow: true,
      });
      return;
    }
    let amount = this.state.amount
    console.log("begin: ", amount)
    amount[this.state.orderDetails[index].orderDetailId] = e.target.value
    console.log("end: ", amount)
    this.setState({amount: amount})
  }
  render() {
    return (
        <>
          <div className="block mb-5">
            <div className="block-header">
              <strong className="text-uppercase">{this.props.match.params.id ? 'Sửa trạng thái đơn hàng' : ""}</strong>
            </div>
            <div className="block-body">
              <Form onSubmit={(e) => this.doCreate(e)} ref={c => {this.form = c;}}>
                <div className="row">
                  {this.props.match.params.id && (<div className="col-sm-6">
                    <div className="mb-4">
                      <label className="form-label" htmlFor="orderid">Id</label>
                      <input className="form-control" name="orderid" id="orderid" value={this.state.id}
                             type="text" readOnly={true}/>
                    </div>
                  </div>)}
                  <div className="col-6">
                    <div className="mb-4">
                      <label className="form-label" htmlFor="ordersdt">Số điện thoại</label>
                      <Input className="form-control" name="ordersdt" id="ordersdt" value={this.state.phone}
                             type="text" validations={[required, phone]} readOnly={true} />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="mb-4">
                      <label className="form-label" htmlFor="orderstatus">Trạng thái</label>
                      <select className='form-select' name='orderstatus' value={this.state.statusId}
                              onChange={(e) => this.statusOnChange(e)}>
                        {this.constNext[this.state.statusId] && this.constNext[this.state.statusId].includes("1") &&
                            <option value="1">Chờ xác nhận</option>}

                        {this.constNext[this.state.statusId] && this.constNext[this.state.statusId].includes("2") &&
                            <option value="2">Chờ lấy hàng</option>}

                        {this.constNext[this.state.statusId] && this.constNext[this.state.statusId].includes("3") &&
                            <option value="3">Chờ giao hàng</option>}

                        {this.constNext[this.state.statusId] && this.constNext[this.state.statusId].includes("4") &&
                            <option value="4">Đã giao</option>}

                        {this.constNext[this.state.statusId] && this.constNext[this.state.statusId].includes("5") &&
                            <option value="5">Đã hủy</option>}
                      </select>
                    </div>
                  </div>
                </div>
                {this.state.statusId === "5" &&
                    <div>
                      <div className="cart-header text-center">
                        <div className="row">
                          <div className="col-6">Sản phẩm</div>
                          <div className="col-3">Số lượng</div>
                          <div className="col-3">Nhập về kho</div>
                        </div>
                      </div>
                      <div className="cart-body">
                        {this.state.listData !== [] && this.state.listData.map((item, index) => (
                            <div className="cart-item" key={index}>
                              <div className="row d-flex align-items-center text-center">
                                <div className="col-6">
                                  <div className="d-flex align-items-center">
                                    <a href={`/products/${item[0]}`}>
                                      <img className="cart-item-img" src={item[2][0]}/>
                                    </a>
                                    <div className="cart-title text-start">
                                      <a className="text-uppercase text-dark" href={`/products/${item[0]}`}>
                                        <strong>{item[1]}</strong>
                                      </a>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-3">{item[4]}</div>
                                <div className="col-3">
                                  <input className="form-control detail-quantity" name="items" type="number"
                                         onChange={(e) => this.handleChange(e, item[4], index)}
                                         value={this.state.amount[this.state.orderDetails[index].orderDetailId] ?
                                             this.state.amount[this.state.orderDetails[index].orderDetailId] : 0}>
                                  </input>
                                </div>
                              </div>
                            </div>
                        ))}
                      </div>
                    </div>
                }
                <Message isShow={this.state.isShow} type={this.state.type} message={this.state.message}
                         key={this.state.message}/>
                {this.state.beginStatusId !== this.state.statusId &&
                  <div className="text-center mt-4">
                    <Button className="btn btn-outline-dark" type="submit"><i className="far fa-save me-2"></i>Lưu</Button>
                  </div>
                }
                <CheckButton style={{display: "none"}} ref={c => {this.checkBtn = c;}}
                />
              </Form>
            </div>
          </div>
        </>
    )
  }
}

export default withRouter(FormOrder);
