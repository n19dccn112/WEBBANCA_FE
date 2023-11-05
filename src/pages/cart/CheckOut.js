import React, {Component} from 'react'
import {Redirect} from 'react-router-dom';
import {get, post} from '../../api/callAPI';
import AuthService from '../../services/AuthService';
import CartService from '../../services/CartService';
import NumberFormat from 'react-number-format';
import Message from '../../util/Message';
import {required, phone} from "../../util/constrain";
import ModalCart from "./ModalCart";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Modal from "react-modal";
import PayPalRefund from "./PayPalRefund";
export default class CheckOut extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      total: 0,
      address: '',
      phone: '',
      userId: 0,
      type: 'success',
      isShow: false,
      message: '',
      showPanel: false,
      modalComponent: false,
      userDetail: {},
      payment: [],
      idChecked: 0,
      paypalModal: <></>,
      hadPayment: false,
      orderIdPaypal: false
    }
    this.handleOnChangeUserDetailId = this.handleOnChangeUserDetailId.bind(this);
  }
  componentDidMount() {
    get('paymentMethod')
        .then(res => {
          if (res !== undefined)
            if (res.status === 200) {
              // console.log("payment res.data: ", res.data)
              this.setState({
                payment: res.data
              });
            }
        });
    const user = AuthService.getCurrentUser();
    const total = CartService.getTotal();
    // console.log("user: ", user)
    if (!user)
      <Redirect to='/customer'/>

    get(`users/${user.userId}`)
        .then(res => {
          if (res !== undefined)
            if (res.status === 200) {
              // console.log("user res.data: ", res.data)
              this.setState({
                updateCheckedUserDetail: res.data.userDetailIdDefault
              });
              if (res.data.userDetailIdDefault !== null)
                this.handleOnChangeUserDetailId(res.data.userDetailIdDefault)
              else
                this.setState({
                  name: user.name === null ? user.username : user.name,
                  email: user.email,
                  userId: user.userId,
                  phone: user.phone,
                  address: user.address,
                })
            }
        });
    this.setState({
      total: total ? total : 0,
    })
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.idChecked !== prevState.idChecked){
      if (this.state.idChecked === 2){
        this.setState({
          paypalModal: (<button className="order-button"
                               onClick={(e) => this.checkOut(e)}>
            <i className="fa fa-angle-right ms-2"></i> Đặt hàng
          </button>)})
      }else if (this.state.idChecked === 1){
        const total = Math.round(CartService.getTotal()/23000)
        // console.log("vào if paypal", total)
        this.setState({
          paypalModal: (
              <PayPalScriptProvider options={{"client-id": "AcHmmp1u5qqAwgRnmqR_G9fN9j31m_nDFlSognr6caYs9hhmwP3iplIVHOgn9A-bn4bhzNWTYDlwB6JN"}}>
                <PayPalButtons createOrder={(data, actions) => {
                      return actions.order.create({
                            purchase_units: [{
                                description: 'Purchase Fish',
                                amount: {
                                  currency_code: 'USD',
                                  value: total
                                }}],
                            application_context: {
                              shipping_preference: 'NO_SHIPPING'}
                          })
                          .then((orderId) => {
                            this.setState({orderIdPaypal: orderId})
                            // CartService.setOrderId(orderId)
                            return orderId;
                          });
                    }}
                    onApprove={(data, actions) => {
                      return actions.order
                          .capture()
                          .then((e) => {
                            // console.log("thành công")
                            this.setState({
                              message: `Thanh toán thành công!`,
                              type: 'warning',
                              hadPayment: true,
                              paypalModal: <></>,
                            });
                            this.setState({
                              isShow: !this.setState.isShow,
                            })
                          });
                    }}
                    onError={(e) => {
                      e.preventDefault();
                      // console.log("thất bại")
                      this.setState({
                        message: `Thanh toán thất bại công!`,
                        type: 'warning',
                        hadPayment: false,
                        paypalModal: <></>,
                      });
                      this.setState({
                        isShow: !this.setState.isShow,
                      })
                    }}/>
              </PayPalScriptProvider>
          )
        })
      }
    }
    if (this.state.hadPayment !== prevState.hadPayment && this.state.hadPayment){
      this.handleOrder()
    }
  }
  openModalCart(e) {
    e.preventDefault();
    console.log("openModalCart");
    this.setState({
      modalComponent: true // Cập nhật modalComponent thành giá trị boolean true
    });
  }
  handleOnChangeUserDetailId = (id) => {
    get(`userDetails/${id}`)
        .then(res => {
          if (res !== undefined)
            if (res.status === 200) {
              const address = res.data.address + ", " + res.data.wardName + ", " + res.data.districtName + ", " + res.data.provinceName;
              // console.log("userDetails res.data: ", res.data, address);
              this.setState({
                userDetail: res.data,
                address: address,
                phone: res.data.phone,
                name: res.data.name
              })
            }
        });
  }
  handleOnChangeAddress(e) {
    this.setState({
      address: e.target.value
    });
  }
  handleOnChangePhone(e) {
    this.setState({
      phone: e.target.value
    })
  }
  handleOnChangeNameD(e){
    this.setState({
      name: e.target.value
    })
  }
  handleOrder = () => {
    console.log("CartService.getShoppingSelected(): ", CartService.getShoppingSelected())
    if (CartService.getShoppingSelected() === undefined || CartService.getShoppingSelected() === null){
      this.setState({
        message: `Giỏ hàng rỗng`,
        type: 'danger',
        isShow: true,
      })
      return
    }
    let listKey = Object.keys(CartService.getShoppingSelected()[AuthService.getCurrentUser().userId])
    let listValue = Object.values(CartService.getShoppingSelected()[AuthService.getCurrentUser().userId])
    // return
    listKey.map((value, index) => {
      get(`unitDetail/${parseInt(value, 10)}`)
          .then(res => {
            if (res && res.status === 200)
              if (listValue[index] > res.data.unitDetailAmount) {
                this.setState({
                  message: `Sản phẩm hết hàng. Hãy kiểm tra lại đơn hàng`,
                  type: 'danger',
                  isShow: true,
                })
                return
              }
          })
    })

    let body = {};
    body['userId'] = AuthService.getCurrentUser().userId;
    body['orderAddress'] = this.state.address;
    body['orderPhone'] = this.state.phone;
    body['paymentAmount'] = CartService.getTotal();
    body['paymentMethodId'] = this.state.idChecked
    // console.log("body: ", body)
    post('orders', body).then(res => {
          if (res && res.status === 201) {
            this.setState({
              message: `Đặt đơn hàng thành công`,
              type: 'success',
              isShow: true,
            });
            console.log("Đặt đơn hàng thành công")
            get('orders/phone', {"phone": this.state.phone})
                .then(res => {
                  if (res && res.status === 200) {
                    console.log("orders/phone thành công")
                    let param = {}
                    param['orderId'] = res.data.orderId;

                    listKey.map((value, index) => {
                      param['unitDetailId'] = parseInt(value, 10);
                      param['amount'] = listValue[index];
                      console.log("KET QUA: ", param)
                      post('orderDetails', param).then(res => {
                        if (res && res.status === 201) {
                          setTimeout(() => {
                            this.setState({
                              message: `Đặt chi tiết đơn hàng thành công`,
                              type: 'success',
                              isShow: true,
                            });
                            CartService.removeUser()
                            CartService.removeTotal()
                          })
                        }
                      })
                    })
                  }
                })
          }
        },
        err => {
          err.response && this.setState({
            message: "Đặt đơn hàng thất bại",
            type: 'danger',
          });
        });
    this.setState({
      isShow: !this.setState.isShow,
    })
  }
  checkOut(e) {
    e.preventDefault();
    const userId = AuthService.getCurrentUser().userId;
    let cart = null
    if (CartService.getCurrentCart() != null && userId)
      cart = CartService.getCurrentCart()[userId];
    else {
      this.setState({
        message: `Xin hãy chọn sản phẩm!`,
        type: 'warning',
      });
      this.setState({
        isShow: !this.setState.isShow,
      })
      return;
    }
    if (!cart) {
      return;
    }

    if(this.state.idChecked === 0) {
      this.setState({
        message: `Xin hãy chọn phương thức thanh toán`,
        type: 'warning',
      });
      this.setState({
        isShow: !this.setState.isShow,
      })
      return;
    }
    this.handleOrder()
  }
  handleClickPayment(e, id) {
    e.preventDefault();
    this.setState((prevState) => ({
      idChecked: id
    }));
  }
  render() {
    const { modalComponent, paypalModal } = this.state;
    return (
        <>
          <section className="hero">
            <div className="container">
              <div className="hero-content pb-5 text-center">
                <h1 className="hero-heading">Đặt hàng</h1>
                <div className="row">
                  <div className="col-xl-8 offset-xl-2">
                    <p className="lead text-muted">Xin hãy kiểm tra và thay đổi chính xác thông tin giao hàng của bạn</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Checkout*/}
          <section>
            <div className="container">
              <div className="row">
                <div className="col-lg-8">
                  <form>
                    <div className="block">
                      {/*<PayPalRefund />*/}
                      {/* Invoice Address*/}
                      <div className="block-header container1">
                        <h6 className="text-uppercase mb-0">Thông tin hóa đơn </h6>
                      </div>
                      <button className="viewed-button" style={{marginTop: "20px", marginLeft: "20px"}}
                              onClick={(e) => this.openModalCart(e)}
                              data-bs-toggle="modal"
                              data-bs-target="#modalCart">Cập nhật địa chỉ
                        <i className="fa fa-angle-right ms-2"></i>
                      </button>

                      <Message isShow={this.state.isShow} type={this.state.type} message={this.state.message}
                               key={this.state.message}/>
                      <div className="block-body">
                        <div className="row">
                          <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="name_invoice">Tên</label>
                            <input className="form-control" type="text" name="name_invoice"
                                   placeholder="xxx" value={this.state.name}
                                   onChange={(e) => this.handleOnChangeNameD(e)} readOnly={true}
                                   id="name_invoice" validations={[required]}/>
                          </div>
                          <div className="form-group col-md-6">
                            <label className="form-label" htmlFor="phonenumber_invoice">Số điện thoại</label>
                            <input className="form-control" type="text"
                                   name="phonenumber_invoice" value={this.state.phone}
                                   onChange={(e) => this.handleOnChangePhone(e)}
                                   placeholder="xxxxxxxxxx" id="phonenumber_invoice" readOnly={true}/>
                          </div>
                          <div className="form-group col-md-12">
                            <label className="form-label" htmlFor="street_invoice">Tên đường</label>
                            <input className="form-control" type="text" name="street_invoice"
                                   value={this.state.address}
                                   onChange={(e) => this.handleOnChangeAddress(e)}
                                   placeholder="00 xxxxx" id="street_invoice" readOnly={true}/>
                          </div>
                          {!CartService.isEmpty() &&
                            <div className="form-group col-md-12 mt-3">
                              <label className="form-label" htmlFor="street_invoice">Phương thức thanh toán</label>
                              {this.state.payment && this.state.payment.length !== 0 &&
                                  this.state.payment.map(value => (
                                      <div className="address" key={value.paymentMethodId}>
                                        <button
                                            className={`round-button ${value.paymentMethodId === this.state.idChecked ? 'clicked' : ''}`}
                                            onClick={(e) => this.handleClickPayment(e, value.paymentMethodId)}>
                                          <div className="inner-circle"></div>
                                        </button>
                                        <div className="address-text-align">
                                          <span className="address-label">{value.paymentMethodName}</span>
                                          <br/>
                                        </div>
                                      </div>
                                  ))}
                              {paypalModal}
                            </div>
                          }
                        </div>
                        {/* /Invoice Address*/}
                      </div>
                      {/* Shippping Address*/}
                    </div>
                    <div className="mb-5 d-flex justify-content-between flex-column flex-lg-row"><a
                        className="btn btn-link text-muted" href="cart"> <i
                        className="fa fa-angle-left me-2">
                      </i>Quay lại </a>
                    </div>
                  </form>
                </div>
                <div className="col-lg-4">
                  <div className="block mb-5">
                    <div className="block-header">
                      <h6 className="text-uppercase mb-0">Chi tiết đơn đặt hàng</h6>
                    </div>
                    <div className="block-body bg-light pt-1">
                      <p className="text-sm">Đam mê của bạn là niềm vui của chúng tôi</p>
                      <ul className="order-summary mb-0 list-unstyled">
                        <li className="order-summary-item">
                          <span>Tổng hóa đơn </span>
                          <span>
                            <NumberFormat value={this.state.total} displayType={'text'} thousandSeparator={true} suffix=' vnđ'/>
                          </span>
                        </li>
                        <li className="order-summary-item border-0">
                          <span>Tổng</span>
                          <strong className="order-summary-total">
                          <NumberFormat value={this.state.total} displayType={'text'} thousandSeparator={true} suffix=' vnđ'/></strong></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {modalComponent && <ModalCart onChangeUserDetailId={this.handleOnChangeUserDetailId} />}
        </>
    )
  }
}
