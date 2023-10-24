import React, {Component} from 'react'
import {del, get} from '../../api/callAPI';
import Message from "../../util/Message";
import ModalAddOrEditFeature from "./ModalAddOrEditFeature";
import FeatureList from "../../components/features/FeatureList";

export default class ModalFeature extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: {},
      rates: [],
      rate: 0,
      isEdit: false,
      idEdit: 0
    }
  }
  async doDelete(id) {
    del(`features/${id}`)
        .then(res => {
              if (res && res.status === 202) {
                window.alert(`Xóa tính năng ${id} thành công`);
                window.location.reload();
              }
            },
            err => {
              window.alert(`Xóa tính năng ${id} thất bại ${err.response.data.error} ${err.response.data.message}`);
            }
        );
    await this.setState({
      isShow: !this.setState.isShow,
    })
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
  handleEditFeatureId (featureId){
    this.setState({
      idEdit: featureId
    })
    this.setState({
      isEdit: true
    })
  }
  handleButtonAddFeature() {
    this.setState({
      idEdit: 0
    })
    this.setState({
      isEdit: true
    })
  }
  handleNotEdit() {
    this.setState({
      isEdit: false
    })
  }
  render() {
    return (
        <div className="modal fade quickview" id="modalFeature" tabIndex="-1" role="dialog" aria-hidden="true">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <button className="close modal-close" type="button" data-bs-dismiss="modal" aria-label="Close"
                      onClick={(e) => this.props.handleModalComponent(0)}></button>
              {!this.state.isEdit &&
                  <div className="modal-body body-background">
                    <div className="panel-header1">
                      {/*<img src="https://toigingiuvedep.vn/wp-content/uploads/2021/08/ve-con-ca-hoat-hinh-an-tuong.png"*/}
                      {/*     style={{width: "50px", height: "50px", marginLeft: "50px", color: "#fff3cd"}}/>*/}
                      <span className="title-small" style={{fontSize: "20px"}}>tính năng</span>
                    </div>
                    <Message isShow={this.state.isShow} type={this.state.type} message={this.state.message} key={this.state.message}/>

                    <button className="add-button" key={`'Add'${this.props.id}`} onClick={() => this.handleButtonAddFeature()}>
                      <i className="fas fa-plus-circle"></i> THÊM MỚI
                    </button>
                    <hr/>
                    <table className="table table-borderless table-hover table-responsive-md">
                      <thead className="bg-light">
                      <tr className="can-giua">
                        <th className="py-4 text-uppercase text-sm">STT</th>
                        <th className="py-4 text-uppercase text-sm" style={{width: "180px"}}>Tên</th>
                        <th className="py-4 text-uppercase text-sm">Hành động</th>
                      </tr>
                      </thead>
                      <tbody>
                      <FeatureList featureTypeId = {this.props.featureTypeId} handleEditFeatureId = {(id) => this.handleEditFeatureId(id)}
                                    deleteFeature={(id) => this.handleDelete(id)} isRadio={false}/>
                      </tbody>
                    </table>
                  </div>
              }
              {this.state.isEdit &&
                  <ModalAddOrEditFeature featureTypeId={this.props.featureTypeId} id={this.state.idEdit} handleNotEdit={()=>this.handleNotEdit()} />}
            </div>
          </div>
        </div>
    )
  }
}
