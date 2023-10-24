import React, {Component} from 'react'
import CategoryTypeList from '../../components/categorieTypes/CategoryTypeList'
import {del} from '../../api/callAPI';

import Message from '../../util/Message';
import ModalCategory from "./ModalCategory";

export default class TableCate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 0,
      type: 'success',
      isShow: false,
      message: '',
      categoryTypeId: 0,
    }
  }
  async doDelete(id) {
    del(`categoryTypes/${id}`)
        .then(res => {
              if (res && res.status === 202)
                this.setState({
                  message: `Xóa loại hàng ${id} thành công`,
                  type: 'success',
                  key: id,
                });
              console.log(res);
            },
            err => {
              this.setState({
                message: `${err.response.data.error} ${err.response.data.message}`,
                type: 'danger',
              });
            }
        );
    await this.setState({
      isShow: !this.setState.isShow,
    })
  }

  componentDidMount() {
    console.log(window.location.search);
  }

  handleDelete(id) {
    if (window.confirm('Bạn có chắc chắn muốn xóa')) {
      console.log(id);
      this.doDelete(id);
    }
    setTimeout(() => {
      this.setState({
        isShow: false
      });
    }, 2000);
  }
  handleModalComponent(categoryTypeId){
    console.log("handleModalComponent categoryTypeId: ", this.state.categoryTypeId)
    this.setState({
      categoryTypeId: categoryTypeId
    })
    if (categoryTypeId === 0){
      window.location.reload()
    }
  }

  render() {
    return (
        <>
          <Message isShow={this.state.isShow} type={this.state.type} message={this.state.message} key={this.state.message}/>

          <button className="add-button" key={`'Add'${this.props.id}`} onClick={() => this.props.addNewCate()}>
            <i className="fas fa-plus-circle"></i> THÊM MỚI
          </button>
          <hr/>
          <table className="table table-borderless table-hover table-responsive-md">
            <thead className="bg-light">
            <tr className="can-giua">
              <th className="py-4 text-uppercase text-sm">Loại hàng #</th>
              <th className="py-4 text-uppercase text-sm">Tên</th>
              <th className="py-4 text-uppercase text-sm">Mô tả</th>
              <th className="py-4 text-uppercase text-sm">Chi tiết</th>
              <th className="py-4 text-uppercase text-sm">Hành động</th>
            </tr>
            </thead>
            <tbody>
            <CategoryTypeList handleModalComponent={(categoryTypeId) => this.handleModalComponent(categoryTypeId)}
                              isTable={true} deleteCate={(id) => this.handleDelete(id)} key={this.state.key}/>
            </tbody>
          </table>
          {this.state.categoryTypeId !== 0 ?
              <ModalCategory handleModalComponent={(categoryTypeId) => this.handleModalComponent(categoryTypeId)}
                             categoryTypeId={this.state.categoryTypeId}/> : <div/>}
        </>
    )
  }
}
