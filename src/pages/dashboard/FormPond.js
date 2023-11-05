import React, {Component} from 'react'

import Form from 'react-validation/build/form';
import Button from 'react-validation/build/button';
import CheckButton from 'react-validation/build/button';

import {get, post, put} from '../../api/callAPI';
import {withRouter} from 'react-router-dom';
import Message from '../../util/Message';

class FormPond extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pondId: 0,
      key: 0,
      standardPrice: 0,
      pondAmount: 0,
      inputDate: '',
      priceShip: 0,
      unitDetailId: 0,
      units: [],
      products: [],
      product: {},
      unit: {},
      unitDetail: {},
      type: 'success',
      isShow: false,
      message: '',
    }
  }
  componentDidMount() {
    console.log(this.props.match.params.id);
    if (this.props.match.params.id) {
      get(`ponds/${this.props.match.params.id}`)
          .then(res => {
            if (res !== undefined)
              console.log("ponds: ", res.data)
            if (res.status === 200) {
              this.setState({
                standardPrice: res.data.standardPrice,
                pondAmount: res.data.pondAmount,
                priceShip: res.data.priceShip,
              });
            }
          });
      this.setState({
        id: this.props.match.params.id,
      })
    }
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
  standardPriceOnChange(e) {
    this.setState({
      standardPrice: e.target.value,
    })
  }
  priceShipOnChange(e) {
    this.setState({
      priceShip: e.target.value,
    })
  }

  pondAmountOnChange(e) {
    this.setState({
      pondAmount: e.target.value,
    })
  }
  async doCreate(e) {
    e.preventDefault();
    let paramProduct = {}
    paramProduct['productId'] = this.state.product.productId;
    paramProduct['unitId'] = this.state.unit.unitId;
    console.log("paramProduct ", paramProduct)
    get('unitDetail', paramProduct)
        .then(res => {
          if (res !== undefined)
            if (res.status === 200) {
              this.setState({unitDetailId: res.data[0].unitDetailId})
              console.log("unitDetailId: ", res.data, res.data[0].unitDetailId)
            }
        })
    this.form.validateAll();
    setTimeout(() => {
      if (this.checkBtn.context._errors.length === 0) {
        if ((this.state.standardPrice === 0 && this.state.standardPrice >= 1000) || this.state.pondAmount === 0 ||
            (this.state.priceShip === 0 && this.state.priceShip >= 1000) || this.state.unitDetailId === 0){
          this.setState({
            message: `Điền đầy đủ thông tin!`,
            type: 'danger'
          });
          return
        }
        let params = {};
        params['standardPrice'] = this.state.standardPrice;
        params['pondAmount'] = this.state.pondAmount;
        params['priceShip'] = this.state.priceShip
        params['unitDetailId'] = this.state.unitDetailId

        console.log("param: ", params)
        if (this.props.match.params.id) {
          put(`ponds/${this.props.match.params.id}`, params)
              .then(res => {
                    if (res && res.status === 202)
                      this.setState({
                        message: `Cập nhập kho thành công!`,
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
        } else {
          post(`ponds`, params)
              .then(res => {
                    if (res && res.status === 201)
                      this.setState({
                        message: `Tạo kho thành công!`,
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
        this.setState({
          isShow: !this.setState.isShow,
        })
      }
    }, 1000)
  }
  handleOnChangeSize(e){
    this.setState({
      unit: this.state.units[e.target.value]
    })
    console.log("unit: ", this.state.units[e.target.value], this.state.units[e.target.value].unitId)
  }
  handleOnChangeProduct(e){
    this.setState({
      product: this.state.products[e.target.value]
    })
    console.log("product: ", this.state.products[e.target.value], this.state.products[e.target.value].productId)
    get('unitDetail', {"productId": this.state.products[e.target.value].productId})
        .then(res => {
          if (res !== undefined) {
            if (res.status === 200) {
              let units = []
              Object.values(res.data).map((value, index) => {
                get(`unit/${value.unitId}`)
                    .then(res2 => {
                      if (res2 !== undefined)
                        if (res2.status === 200) {
                          units.push(res2.data)
                        }
                    });
              })
              setTimeout(() => this.setState({units: units}), 500)
            }
          }
        })
  }
  render() {
    return (
        <><Message isShow={this.state.isShow} type={this.state.type} message={this.state.message}
                   key={this.state.message}/>
          <div className="block mb-5">
            <div className="block-header">
              <strong className="text-uppercase">{this.props.match.params.id ? 'Sửa' : 'Thêm'} Kho</strong>
            </div>
            <div className="block-body">
              <Form onSubmit={(e) => this.doCreate(e)} ref={c => {this.form = c;}}>
                <div className="row">
                  {this.props.match.params.id && (<div className="col-sm-6">
                    <div className="mb-4">
                      <label className="form-label" htmlFor="pondId">Id</label>
                      <input className="form-control" name="pondId" id="pondId" value={this.state.id}
                             type="text" readOnly={true}/>
                    </div>
                  </div>)}
                  <div className="col-sm-6">
                    <div className="mb-4">
                      <label className="form-label" htmlFor="amountPond">Số lượng</label>
                      <input className="form-control" name="amountPond" id="amountPond" value={this.state.pondAmount}
                             onChange={(e) => this.pondAmountOnChange(e)} type="number"/>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <div className="mb-4">
                      <label className="form-label" htmlFor="standardPrice">Giá hàng</label>
                      <input className="form-control" name="standardPrice" value={this.state.standardPrice}
                             onChange={(e) => this.standardPriceOnChange(e)}
                                id="standardPrice" type="number"/>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="mb-4">
                      <label className="form-label" htmlFor="priceShip">Phí giao hàng</label>
                      <input className="form-control" name="priceShip" value={this.state.priceShip}
                             onChange={(e) => this.priceShipOnChange(e)}
                             id="priceShip" type="number"/>
                    </div>
                  </div>
                </div>
                {!this.props.match.params.id &&
                    <div className="row">
                      <div className="col-6">
                        <div className="mb-4">
                          <label className="form-label" htmlFor="product">Nhập sản phẩm</label>
                          <select className='form-select' id='product' name='product'
                                  onChange={(e) => this.handleOnChangeProduct(e)}>
                            <option value="">Chọn sản phẩm</option>
                            {this.state.products.length !== 0 && this.state.products.map((value, index) => (
                                <option value={index}>{value.productName}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="mb-4">
                          <label className="form-label" htmlFor="size">Nhập size</label>
                          <select className='form-select' id='size' name='size'
                                  onChange={(e) => this.handleOnChangeSize(e)}>
                            <option value="">Chọn size</option>
                            {this.state.units !== [] && this.state.units.map((value, index) => (
                                <option value={index}>{value.unitName}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                }
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

export default withRouter(FormPond);
