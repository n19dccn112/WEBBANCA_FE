import React, {Component} from 'react'

import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Button from 'react-validation/build/button';
import CheckButton from 'react-validation/build/button';
import TextArea from 'react-validation/build/textarea';

import {get, post, put} from '../../api/callAPI';
import {withRouter} from 'react-router-dom';
import Message from '../../util/Message';
import {required,} from "../../util/constrain";
import DatePicker from "react-datepicker";
import moment from "moment";

class FormEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      key: 0,
      name: '',
      descript: '',
      startDate: '',
      endDate: '',
      discountCode: '',
      discountValue: 0,
      checkDiscountValue: true,
      nameOk: true,
      descriptOk: true,
      startDateOk: true,
      endDateOk: true,
      discountCodeOk: false,
      discountValueOk: false,
      type: 'success',
      isShow: false,
      message: '',
      products: [],
      productsSelect: [],
      product: {},
      productsSelectOk: true
    }
  }
  componentDidMount() {
    get(`events/${this.props.match.params.id}`)
        .then(res => {
          if (res !== undefined) {
            if (res.status === 200) {
              this.setState({
                name: res.data.eventName,
                descript: res.data.eventDescription,
                startDate: moment(res.data.startDate).toDate(),
                endDate: moment(res.data.endDate).toDate(),
                discountCode: res.data.discountCode !== null ? res.data.discountCode : '',
                discountValue: res.data.discountValue !== null ? res.data.discountValue : 0,
                checkDiscountValue: res.data.discountValue !== null,
                productsSelect: res.data.productDTOS
              });
            }
          }
        })
      this.setState({
        id: this.props.match.params.id,
      })
    get('products')
        .then(res => {
          if (res !== undefined) {
            if (res.status === 200)
              this.setState({
                products: res.data
              });
          }
        });
  }
  idOnChange(e) {
    this.setState({
      id: this.state.id,
    })
  }
  descOnChange(e) {
    if (e.target.value === ''){
      this.setState({
        descript: e.target.value,
        descriptOk: false
      })
    }
    else
      this.setState({
        descript: e.target.value,
        descriptOk: true
      })
  }
  nameOnChange(e) {
    if (e.target.value === ''){
      this.setState({
        name: e.target.value,
        nameOk: false
      })
    }
    else
      this.setState({
        name: e.target.value,
        nameOk: true
      })
  }
  async doCreate(e) {
    e.preventDefault()
    if (this.state.nameOk && this.state.descriptOk && this.state.startDateOk &&
        this.state.endDateOk && this.state.discountCodeOk && this.state.discountValueOk &&
        this.state.productsSelect){
      this.setState({
        message: `Hãy điền đầy đủ thông tin!`,
        type: 'danger',
        isShow: true
      });
    }
    else{
      let params = {};
      params['eventName'] = this.state.name;
      params['eventDescription'] = this.state.descript;
      params['startDate'] = this.state.startDate
      params['endDate'] = this.state.endDate;
      params['discountCode'] = this.state.discountCode;
      params['discountValue'] = this.state.discountValue
      params['productDTOS'] = this.state.productsSelect

      console.log(params);
      if (this.props.match.params.id) {
        put(`events/${this.props.match.params.id}`, params)
            .then(res => {
                  if (res && res.status === 202)
                    this.setState({
                      message: `Cập nhập sự kiện thành công!`,
                      type: 'success',
                      isShow: true
                    });
                  console.log(res);
                },
                err => {
                  err.response && this.setState({
                    message: `${err.response.data.error} ${err.response.data.message}`,
                    type: 'danger',
                    isShow: true
                  });
                })
      } else {
        post(`events`, params)
            .then(res => {
                  if (res && res.status === 201)
                    this.setState({
                      message: `Tạo sự kiện thành công!`,
                      type: 'success'

                    });
                  console.log(res);
                },
                err => {
                  err.response && this.setState({
                    message: `${err.response.data.error} ${err.response.data.message}`,
                    type: 'danger',
                  });
                })
      }
    }
  }
  startDateOnChange(date){
    if (date === '') {
      this.setState({
        message: `Ngày không được trống`,
        type: 'danger',
        isShow: true,
        startDateOk: false
      });
    }else if (date >= this.state.endDate && this.state.endDate !== ''){
      this.setState({
        message: `Ngày bắt đầu không lớn hơn ngày kết thúc`,
        type: 'danger',
        isShow: true,
        endDateOk: false
      });
    }else {
      this.setState({
        startDate: date,
        startDateOk: true
      })
    }
  }
  endDateOnChange(date){
    if (date === '') {
      this.setState({
        message: `Ngày không được trống`,
        type: 'danger',
        isShow: true,
        endDateOk: false
      });
    }else if (date <= this.state.startDate && this.state.startDate !== ''){
      this.setState({
        message: `Ngày kết thúc không nhỏ hơn ngày bắt đầu`,
        type: 'danger',
        isShow: true,
        endDateOk: false
      });
    }else {
      this.setState({
        endDate: date,
        endDateOk: true
      })
    }
  }
  handleClickChecked(e){
    e.preventDefault()
    this.setState({
      checkDiscountValue: !this.state.checkDiscountValue
    })
  }
  handleChangeDiscountValue(e){
    e.preventDefault()
    if (e.target.value === ''){
      this.setState({
        discountValue: e.target.value,
        discountValueOk: false
      })
    }
    else
      this.setState({
        discountValue: e.target.value,
        discountValueOk: true
      })
  }
  handleChangeDiscountCode(e){
    e.preventDefault()
    if (e.target.value === ''){
      this.setState({
        discountCode: e.target.value,
        discountCodeOk: false
      })
    }
    else
      this.setState({
        discountCode: e.target.value,
        discountCodeOk: true
      })
  }
  handleOnChangeProduct(e) {
    let productsSelect = this.state.productsSelect
    productsSelect.push(this.state.products[e.target.value])
    this.setState({
      product: productsSelect,
      productsSelectOk: true
    })
  }
  deleteProductSelected(index) {
    let products = [...this.state.productsSelect];
    products.splice(index, 1);
    const productsSelectOk = Object.keys(products).length !== 0
    this.setState({
      productsSelect: products,
      productsSelectOk: productsSelectOk
    });
  }
  render() {
    return (
        <>
          <div className="block mb-5">
            <div className="block-header">
              <strong className="text-uppercase">{this.props.match.params.id ? 'Sửa' : 'Thêm'} Sự kiện</strong>
            </div>
            <div className="block-body">
              <Form onSubmit={(e) => this.doCreate(e)} ref={c => {this.form = c;}}>
                <div className="row">
                  {this.props.match.params.id && (<div className="col-sm-6">
                    <div className="mb-4">
                      <label className="form-label" htmlFor="eventid">Id</label>
                      <input className="form-control" name="eventid" id="eventid" value={this.state.id}
                             onChange={(e) => this.idOnChange(e)}
                             type="text" readOnly={true}/>
                    </div>
                  </div>)}
                  <div className="col-sm-6">
                    <div className="mb-4">
                      <label className="form-label" htmlFor="eventName">
                        Tên <span style={{color: "red"}}>{!this.state.nameOk ? '*' : ''}</span>
                      </label>
                      <input className="form-control" name="eventName" id="eventName" value={this.state.name}
                             onChange={(e) => this.nameOnChange(e)} type="text"/>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="mb-4">
                      <label className="form-label" htmlFor="catedesc">
                        Chi tiết <span style={{color: "red"}}>{!this.state.descriptOk ? '*' : ''}</span>
                      </label>
                      <TextArea className="form-control" name="catedesc" value={this.state.descript} onChange={(e) => this.descOnChange(e)}
                                id="catedesc" type="text" validations={[required]}/>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-3">
                    <div className="mb-4">
                      <label className="form-label" htmlFor="productdate">
                        Ngày bắt đầu <span style={{color: "red"}}>{!this.state.startDateOk ? '*' : ''}</span>
                      </label>
                      <br/>
                      <DatePicker
                          className="form-control"
                          name="productdate"
                          selected={this.state.startDate}
                          onChange={(date) => this.startDateOnChange(date)}
                          id="productdate"/>
                    </div>
                  </div>
                  <div className="col-sm-3">
                    <div className="mb-4">
                      <label className="form-label" htmlFor="productdate">
                        Ngày kết thúc <span style={{color: "red"}}>{!this.state.endDateOk ? '*' : ''}</span>
                      </label>
                      <br/>
                      <DatePicker
                          className="form-control"
                          name="productdate"
                          selected={this.state.endDate}
                          onChange={(date) => this.endDateOnChange(date)}
                          id="productdate"/>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="mb-4">
                      <label className="form-label" htmlFor="product">
                        Nhập sản phẩm <span style={{color: "red"}}>{!this.state.productsSelectOk ? '*' : ''}</span>
                      </label>
                      <select className='form-select' id='product' name='product'
                              onChange={(e) => this.handleOnChangeProduct(e)}>
                        <option value="">Chọn sản phẩm</option>
                        {this.state.products.length !== 0 && this.state.products.map((value, index) => (
                            <option value={index}>{value.productName}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    {Object.keys(this.state.productsSelect).length !== 0 &&
                        <div className="title-small">Chọn sản phẩm:<i><br/></i>
                          {this.state.productsSelect.map((value, index) => (
                              <div className="product-list1" key={value.productId}>
                                  <span className="category-name" style={{fontSize: "20px", color: "darkred"}}>{value.productName}
                                    <i className="" style={{marginLeft: "20px", color: "black"}} key={`'DeleteProduct'${index}`}
                                       onClick={(e) => this.deleteProductSelected(index)}>
                                      <i className="fas fa-trash"></i>
                                    </i>
                                  </span >
                              </div>
                          ))}
                        </div>
                    }
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-4">
                    <div className="mb-4">
                      <label className="form-label" htmlFor="cateDis">
                        Phần trăm giảm giá <span style={{color: "red"}}>
                        {(!this.state.discountValue && this.state.checkDiscountValue) ? '*' : ''}</span>
                      </label>
                      <button
                          className={`round-button ${this.state.checkDiscountValue && 'clicked'}`}
                          onClick={(e) => this.handleClickChecked(e)}>
                        <div className="inner-circle"></div>
                      </button>
                    </div>
                  </div>
                  {this.state.checkDiscountValue &&
                      <div className="col-4">
                        <div className="mb-4">
                          <input className="detail-quantity" name="items" type="number"
                                 onChange={(e) => this.handleChangeDiscountValue(e)}
                                 value={this.state.discountValue}>
                          </input>
                          <label className="ms-2 form-label" htmlFor="catedesc">(VD: 50%)</label>
                        </div>
                      </div>
                  }
                </div>
                <div className="row">
                  <div className="col-4">
                    <div className="mb-4">
                      <label className="form-label" htmlFor="catedesc">
                        Mã giảm giá
                        <span style={{color: "red"}}>{(!this.state.discountCode && !this.state.checkDiscountValue) ? '*' : ''}</span>
                    </label>
                      <button
                          className={`round-button ${!this.state.checkDiscountValue && 'clicked'}`}
                          onClick={(e) => this.handleClickChecked(e)}>
                        <div className="inner-circle"></div>
                      </button>
                    </div>
                  </div>
                  {!this.state.checkDiscountValue &&
                      <div className="col-8">
                        <div className="mb-4">
                          <input className="" name="items" type="text"
                                 onChange={(e) => this.handleChangeDiscountCode(e)}
                                 value={this.state.discountCode}>
                          </input>
                          <label className="ms-2 form-label" htmlFor="catedesc">(VD: SINHNHATLAN10)</label>
                        </div>
                      </div>
                  }
                </div>
                <Message isShow={this.state.isShow} type={this.state.type} message={this.state.message}
                         key={this.state.message}/>
                <div className="text-center mt-4">
                  <Button className="btn btn-outline-dark" type="submit"><i className="far fa-save me-2"></i>Lưu</Button>
                </div>
                <CheckButton style={{display: "none"}} ref={c => {this.checkBtn = c;}}
                />
              </Form>
            </div>
          </div>
        </>
    )
  }
}

export default withRouter(FormEvent);
