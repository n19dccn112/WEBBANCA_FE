import React, {Component} from 'react'

import Form from 'react-validation/build/form';
import Button from 'react-validation/build/button';
import CheckButton from 'react-validation/build/button';

import {get, post, put} from '../../api/callAPI';
import {withRouter} from 'react-router-dom';
import Message from '../../util/Message';

class FormStatusFish extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pondId: 0,
      key: 0,
      unitDetailId: 0,
      statusFishDetails: [],
      units: [],
      products: [],
      product: {},
      unit: {},
      unitDetail: {},
      type: 'success',
      isShow: false,
      message: '',
      statusFishAmount: [],
      hasAmount: false,
      sumAmount: 0
    }
    this.statusFishName = ["Sống", "Chết", "Bệnh"]
  }
  componentDidMount(){
    get('products')
        .then(res => {
          if (res !== undefined) {
            if (res.status === 200)
              this.setState({
                products: res.data
              });
          }
        });
    let amount = [0, 0, 0]
    this.setState({statusFishAmount: amount})
  }
  async doCreate(e) {
    e.preventDefault();

    console.log("product, unit: ", this.state.product, this.state.unit)
    if (!this.state.hasAmount){
      this.setState({
        message: `Điền đầy đủ thông tin!`,
        type: 'danger',
        isShow: true
      });
      return
    }

    this.statusFishName.map((value, index) => {
      let params = {};
      params['statusFishId'] = index + 1;
      params['unitDetailId'] = this.state.unitDetail.unitDetailId

      get('statusFishDetail', params)
          .then(res => {
            if (res !== undefined) {
              if (res.status === 200) {
                params['amount'] = this.state.statusFishAmount[index]
                console.log("param: ", params)
                put(`statusFishDetail/${res.data[0].statusFishDetailId}`, params)
                    .then(res => {
                          if (res && res.status === 202)
                            this.setState({
                              message: `Cập nhập trạng thái cá thành công!`,
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
                this.setState({
                  isShow: !this.setState.isShow,
                })
              }
            }
          });
    })
  }
  handleOnChangeSize(e){
    this.setState({
      unit: this.state.units[e.target.value]
    })
    console.log("productId", this.state.product.productId, "unitId", this.state.units[e.target.value].unitId)
    get('unitDetail', {"productId": this.state.product.productId,
                                      "unitId": this.state.units[e.target.value].unitId})
        .then(res => {
          if (res !== undefined) {
            if (res.status === 200) {
              console.log("unitDetail: ", res.data[0])
              this.setState({unitDetail: res.data[0]})
              let statusAmount = [0, 0, 0]
              let statusCheck = [false, false, false]
              this.statusFishName.map((value, index) => {
                console.log("map statusFishDetail: ", index+1, res.data[0].unitDetailId, value)
                get('statusFishDetail', {"statusFishId": index+1, "unitDetailId": res.data[0].unitDetailId})
                    .then(res1 => {
                      if (res1.status === 200 && Object.values(res1.data).length !== 0) {
                        statusAmount[index] = res1.data[0].amount
                        statusCheck[index] = true
                      }
                    })
              })
              setTimeout(() => {
                this.setState({
                  statusFishAmount: statusAmount,
                  sumAmount: statusAmount[0] + statusAmount[1] + statusAmount[2],
                  hasAmount: true,
                  statusFishDetails: statusCheck,
                })
              }, 1000)
            }
          }
        })
  }
  handleOnChangeProduct(e){
    this.setState({
      product: this.state.products[e.target.value],
      hasAmount: false,
      unit: {}
    })
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
  handleCheckStatusFish(e, index){
    let statusFishDetails = this.state.statusFishDetails;
    let amount = this.state.statusFishAmount
    console.log("amount[index]: ", amount[index])
    if (amount[index] === undefined) amount[index] = 0
    if (amount[index] !== 0 || amount[index] < 0){
      this.setState({
        message: `Số lượng cá chưa về 0`,
        type: 'danger',
        isShow: true
      });
    }
    else {
      if (statusFishDetails[index] !== undefined && statusFishDetails[index] === true)
        statusFishDetails[index] = false
      else
        statusFishDetails[index] = true

      this.statusFishDetails = statusFishDetails
      this.setState({
        statusFishAmount: amount,
        statusFishDetails: statusFishDetails
      })
    }
  }
  handleAmountStatusFish(e, index){
    console.log("handleAmountStatusFish: ", e.target.value, this.state.statusFishAmount)
    if (!this.state.statusFishDetails[index]) {
      this.setState({
        message: `Hãy chọn trạng thái trước!`,
        type: 'danger',
        isShow: true
      });
      return
    }
    let amount = this.state.statusFishAmount
    let statusFishDetails = this.state.statusFishDetails;

    let sum = 0
    if (index === 1)  sum = amount[2] + Number(e.target.value)
    else if (index === 2)  sum = amount[1] + Number(e.target.value)
    if (this.state.sumAmount < sum)
      this.setState({
        message: `Đã vượt quá số lượng tồn kho`,
        type: 'danger',
        isShow: true
      });
    else if (statusFishDetails[0] === true) {
      amount[index] = Number(e.target.value)
      console.log("amount[0] ", this.state.sumAmount, amount[1], amount[2], this.state.sumAmount - amount[1] - amount[2])
      amount[0] = this.state.sumAmount - amount[1] - amount[2]
      this.setState({statusFishAmount: amount})
    }
  }
  render() {
    return (
        <><Message isShow={this.state.isShow} type={this.state.type} message={this.state.message}
                   key={this.state.message}/>
          <br/>
          <h1 className="title text-center">QUẢN LÝ TRẠNG THÁI CÁ</h1>
          <div className="block mb-5">
            <div className="block-header">
              <strong className="text-uppercase">Sửa trạng thái cá</strong>
            </div>
            <div className="block-body">
              <Form onSubmit={(e) => this.doCreate(e)} ref={c => {this.form = c;}}>
                <div className="row">
                  <div className="col-12">
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
                </div>
                <div className="row">
                  <div className="col-12">
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
                {this.state.hasAmount &&
                <div className="row">
                  <label className="form-label">Trạng thái cá</label>
                  <div className="row">
                    {this.statusFishName.map((valueFish, indexFish) => (
                        <div className="col-sm-12">
                          <div className="mb-1 me-3">
                            <div className="container1" style={{marginLeft: "20px"}}>
                              <label key={`labelStatus${valueFish}`} className="checkbox-container">
                                <input id={`checkBoxStatus${valueFish}`} type="checkbox"
                                       checked={this.state.statusFishDetails[indexFish] ?
                                           this.state.statusFishDetails[indexFish] : false}
                                       onChange={(e) =>
                                           this.handleCheckStatusFish(e, indexFish)}/>
                                {valueFish}
                                <input className="form-control" style={{marginLeft: "10px", width: "90px"}} name="amount" id="amount"
                                       value={this.state.statusFishAmount[indexFish]}
                                       readOnly={indexFish === 0}
                                       type="number" onChange={(e) =>
                                    this.handleAmountStatusFish(e, indexFish)}/>
                              </label>
                            </div>
                          </div>
                        </div>
                    ))}
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

export default withRouter(FormStatusFish);
