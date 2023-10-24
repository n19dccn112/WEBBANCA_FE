import React, {Component} from 'react'
import ProductList from '../../components/products/ProductList';
import {del} from '../../api/callAPI';

import Message from '../../util/Message';

export default class TableProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'success',
      isShow: false,
      message: '',
      key: 0,
      minNumber: 0,
      maxNumber: 20,
      numberIndex: 0,
      pageComponent: [],
      selectIndex: 1,
      pageNumber: 0
    }
  }

  handlePageNumber(pageNumber) {
    this.setState({pageNumber: pageNumber})

    let component = []
    for (let i=1; i<=pageNumber; i++){
      component.push(
          <li key={`Selected${i}`} className={`${this.state.selectIndex===i && 'active'} page-item`}>
            <button className="page-link" onClick={(e) => this.handleSelectPage(e, i)}>{i}</button></li>
      )
    }
    this.setState({pageComponent :component})
  }
  handleSelectPage(e, pageIndex) {
    this.setState({
      minNumber: pageIndex * 20 - 20,
      maxNumber: pageIndex * 20,
    })
    this.handlePageNumber(this.state.pageNumber)
    console.log("pageNumber, this.state.minNumber, this.state.maxNumber: ",
        pageIndex, this.state.minNumber, this.state.maxNumber)
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
  handlePrevious() {

  }
  handleNext() {

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
            <ProductList minNumber={this.state.minNumber} maxNumber={this.state.maxNumber}
                         handlePageNumber={(numberIndex) => this.handlePageNumber(numberIndex)}
                         isTable={true} deleteProduct={(id) => this.handleDelete(id)} key={this.state.key}/>
            </tbody>
          </table>
          <nav className="d-flex justify-content-center mb-5 mt-3" aria-label="page navigation">
            <ul className="pagination">
              <li className="page-item"><button className="page-link" onClick={() => this.handlePrevious()} aria-label="Previous">
                <span aria-hidden="true">Trước</span></button></li>

              {this.state.pageComponent.map((value, index) => (
                  value
              ))}
              <li className="page-item"><button className="page-link" onClick={() => this.handleNext()} aria-label="Next">
                <span aria-hidden="true">Sau</span></button></li>
            </ul>
          </nav>
        </>
    )
  }
}
