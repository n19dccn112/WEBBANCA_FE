import React, {Component} from 'react'
import ProductList from '../../components/products/ProductList';
import {del} from '../../api/callAPI';

import Message from '../../util/Message';
import PageSlide from "../pageFoot/PageSlide";

export default class TableProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'success',
      isShow: false,
      message: '',
      key: 0,
      minNumber: 0,
      maxNumber: 10,
      numberIndex: 1,
      pageComponent: [],
      numberPage: 1
    }
  }

  async doDelete(id) {
    del(`products/${id}`)
        .then(res => {
              if (res && res.status === 202)
                this.setState({
                  message: `Xóa sản phẩm ${id} thành công!`,
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
  buildPage(){
    let component = []
    for (let i=1; i<=this.state.numberPage; i++){
      component.push(
          <li key={`Selected${i}`} className={`${this.state.numberIndex === i && 'active'} page-item`}>
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
    setTimeout(() => {this.buildPage()}, 500)
  }

  handleNumberPage(numberPage) {
    this.setState({numberPage: numberPage})
    this.buildPage()
  }
  render() {
    return (
        <>
          <Message isShow={this.state.isShow} type={this.state.type} message={this.state.message} key={this.state.message}/>

          <button className="add-button" key={`'Add'${this.props.id}`} onClick={() => this.props.addNewProc()}>
            <i className="fas fa-plus-circle"></i> THÊM MỚI
          </button>

          <hr/>
          <table className="table table-borderless table-hover table-responsive-md">
            <thead className="bg-light">
            <tr>
              <th className="py-4 text-uppercase text-sm text-center">STT #</th>
              <th className="py-4 text-uppercase text-sm text-center">Tên</th>
              <th className="py-4 text-uppercase text-sm text-center">Động vật</th>
              <th className="py-4 text-uppercase text-sm text-center">Chi tiết</th>
              <th className="py-4 text-uppercase text-sm text-center">Ngày hết hạn (nhập)</th>
              <th className="py-4 text-uppercase text-sm text-center">Hành động</th>
            </tr>
            </thead>
            <tbody>
            <ProductList
                pageName={"TableProduct"}
                minNumber={this.state.minNumber} maxNumber={this.state.maxNumber}
                handleNumberPage={(numberPage) => this.handleNumberPage(numberPage)}
                isTable={true} deleteProduct={(id) => this.handleDelete(id)} key={this.state.key}/>
            </tbody>
          </table>
          <PageSlide handleNumberIndex={(numberIndex) => this.handleNumberIndex(numberIndex)}
                     numberIndex={this.state.numberIndex} numberPage={this.state.numberPage} pageComponent={this.state.pageComponent}/>
        </>
    )
  }
}
