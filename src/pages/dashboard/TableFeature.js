import React, {Component} from 'react'
import ProductList from '../../components/products/ProductList';
import {del} from '../../api/callAPI';

import Message from '../../util/Message';
import OrderList from "../../components/orders/OrderList";
import FeatureType from "../../components/featureTypes/FeatureType";
import FeatureTypeList from "../../components/featureTypes/FeatureTypeList";
import CategoryTypeList from "../../components/categorieTypes/CategoryTypeList";
import ModalCategory from "./ModalCategory";
import ModalFeature from "./ModalFeature";

export default class TableFeature extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'success',
      isShow: false,
      message: '',
      key: 0,
      categoryTypeId: 0,
    }
  }
  async doDelete(id) {
    del(`featureTypes/${id}`)
        .then(res => {
              if (res && res.status === 202)
                this.setState({
                  message: `Xóa loại tính năng thành công!`,
                  key: id,
                  type: 'success',
                });
              console.log(res);
            },
            err => {
              this.setState({
                message: `Có Sản phẩm đang sử dụng tính năng. Không thể xóa (Có khóa ngoại)`,
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
  handleModalComponent(featureTypeId){
    console.log("handleModalComponent featureTypeId: ", this.state.featureTypeId)
    this.setState({
      featureTypeId: featureTypeId
    })
    if (featureTypeId === 0){
      window.location.reload()
    }
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
  render() {
    return (
        <>
          <Message isShow={this.state.isShow} type={this.state.type} message={this.state.message} key={this.state.message}/>

          <button className="add-button" key={`'Add'${this.props.id}`} onClick={() => this.props.addNewFeature()}>
            <i className="fas fa-plus-circle"></i> THÊM MỚI
          </button>

          <hr/>
          <table className="table table-borderless table-hover table-responsive-md">
            <thead className="bg-light">
            <tr>
              <th className="py-4 text-uppercase text-sm ">STT #</th>
              <th className="py-4 text-uppercase text-sm ">Tên</th>
              <th className="py-4 text-uppercase text-sm ">Đơn vị tính</th>
              <th className="py-4 text-uppercase text-sm text-center">Show</th>
              <th className="py-4 text-uppercase text-sm text-center">Chi tiết</th>
              <th className="py-4 text-uppercase text-sm ">Hành động</th>
            </tr>
            </thead>
            <tbody>
            <FeatureTypeList handleModalComponent={(featureTypeId) => this.handleModalComponent(featureTypeId)}
                              isTable={true} deleteFeature={(id) => this.handleDelete(id)} key={this.state.key}/>
            </tbody>
          </table>
          {this.state.featureTypeId !== 0 ?
              <ModalFeature handleModalComponent={(featureTypeId) => this.handleModalComponent(featureTypeId)}
                            featureTypeId={this.state.featureTypeId}/> : <div/>}
        </>
    )
  }
}
