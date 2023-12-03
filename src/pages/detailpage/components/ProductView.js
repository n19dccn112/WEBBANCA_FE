import React, {Component, useState } from 'react'
import NumberFormat from 'react-number-format';
import CartService from '../../../services/CartService';
import Message from '../../../util/Message';
import ImageList from '../../../components/images/ImageList';
import AuthService from "../../../services/AuthService";
import {get, post, put} from "../../../api/callAPI";
import * as timers from "timers";

export default class ProductView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stars: <ul className="list-inline me-2 mb-0">
        <li className="list-inline-item me-0"><i className="fa fa-star text-gray-300"></i></li>
        <li className="list-inline-item me-0"><i className="fa fa-star text-gray-300"></i></li>
        <li className="list-inline-item me-0"><i className="fa fa-star text-gray-300"></i></li>
        <li className="list-inline-item me-0"><i className="fa fa-star text-gray-300"></i></li>
        <li className="list-inline-item me-0"><i className="fa fa-star text-gray-300"></i></li>
      </ul>,
      feature: <ul></ul>,
      amountItem: 1,
      type: 'success',
      isShow: false,
      message: '',
      minPrice: 0,
      maxPrice: 0,
      remainSelected: 0,
      selectedSize: '',
      unitDetailId: 0,
      units: [],
      unitDetails: [],
      updateUnit: false,
      indexSize: -1,
      isLove: false,
      userProducts: {},
      event: {}
    }
    this.star = [1, 2, 3, 4, 5];
    this.imageLove = ["https://img5.thuthuatphanmem.vn/uploads/2021/07/17/anh-icon-trai-tim-don-gian_054623052.png",
      "https://anhdep.tv/attachments/d729e7ff09ebee15f2009bba9b2be257-jpeg.2529/"]
  }
  handleSizeClick (index, unitDetailId, size, amount, price){
    console.log("size: ", size)
    console.log("units: ", this.state.units)
    console.log("unitDetails: ", this.state.unitDetails)
    this.setState({
      minPrice : price,
      maxPrice : price,
      remainSelected : amount,
      selectedSize : size,
      unitDetailId: unitDetailId,
      amountItem: 1,
      indexSize: index,
    });
  };
  async handleChange(e) {
    if (this.state.unitDetailId === 0){
      this.setState({
        message: `Hãy chọn size!`,
        type: 'danger',
        isShow: true,
      });
      return;
    }

    if (this.state.unitDetails && this.state.indexSize !== -1) {
      const value = Number(e.target.value);
      console.log("value: 6666666", value, this.state.unitDetails[this.state.indexSize].unitDetailAmount)
      if (value > 0 && value <= this.state.unitDetails[this.state.indexSize].unitDetailAmount)
        await this.setState({
          amountItem: value,
        })
    }
  }
  actionUpdateProduct (){
    if (this.props.product.amountProduct === 0) {
      this.setState({
        amountItem: 0,
      })
    }
    this.setState({
      minPrice : this.props.product.minPrice,
      maxPrice : this.props.product.maxPrice,
    })
  }
  actionUpdateUnit(){
    let params = {};
    params["productId"] = this.props.product.productId;
    if (this.state.units.length > 0) {
      const unitIds = this.state.units.map(unit => unit.unitId);
      params["unitIds"] = unitIds.join(",");
    }
    console.log("param: ", params);
    get('unitDetail', params)
        .then(res => {
          if (res !== undefined)
            if (res.status === 200){
              console.log("res.data this.state.unitDetails: ", this.state.unitDetails, this.state.unitDetails.length)
              this.setState({
                unitDetails: res.data
              });
            }
        });
    console.log("this.state.unitDetails: ", this.state.unitDetails, this.state.unitDetails.length)
    this.setState({
      updateUnit: true
    })
  }
  componentDidUpdate(prevProps) {
    // console.log("this.props.product !== prevProps.product: ", this.props.product, prevProps.product)
    if (this.props.product !== null && this.props.product !== prevProps.product){
      this.actionUpdateProduct()
      if (this.state.updateUnit === false && this.state.units != null && this.state.units !== prevProps.units) {
        this.actionUpdateUnit()
      }
    }

    if (this.props.product.featureIdSpecificFeatureTypeNameIsShowPriceUnit !== prevProps.product.featureIdSpecificFeatureTypeNameIsShowPriceUnit){
      var featureTemp = {};
      Object.keys(this.props.product.featureIdSpecificFeatureTypeNameIsShowPriceUnit).map((key) => {
        if (this.props.product.featureIdSpecificFeatureTypeNameIsShowPriceUnit[key][3].trim() === "true") {
          const newKey = this.props.product.featureIdSpecificFeatureTypeNameIsShowPriceUnit[key][2];
          var newValue = this.props.product.featureIdSpecificFeatureTypeNameIsShowPriceUnit[key][1];
          if (!featureTemp.hasOwnProperty(newKey)) {
            featureTemp[newKey] = newValue;
          } else {
            const oldValue = featureTemp[newKey];
            featureTemp[newKey] = oldValue + ", " + newValue;
          }
        }
      })
      const listFeature = [];

      for (let key in featureTemp) {
        if (featureTemp.hasOwnProperty(key)) {
          let value = featureTemp[key];
          listFeature.push(
              <li className="product-list-container" key={key}>
                <div className="font-weight-bold">{key}</div>
                <div className="font-weight-normal">: {value}</div>
              </li>
          );
        }
      }
     this.setState({
       feature : <ul className="product-list">{listFeature}</ul>,
     })
    }
  }
  userProduct(){
    setTimeout(() =>
    get('userProducts', {"productId": this.props.product.productId,
      "userId": AuthService.getCurrentUser().userId})
        .then(res => {
          if (res !== undefined)
            if (res.status === 200) {
              console.log("get userProducts: ", res.data, Object.keys(res.data).length===0, res.data === [])
              if (Object.keys(res.data).length !== 0) {
                let love = res.data.isLove === 'false' ? false : true
                this.setState({
                  isLove: love,
                  userProducts: res.data[0]
                });
                if (res.data.isSeen === 'false')
                console.log("userProduct 999: ", res.data[0])
                put(`userProducts/${res.data[0].userProductId}`, {"isSeen": "true"})
                    .then(res => {
                      if (res !== undefined)
                        if (res.status === 200) {
                          console.log("seen")
                        }
                    })
              }
              else {
                let param = {};
                param["productId"] = this.props.product.productId;
                param["userId"] = AuthService.getCurrentUser().userId
                param["isSeen"] = "true"
                param["isLove"] = "false"
                param["phone"] = AuthService.getCurrentUser().phone
                post('userProducts', param)
                    .then(res => {
                      if (res !== undefined)
                        if (res.status === 200) {
                          console.log("post")
                          this.userProduct()
                        }
                    })
              }
            }
        }), 1000)
  }
  componentDidMount() {
    setTimeout(() => get('unit', {"productId": this.props.product.productId})
        .then(res => {
          if (res !== undefined)
            if (res.status === 200) {
              console.log("units", res.data)
              this.setState({
                units: res.data
              });
              this.actionUpdateProduct()
              this.actionUpdateUnit()
            }
        }), 1000)

    if (this.props.totalReview > 0)
      this.setState({
        stars: <ul className="list-inline me-2 mb-0">
          {this.star.map((num, index) => {
            if (num <= this.props.ratePoint)
              return <li key={index} className="list-inline-item me-0"><i
                  className="fa fa-star text-primary"></i></li>;
            else return <li key={index} className="list-inline-item me-0"><i
                className="fa fa-star text-gray-300"></i></li>
          })}
        </ul>
      })
    this.userProduct()

    setTimeout(() => {
        get('eventProducts', {"productIdMaxEvent": this.props.product.productId})
            .then(res => {
              if (res !== undefined) {
                if (res.status === 200 && Object.values(res.data).length !== 0) {
                  get(`events/${res.data[0].eventId}`)
                      .then(res1 => {
                        if (res1 !== undefined) {
                          if (res1.status === 200) {
                            this.setState({
                              event: res1.data
                            });
                          }
                        }
                      })
                }
              }
            })
    }, 1000)
  }
  add2Cart() {
    if (this.props.product.amountProduct === 0) {
      this.setState({
        message: `Sản phẩm này đã bán hết!`,
        type: 'danger',
        isShow: !this.setState.isShow,
      });
      return;
    }
    if(this.state.selectedSize === ''){
      this.setState({
        message: `Hãy chọn size sản phẩm!`,
        type: 'danger',
        isShow: !this.setState.isShow,
      });
      return;
    }
    if (AuthService.getCurrentUser().role === 'ROLE_SHOP'){
      this.setState({
        message: `Hãy đăng nhập vào tài khoản khách hàng!`,
        type: 'danger',
        isShow: !this.setState.isShow,
      });
      return;
    }
    // console.log("1111111111111111111 : " + this.props.productId + ": " + Number(this.state.amountItem))
    CartService.add(this.state.unitDetailId, this.state.amountItem);
    const userId = AuthService.getCurrentUser().userId;
    let cart = null
    if (CartService.getCurrentCart() != null && userId)
      cart = CartService.getCurrentCart()[userId];
    this.setState({
      message: `Thêm sản phẩm ${this.props.product.productName} vào giỏ hàng!`,
      type: 'success',
      isShow: !this.setState.isShow,
    });

    setTimeout(() =>  window.location.reload(), 3000)
  }
  handleClickChecked(){
    put(`userProducts/${this.state.userProducts.userProductId}`, {"isLove": !this.state.isLove ? "true" : "false"})
        .then(res => {
          if (res !== undefined)
            if (res.status === 200) {
              console.log("isLove", !this.state.isLove)
            }
        })
    this.setState({
      isLove: !this.state.isLove
    })
  }

  render() {
    return (
        <div className="row">
          <h3 className="mb-4 fw-title">{this.props.product.productName}</h3>
          <div className="col-11 d-flex align-items-center">
            {this.state.stars}
            <span className="text-muted text-uppercase text-sm">{this.props.totalReview} bình luận</span>
          </div>
          <div className="col-1 d-flex align-items-center">
            <a onClick={(e) => this.handleClickChecked(e)}>
              <img src={`${this.state.isLove ? this.imageLove[1] : this.imageLove[0]}`} style={{width: "30px", height: "30px"}}></img>
            </a>
          </div>
          <hr />
          <div className="col-lg-6 py-3 order-2 order-lg-1">
            <div className="col-lg-6 col-xl-8 pl-4 order-2 order-lg-1 m-lg-4">
              <ImageList id={this.props.productId}></ImageList>
            </div>
          </div>

          <Message isShow={this.state.isShow} type={this.state.type} message={this.state.message} key={this.state.message}/>
          <div className="d-flex col-lg-6 col-xl-5 ps-lg-5 mb-5 order-1 order-lg-2">
            <div>
              <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-sm-between">
                <div className="list-inline mb-2 mb-sm-0">
                  <div className="list-inline-item h4 mb-0 text-red fw-title"><del style={{marginRight : '2px'}}/>
                    {Object.keys(this.state.event).length === 0 ?
                        (this.state.minPrice === this.state.maxPrice ?
                            <div><NumberFormat value={this.state.minPrice} displayType={'text'} thousandSeparator={true} suffix=' vnđ'/></div> :
                            <div>
                              <NumberFormat value={this.state.minPrice} displayType={'text'} thousandSeparator={true}/> -
                              <NumberFormat value={this.state.maxPrice} displayType={'text'} thousandSeparator={true} suffix=' vnđ'/>
                            </div>) : (
                            this.state.minPrice === this.state.maxPrice ?
                                <div><NumberFormat value={Math.floor((this.state.minPrice * ((100 - this.state.event.discountValue)/100))/1000)*1000}
                                                   displayType={'text'} thousandSeparator={true} suffix=' vnđ'/></div> :
                                <div>
                                  <NumberFormat value={Math.floor((this.state.minPrice * ((100 - this.state.event.discountValue)/100))/1000)*1000}
                                                displayType={'text'} thousandSeparator={true}/> -
                                  <NumberFormat value={Math.floor((this.state.maxPrice * ((100 - this.state.event.discountValue)/100))/1000)*1000}
                                                displayType={'text'} thousandSeparator={true} suffix=' vnđ'/>
                                </div>)
                    }
                  </div>
                  <div className="list-inline-item text-muted fw-light">
                    <del>
                      {this.state.minPrice === this.state.maxPrice ?
                          <div><NumberFormat value={this.state.minPrice} displayType={'text'} thousandSeparator={true} suffix=' vnđ'/></div> :
                          <div>
                            <NumberFormat value={this.state.minPrice} displayType={'text'} thousandSeparator={true}/> -
                            <NumberFormat value={this.state.maxPrice} displayType={'text'} thousandSeparator={true} suffix=' vnđ'/>
                          </div>
                      }
                    </del>
                  </div>
                </div>
              </div>

              <p className="mb-4 text-black fw-bold">Tình trạng:
                <span className="text-red-3 margin-left-10" style={{fontStyle : 'normal'}}>
                {this.props.product.remain === 0 ? 'Hết hàng' : 'Còn hàng'}
                </span>
              </p>
              <div className="mb-4 text-red-2">ĐẶC ĐIỂM NỔI BẬT <span className="text-black"><hr/></span>
                <div className="margin-bot-40px">
                  {this.state.feature}
                </div>
              </div>

              <div className="margin-bot-15px">
                <div className="font-weight-bold-margin">Size:</div>
                <div id="sizeButtons">
                  <div>
                    {/*{console.log("this.state.units && this.state.unitDetails.length !== 0: ", this.state.units && this.state.unitDetails.length !== 0,*/}
                    {/*    this.state.units, this.state.unitDetails, this.state.unitDetails.length)}*/}
                    {this.state.units && this.state.unitDetails.length !== 0 ?
                        <div>
                          {this.state.units.map((unit, index) => (
                              <button
                                  id={`size${unit.unitId}`}
                                  className={`${this.state.unitDetails[index].unitDetailAmount === 0 ? "square-button-gray" : "square-button"} ${this.state.selectedSize === unit.unitName.substring(5) ? "selected" : ""}`}
                                  onClick={() => this.handleSizeClick(index, this.state.unitDetails[index].unitDetailId, unit.unitName.substring(5), this.state.unitDetails[index].unitDetailAmount, this.state.unitDetails[index].productPrice)}
                              >
                                {unit.unitName.substring(5)}
                              </button>
                          ))}
                        </div> : <div></div>
                    }
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12 col-lg-6 detail-option mb-5">
                  <label className="detail-option-heading fw-bold">Tồn kho:
                    <span>{this.state.remainSelected ? this.state.remainSelected : this.props.product.amountProduct}</span>
                  </label>
                  <input className="form-control detail-quantity" name="items" type="number"
                         onChange={(e) => this.handleChange(e)} value={this.state.amountItem}>
                  </input>
                </div>
              </div>
              <ul className="list-inline">
                <li className="list-inline-item">
                  <a className="btn btn-dark btn-lg mb-1" onClick={() => this.add2Cart()}> <i
                      className="fa fa-shopping-cart me-2"></i>Thêm vào giỏ hàng</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
    )
  }
}