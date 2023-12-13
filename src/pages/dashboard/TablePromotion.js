import React, {Component} from 'react'
import CategoryTypeList from '../../components/categorieTypes/CategoryTypeList'
import {del, post, put} from '../../api/callAPI';

import Message from '../../util/Message';
import ModalCategory from "./ModalCategory";
import EventList from "../../components/Event/EventList";
import PromotionList from "../../components/Promotion/PromotionList";
import PageSlide from "../pageFoot/PageSlide";

export default class TablePromotion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 0,
      type: 'success',
      isShow: false,
      message: '',
      pageNumber: 0,
      minNumber: 0,
      maxNumber: 10,
      numberIndex: 1,
      pageComponent: [],
      numberPage: 1
    }
  }
  handleSaveEvent(e, isPut, eventId, productId, eventProductId){
    let params = {};
    params['eventId'] = eventId
    params['productId'] = productId;

    if (!isPut)
      post("eventProducts", params)
          .then(res => {
              })
    else
      put(`eventProducts/${eventProductId}`, params)
          .then(res => {
              })
    window.location.reload();
  }
  buildPage(){
    let component = []
    for (let i=1; i<=this.state.numberPage; i++){
      component.push(
          <li key={`SelectedPromotion${i}`} className={`${this.state.numberIndex === i && 'active'} page-item`}>
            <button className="page-link" onClick={() => this.handleNumberIndex(i)}>{i}</button></li>
      )
    }
    setTimeout(() => {this.setState({pageComponent :component})}, 200)
  }
  handleNumberIndex(numberIndex){
    this.setState({
      minNumber: numberIndex * 10 - 10,
      maxNumber: numberIndex * 10,
    })
    this.setState({numberIndex: numberIndex})
    setTimeout(() => {
      console.log("min, max index:", this.state.minNumber, this.state.maxNumber, numberIndex)
      this.buildPage()
    }, 500)
  }

  handleNumberPage(numberPage) {
    this.setState({numberPage: numberPage})
    this.buildPage()
  }
  render() {
    return (
        <>
          <Message isShow={this.state.isShow} type={this.state.type} message={this.state.message} key={this.state.message}/>
          <br/>
          <h1 className="title text-center">QUẢN LÝ KHUYẾN MÃI</h1>
          <hr/>
          <table className="table table-borderless table-hover table-responsive-md">
            <thead className="bg-light">
            <tr className="can-giua">
              <th className="py-4 text-uppercase text-sm">STT #</th>
              <th className="py-4 text-uppercase text-sm">Tên</th>
              <th className="py-4 text-uppercase text-sm">Size</th>
              <th className="py-4 text-uppercase text-sm">Giảm giá</th>
              <th className="py-4 text-uppercase text-sm">Sự kiện</th>
              <th className="py-4 text-uppercase text-sm">Lưu</th>
            </tr>
            </thead>
            <tbody>
            <PromotionList
                minNumber={this.state.minNumber} maxNumber={this.state.maxNumber}
                handleNumberPage={(numberPage) => this.handleNumberPage(numberPage)}
                handleSaveEvent = {(e, isPut, eventId, productId, eventProductId) =>
                this.handleSaveEvent(e, isPut, eventId, productId, eventProductId)}/>
            </tbody>
          </table>

          <PageSlide handleNumberIndex={(numberIndex) => this.handleNumberIndex(numberIndex)}
                     numberIndex={this.state.numberIndex} numberPage={this.state.numberPage} pageComponent={this.state.pageComponent}/>
        </>
    )
  }
}
