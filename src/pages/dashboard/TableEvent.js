import React, {Component} from 'react'
import CategoryTypeList from '../../components/categorieTypes/CategoryTypeList'
import {del} from '../../api/callAPI';

import Message from '../../util/Message';
import ModalCategory from "./ModalCategory";
import EventList from "../../components/Event/EventList";

export default class TableEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 0,
      type: 'success',
      isShow: false,
      message: '',
    }
  }
  async doDelete(id) {
    del(`events/${id}`)
        .then(res => {
              if (res && res.status === 202)
                this.setState({
                  message: `Xóa sự kiện thành công`,
                  type: 'success',
                  key: id,
                });
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
  render() {
    return (
        <>
          <Message isShow={this.state.isShow} type={this.state.type} message={this.state.message} key={this.state.message}/>

          <br/>
          <h1 className="title text-center">QUẢN LÝ SỰ KIỆN</h1>
          <button className="add-button" key={`'Add'${this.props.id}`} onClick={() => this.props.addNewEvent()}>
            <i className="fas fa-plus-circle"></i> THÊM MỚI
          </button>
          <hr/>
          <table className="table table-borderless table-hover table-responsive-md">
            <thead className="bg-light">
            <tr className="can-giua">
              <th className="py-4 text-uppercase text-sm">Sự kiện #</th>
              <th className="py-4 text-uppercase text-sm">Tên</th>
              <th className="py-4 text-uppercase text-sm">Ngày bắt đầu</th>
              <th className="py-4 text-uppercase text-sm">Ngày kết thúc</th>
              <th className="py-4 text-uppercase text-sm">Trạng thái</th>
              <th className="py-4 text-uppercase text-sm">Hành động</th>
            </tr>
            </thead>
            <tbody>
            <EventList deleteEvent={(id) => this.handleDelete(id)} key={this.state.key}/>
            </tbody>
          </table>
        </>
    )
  }
}
