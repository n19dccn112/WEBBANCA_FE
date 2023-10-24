import React, {Component} from 'react'
import {get} from '../../api/callAPI';
import CartService from '../../services/CartService';
import NumberFormat from 'react-number-format';
import AuthService from "../../services/AuthService";
import product from "../../components/products/Product";
import Message from "../../util/Message";

export default class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      items: {},
      total: 0,
      keysCart: [],
      unitDetails: [],
      units: [],
      productsMatch: [],
      soldEnd: {},
      soldEndOk: {},
      checked: {},
      type: 'success',
      isShow: false,
      message: '',
    }
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.unitDetails.length !== 0 && prevState.unitDetails !== this.state.unitDetails){
      let total = 0;
      this.state.unitDetails.map((value, index) => {
        if (this.state.checked[value.unitDetailId])
          total += value.productPrice * this.state.items[value.unitDetailId]
      })
      let paramsUnit = {};
      paramsUnit['unitIds'] = this.state.unitDetails.reduce((result, item) => {
        if (result === "") {
          return `${item.unitId}`;
        } else {
          return `${result},${item.unitId}`;
        }
      }, "");
      console.log("paramsUnit: ", paramsUnit)
      get('unit', paramsUnit)
          .then(res => {
            if (res && res.status === 200) {
              console.log("units: ", res.data)
              this.setState({
                units: res.data,
                total: total,
              })
            }
          });
    }
  }
  loadPage (){
    const userId = AuthService.getCurrentUser().userId;
    let items = null
    if (CartService.getCurrentCart() != null)
    items = CartService.getCurrentCart()[userId];
    // console.log("userId, items: ", userId, items)
    if (!items){
      this.setState({
        unitDetails: [],
        units: [],
        products: [],
      })
      return
    }
    let keys = [];
    for (let key in items) {
      keys.push(key);
    }
    console.log("key: ", userId, items)
    this.setState({
      items: items,
      keysCart: keys
    })
    let params = {};
    if (Object.keys(items).length !== 0) {
      params['unitDetailIds'] = Object.keys(items).reduce((f, s) => `${f},${s}`);
      // console.log("param: ", params)
      get('products', params)
          .then(res => {
            if (res && res.status === 200) {
              this.setState({
                products: res.data,
              })
              // let productsMatch = Object.values(res.data).filter(detail => detail.productId === product.productId);
              let productsMatch = []
              Object.values(res.data).map(value => {
                let match = false
                Object.values(productsMatch).map(valueM => {
                  if (valueM.productId === value.productId) {
                    match = true
                  }
                })
                if (!match) {
                  productsMatch.push(value)
                }
              })
              this.setState({productsMatch: productsMatch})
              console.log("products: ", res.data, productsMatch)
            }
          });
      get('unitDetail', params)
          .then(res => {
            if (res && res.status === 200) {
              console.log("detail: ", res.data)
              this.setState({
                unitDetails: res.data,
              })
              let soldEnd = {}
              let soldEndOk = {}
              let checked = {}
              Object.values(res.data).map((value, key) => {
                checked[value.unitDetailId] = false
                if (value.unitDetailAmount < items[value.unitDetailId]) {
                  soldEnd[value.unitDetailId] = value.unitDetailAmount
                  soldEndOk[value.unitDetailId] = true
                }else {
                  soldEndOk[value.unitDetailId] = false
                }
              })
              setTimeout(() => this.setState({
                soldEnd: soldEnd,
                soldEndOk: soldEndOk,
                checked: checked
              }), 1000)
            }
          });
    }
  }
  componentDidMount() {
    this.loadPage()
    console.log("CartService.getCurrentCart(): ", CartService.getCurrentCart())
  }
  setNewValueFirstRemove(id, remain, value) {
    console.log("id, remain, value:", id, remain, value)
    if (value > 0 && value <= remain) {
      let newItems = this.state.items;
      newItems[id] = value;
      let total = 0
      this.state.unitDetails.map((value, index) => {
        if (this.state.checked[value.unitDetailId])
          total += value.productPrice * this.state.items[value.unitDetailId]
      })
      setTimeout(() => {
        console.log(total);
        CartService.addFirstRemove(id, value);
        this.setState({
          items: newItems,
          total: total,
        })
      }, 1000)
    }
  }
  async handleRemove(id) {
    let newItems = this.state.items;
    delete newItems[id];
    const newProducs = this.state.products.filter(product => product.productId !== id)
    await this.setState({
      items: newItems,
      products: newProducs,
    })
    CartService.remove(id);
    this.loadPage()
  }
  go2CheckOut() {
    let ids = []
    let amounts = []
    let cart = CartService.getCurrentCart()[AuthService.getCurrentUser().userId];
    Object.keys(cart).map((key, index) => {
      if (this.state.checked[key]) {
        ids.push(key)
        amounts.push(Object.values(cart)[index])
      }
    })
    // console.log("idAmounts: ", ids, amounts)
    CartService.shoppingSelect(ids, amounts)
    CartService.setTotal(this.state.total  *105/100 + 30000);
    setTimeout(() => {
      console.log('======================================================================')

      console.log("getShoppingSelected: ", CartService.getShoppingSelected())
    //   CartService.removeUser()
    //   CartService.removeTotal()
    }, 3000)
  }
  handleMinus(id, remain) {
    const value = Number(this.state.items[id]) - 1;
    this.setNewValueFirstRemove(id, remain, value);
  }
  async handleAdd(id, remain) {
    const value = Number(this.state.items[id]) + 1;
    this.setNewValueFirstRemove(id, remain, value);
  }
  async handleNumberItem(e, productId, remain) {
    const value = Number(e.target.value);
    this.setNewValueFirstRemove(productId, remain, value);
  }
  handleClickChecked(e, unitDetailId){
    let checked = this.state.checked
    if (this.state.soldEndOk[unitDetailId] === true)  {
      checked[unitDetailId] = false
      this.setState({
        message: `Không đủ số lượng ` + unitDetailId,
        type: 'danger',
        isShow: true,
      });
    }
    else {
      let total = 0
      checked[unitDetailId] = !checked[unitDetailId]
      this.state.unitDetails.map((value, index) => {
        if (checked[value.unitDetailId])
          total += value.productPrice * this.state.items[value.unitDetailId]
      })
      setTimeout(() => {
        // CartService.setTotal(total)
        this.setState({total: total})
      }, 500)
    }
    setTimeout(() => this.setState({
      checked: checked
    }), 500)
  }
  render() {
    return (<>
          <section className="hero">
            <div className="container">
              <div className="hero-content pb-5 text-center">
                <h1 className="hero-heading">Giỏ hàng</h1>
                <div className="row">
                  <div className="col-xl-8 offset-xl-2"><p className="lead text-muted">Bạn
                    có {this.state.unitDetails.length} sản phẩm trong giỏ hàng</p></div>
                </div>
              </div>
            </div>
          </section>
          <Message isShow={this.state.isShow} type={this.state.type} message={this.state.message}
                   key={this.state.message}/>
          {!CartService.isEmpty() ?
              <section>
                <div className="container">
                  <div className="row mb-5">
                    <div className="col-lg-8">
                      <div className="cart">
                        <div className="cart-wrapper">
                          <div className="cart-header text-center">
                            <div className="row titleCart">
                              <div className="col-1"></div>
                              <div className="col-3">Sản phẩm</div>
                              <div className="col-1">Size</div>
                              <div className="col-2">Giá</div>
                              <div className="col-2">Số lượng</div>
                              <div className="col-2">Tổng</div>
                              <div className="col-1"></div>
                            </div>
                          </div>
                          <div className="cart-body">
                            {this.state.products !== [] && this.state.checked !== {} &&
                                this.state.unitDetails.map((unitDetail, index) => (
                                <div className="cart-item" key={index}>
                                  <div className="row d-flex align-items-center text-center">
                                    <div className="col-1">
                                      {this.state.soldEndOk[unitDetail.unitDetailId] === true ?
                                          <label style={{color: "red"}}>
                                            Tồn kho: {this.state.soldEnd[unitDetail.unitDetailId]}</label> :
                                      <button
                                          className={`round-button 
                                          ${this.state.checked[unitDetail.unitDetailId] === true ? 'clicked' : ''}`}
                                          onClick={(e) => this.handleClickChecked(e, unitDetail.unitDetailId)}>
                                        <div className="inner-circle"></div>
                                      </button>}
                                    </div>
                                    <div className="col-3">
                                      <div className="d-flex align-items-center">
                                        {Object.values(this.state.productsMatch).map((valueP, indexP) => (
                                            // console.log("valueP.productId === unitDetail.productId: ", valueP, valueP.productId, unitDetail.productId)
                                          valueP.productId === unitDetail.productId &&
                                          <div>
                                            <a href={`/products/${unitDetail.productId}`}>
                                              <img className="cart-item-img" src={valueP.images[0]} alt="..."/>
                                            </a>
                                            <div className="cart-title text-start title-small">
                                              <a href={`/products/${unitDetail.productId}`}>
                                                <strong>{valueP.productName.slice(0,
                                                    valueP.productName.indexOf('(')).trim()}</strong>
                                              </a>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {this.state.units[index] &&
                                        <div className="col-1">{this.state.units[index].unitName.substring(5)}</div>}
                                    {this.state.unitDetails[index] &&
                                        <div className="col-2"><NumberFormat value={this.state.unitDetails[index].productPrice} displayType={'text'}
                                                                             thousandSeparator={true} suffix=' vnđ'/></div>}
                                    <div className="col-2">
                                      <div className="d-flex align-items-center">
                                        <div className="btn btn-items btn-items-decrease"
                                             onClick={() => this.handleMinus(unitDetail.unitDetailId, unitDetail.unitDetailAmount)}>-
                                        </div>
                                        <input className="form-control text-center input-items"
                                               type="text" onChange={(e) =>
                                                   this.handleNumberItem(e, unitDetail.unitDetailId, unitDetail.unitDetailAmount)}
                                               value={this.state.items[unitDetail.unitDetailId]}/>
                                        <div className="btn btn-items btn-items-increase"
                                             onClick={() => this.handleAdd(unitDetail.unitDetailId, unitDetail.unitDetailAmount)}>+
                                        </div>
                                      </div>
                                    </div>
                                    {this.state.unitDetails[index] &&
                                        <div className="col-2 text-center">
                                          <NumberFormat value={this.state.unitDetails[index].productPrice * this.state.items[this.state.keysCart[index]]}
                                                        displayType={'text'} thousandSeparator={true} suffix=' vnđ'/>
                                        </div>}
                                    <div className="col-1 text-center">
                                      <a className="cart-remove" onClick={() => this.handleRemove(this.state.unitDetails[index].unitDetailId)}>
                                        <i className="fa fa-times"></i>
                                      </a>
                                    </div>
                                  </div>
                                </div>))}
                          </div>
                        </div>
                      </div>
                      <div className="my-5 d-flex justify-content-between flex-column flex-lg-row">
                        <a className="btn-link text-muted title-small" href="/products">
                          <i className="fa fa-chevron-left"></i> HÃY TIẾP TỤC MUA SẮM NHÉ!
                        </a>
                        {this.state.total !== 0 &&
                        <a className="btn btn-dark"
                           href="/checkout"
                           onClick={() => this.go2CheckOut()}>
                          Thanh toán<i className="fa fa-chevron-right"></i>
                        </a>}
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="block mb-5">
                        <div className="block-header">
                          <h6 className="text-uppercase mb-0">Thông tin đơn hàng</h6>
                        </div>
                        {this.state.total !==0 &&
                        <div className="block-body bg-light pt-1">
                          <ul className="order-summary mb-0 list-unstyled">
                            <li className="order-summary-item">
                              <span>Tổng hóa đơn </span>
                              <span>
                            <NumberFormat value={this.state.total} displayType={'text'} thousandSeparator={true} suffix=' vnđ'/>
                          </span>
                            </li>
                            <li className="order-summary-item">
                              <span>Phí vận chuyển</span>
                              <span>30,000 vnđ</span></li>
                            <li className="order-summary-item">
                              <span>Thuế</span><span>5%</span>
                            </li>
                            <li className="order-summary-item border-0">
                              <span>Total</span>
                              <strong className="order-summary-total">
                                <NumberFormat value={this.state.total *105/100 + 30000} displayType={'text'} thousandSeparator={true} suffix=' vnđ'/>
                              </strong>
                            </li>
                          </ul>
                        </div>}
                      </div>
                    </div>
                  </div>
                </div>
              </section> : <div className="container1">
                <div className="image-container1">
                  <img src="https://tourneyx.com/app/lib/uploads/angler_uploads/22338_1600564048_9530a113c62ad9c0b5591a5920ace55a.jpg?d=1614829692"
                       alt="product" />
                </div>
                <div className="mb-5 d-flex justify-content-between flex-column flex-lg-row">
                  <a className="btn btn-link text-muted" href="/products">
                    <i className="fa fa-angle-left me-2"></i>
                    Mua sắm cùng Shop FishIn nhé
                  </a>
                </div>
              </div>
          }
        </>
    )
  }
}
