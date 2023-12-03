import React, {Component} from 'react'
import {get, post, put} from "../../api/callAPI";
import AuthService from "../../services/AuthService";
import CartService from "../../services/CartService";

export default class Promotion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      promotion: {},
      events: [],
      eventId: 0,
      productId: 0,
      isSave: false,
      eventProduct: {},
      optionFirst: <></>,
      isPut: false,

      type: 'success',
      isShow: false,
      message: '',
    }

    this.label = {
      1: "badge-info-light",
      2: "badge-success-light",
      3: "badge-warning-light"
    }
  }
  getEventProducts(productId){
    get('eventProducts', {"productId": productId})
        .then(res => {
          if (res !== undefined && res.data[0] !== undefined) {
            if (res.status === 200) {
              this.setState({
                eventProduct: res.data[0],
                isPut: true
              })
              get('eventProducts', {"productIdMaxEvent": productId})
                  .then(res1 => {
                    if (res1 !== undefined && res1.data[0] !== undefined) {
                      if (res1.status === 200) {
                        this.setState({
                          eventProduct: res1.data[0],
                          eventId: res1.data[0].eventId,
                        })
                      }
                    }
                  })
            }
          }
        })
  }
  getProducts(productId, promotion){
    get(`products/${productId}`)
        .then(res2 => {
          if (res2 && res2.status === 200) {
            promotion["productName"] = res2.data.productName
            this.setState({productId: res2.data.productId})
            this.getEventProducts(res2.data.productId)
          }
        })
  }
  getUnit(unitId, promotion){
    get(`unit/${unitId}`)
        .then(res2 => {
          if (res2 !== undefined)
            if (res2.status === 200) {
              promotion["unitName"] = res2.data.unitName
            }
        });
  }
  getUnitDetail (){
    get(`unitDetail/${this.props.unitDetailId}`)
        .then(res => {
          if (res && res.status === 200) {
            let promotion = res.data
            promotion["promotion"] = this.props.promotion
            this.getProducts(res.data.productId, promotion)
            this.getUnit(res.data.unitId, promotion)
            setTimeout(() => {this.setState({promotion: promotion})}, 500)
          }
        })
  }
  componentDidMount() {
    get('events/EventWillGoOrHaveGoing')
        .then(res => {
          if (res !== undefined) {
            if (res.status === 200) {
              this.setState({
                events: res.data
              });
              this.getUnitDetail()
            }
          }
        })
  }
  handleOnChangeEvent(e) {
    this.setState({
      eventId: e.target.value,
      isSave: e.target.value !== 0 && e.target.value !== '0',
    })
  }
  render() {
    return (
        <tr>
          <th className="py-4 align-middle"># {this.state.promotion.unitDetailId}</th>
          <td className="py-4 align-middle">{this.state.promotion.productName}</td>
          <td className="py-4 align-middle">
                  <span className={`badge p-2 text-uppercase ${this.label[this.state.promotion.unitId]}`}>
                    {this.state.promotion.unitName}</span>
          </td>
          <td className="py-4 align-middle">{this.state.promotion.promotion} %</td>
          <td className="py-4 align-middle">
            <select className='form-select' id='provinces_add' name='provinces_add' value={this.state.eventId}
                    onChange={(e) => this.handleOnChangeEvent(e)}>
              <option value={0}>Chọn sự kiện</option>
              {this.state.events.length !== 0 && this.state.events.map((value, index) => (
                  <option value={value.eventId}>{value.eventName} - {value.discountValue} %</option>
              ))}
            </select>
          </td>
          <td className="py-4 align-middle">
            <a className={`${this.state.isSave ? 'save-button' : 'save-button-enable'}`} key={`'AddEvent'${this.props.key}`}
               style={{marginLeft: "15px"}} onClick={(e) =>
                this.props.handleSaveEvent(e, this.state.isPut, this.state.eventId, this.state.productId, this.state.eventProduct.eventProductId)}>
              <i className="fas fa-plus-circle"></i>
            </a>
          </td>
        </tr>
    )
  }
}
