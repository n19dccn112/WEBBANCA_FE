import React, {Component} from 'react'
import {del, get, post} from '../../api/callAPI';
import AuthService from "../../services/AuthService";
import ModalAddress from "./ModalAddress";
import ModalUpdateAddress from "./ModalUpdateAddress";
import Message from "../../util/Message";
export default class ModalCart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userDetails: [],
      user: {},
      idChecked: 0,
      userDetail: {},
      isCloseAdd: true,
      isCloseUpdate: true,
      modalAdd: <></>,
      modalUpdate: <></>,
      updateCheckedUserDetail: false,
      addressDefaultCheckedId: 0,
      type: 'success',
      isShow: false,
      message: '',
      key: 0,
    }
  }
  componentDidMount() {
    const user = AuthService.getCurrentUser();
    if (!user) return;
    let params = {};
    params["userId"] = user.userId;
    get('userDetails', params)
        .then(res => {
          if (res !== undefined)
            if (res.status === 200) {
              // console.log("userDetails res.data: ", res.data)
              this.setState({
                userDetails: res.data
              });
            }
        });

    get(`users/${user.userId}`)
        .then(res => {
          if (res !== undefined)
            if (res.status === 200) {
              // console.log("user res.data: ", res.data)
              this.setState({
                user: res.data,
                idChecked: res.data.userDetailIdDefault,
                updateCheckedUserDetail: res.data.userDetailIdDefault
              });
            }
        });
    setTimeout(() => {
      this.state.userDetails.map(value => (
          this.state.user.userDetailIdDefault === value.userDetailId &&
          this.setState({addressDefaultCheckedId: value.userDetailId})
      ));
    }, 1000)
  }
  handleClick = (id) => {
    this.setState({idChecked: id});
  };
  callUserDetailByUserId(){
    const sizeOld = this.state.userDetails.length;
    const waitTime = 30000; // Thời gian chờ tối đa (1 phút)
    const fetchData = () => {
      get('userDetails', {"userId": AuthService.getCurrentUser().userId})
          .then(res => {
            if (res !== undefined && res.status === 200) {
              // console.log("userDetails res.data: ", res.data)
              this.setState({
                userDetails: res.data
              });
            }
          });
    };
    if (this.state.userDetails.length !== sizeOld)
      return;

    const currentTime = new Date().getTime();
    const startTime = currentTime;
    const endTime = startTime + waitTime;

    const waitAndUpdate = () => {
      if (new Date().getTime() < endTime && this.state.userDetails.length === sizeOld) {
        fetchData()
        setTimeout(waitAndUpdate, 500); // Đợi 1 giây trước khi kiểm tra lại
      } else {// Hết thời gian chờ hoặc dữ liệu đã được cập nhật
        fetchData();
      }
    };
    waitAndUpdate();
  }
  callUserByUserId(){
    const updateCheckedUserDetailOld = this.state.updateCheckedUserDetail;
    // console.log("updateCheckedUserDetailOld: ", updateCheckedUserDetailOld)
    const waitTime = 30000; // Thời gian chờ tối đa (1 phút)
    const fetchData = () => {
      get(`users/${AuthService.getCurrentUser().userId}`)
          .then(res => {
            if (res !== undefined)
              if (res.status === 200) {
                // console.log("user res.data: ", res.data)
                this.setState({
                  user: res.data,
                  addressDefaultCheckedId: res.data.userDetailIdDefault,
                  updateCheckedUserDetail: res.data.userDetailIdDefault
                });
                // console.log("chú ý chỗ này: ", res.data.userDetailIdDefault)
              }
          });
    };
    if (this.state.updateCheckedUserDetail !== updateCheckedUserDetailOld)
      return;

    const currentTime = new Date().getTime();
    const startTime = currentTime;
    const endTime = startTime + waitTime;

    const waitAndUpdate = () => {
      if (new Date().getTime() < endTime && this.state.updateCheckedUserDetail === updateCheckedUserDetailOld) {
        // console.log("vào if: ", new Date().getTime() < endTime, this.state.updateCheckedUserDetail !== updateCheckedUserDetailOld)
        fetchData()
        setTimeout(waitAndUpdate, 500); // Đợi 1 giây trước khi kiểm tra lại
      } else {// Hết thời gian chờ hoặc dữ liệu đã được cập nhật
        // console.log("vào else", new Date().getTime() < endTime, this.state.updateCheckedUserDetail, updateCheckedUserDetailOld)
        fetchData();
      }
    };
    waitAndUpdate();
  }
  handleOpenModalAddressUpdate  = (userDetailId) => {
    // console.log("update open", userDetailId, this.state.updateCheckedUserDetail)
    setTimeout(() => {
      this.setState((prevState) => ({
        isCloseUpdate: false,
        modalUpdate: <ModalUpdateAddress userDetail={this.state.userDetail} updateCheckedUserDetail = {this.state.updateCheckedUserDetail}
                                         handleCloseModalAddressUpdate={(finishUpdate, finishUpdateDefault) => this.handleCloseModalAddressUpdate(finishUpdate, finishUpdateDefault)}/>
      }));
    }, 1000);
    const sizeOld = this.state.userDetails.length;
    const waitTime = 60000; // Thời gian chờ tối đa (1 phút)
    const fetchData = () => {
      get(`userDetails/${userDetailId}`)
          .then(res => {
            if (res !== undefined)
              if (res.status === 200) {
                this.setState({
                  userDetail: res.data,
                })
                // console.log("handleOpenModalAddressUpdate userDetail: ", res.data)
              }
          });
    };

    if (this.state.userDetails.length > sizeOld)
      return;

    const currentTime = new Date().getTime();
    const startTime = currentTime;
    const endTime = startTime + waitTime;

    const waitAndUpdate = () => {
      if (new Date().getTime() < endTime && this.state.userDetail.length > 0) {
        fetchData()
        setTimeout(waitAndUpdate, 1000); // Đợi 1 giây trước khi kiểm tra lại
      } else {// Hết thời gian chờ hoặc dữ liệu đã được cập nhật
        fetchData();
      }
    };
    waitAndUpdate();
  }
  async handleDeleteUserDetail(e, id) {
    e.preventDefault()
    if (id === this.state.addressDefaultCheckedId){
      this.setState({
        message: `Hãy chọn địa chỉ mặc định khác trước khi xóa!`,
        key: id,
        type: 'warning',
        show: true
      });
      return
    }
    if (id === this.state.idChecked){
      this.setState({
        idChecked: this.state.addressDefaultCheckedId
      })
    }
    del(`userDetails/${id}`)
        .then(res => {
              if (res && res.status === 202)
                this.setState({
                  message: `Xóa địa chỉ thành công!`,
                  key: id,
                  type: 'success',
                  show: true
                });
              this.callUserDetailByUserId()
            },
            err => {
              this.setState({
                message: `Xóa địa chỉ thất bại`,
                type: 'danger',
              });
            })
    await this.setState({
      isShow: !this.setState.isShow,
    })
  }
  handleCloseModalAddressUpdate = (finishUpdate, finishUpdateDefault) => {
    // console.log("Kết thúc update", finishUpdate, finishUpdateDefault)
    this.setState({isCloseUpdate: true,});
    if (finishUpdate) {
      this.callUserDetailByUserId()
    }
    if (finishUpdateDefault){
      this.callUserByUserId()
    }
  }
  handleOpenModalAddressAdd = () => {
    // console.log("open")
    this.setState({
      isCloseAdd: false,
      add: true,
      userDetail: {},
      modalAdd: <ModalAddress handleCloseModalAddress={(finishAdd, finishAddDefault) => this.handleCloseModalAddressAdd(finishAdd, finishAddDefault)}/>
    });
  }
  handleCloseModalAddressAdd = (finishAdd, finishAddDefault) => {
    this.setState({
      isCloseAdd: true,
    });
    if (finishAdd) {
      this.callUserDetailByUserId()
    }
    if (finishAddDefault){
      this.callUserByUserId()
    }
  }
  handleFinishCart() {
    if (this.state.idChecked !== 0) {
      this.props.onChangeUserDetailId(this.state.idChecked);
    }
  }
  render() {
    return (
          <div className="modal fade quickview" id="modalCart" tabIndex="-1" role="dialog" aria-hidden="true">
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <button className="close modal-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
                <div className="modal-body panel-background-whitesmoke">
                  <div className="address-panel panel-background-whitesmoke">
                    {this.state.isCloseAdd && this.state.isCloseUpdate &&
                    <div className="panel-header">
                      <span className="panel-title">ĐỊA CHỈ CỦA TÔI</span>
                    </div>
                    }
                    <Message isShow={this.state.isShow} type={this.state.type} message={this.state.message}
                             key={this.state.message}/>

                    <hr/>
                    <div className="address-container panel-background-white">
                      {this.state.isCloseAdd && this.state.isCloseUpdate && this.state.userDetails
                          && this.state.userDetails.length !== 0 &&
                          this.state.userDetails.map(value => (
                              <div className="address" key={value.userDetailId}>
                                <button
                                    className={`round-button ${value.userDetailId === this.state.idChecked ? 'clicked' : ''}`}
                                    onClick={() => this.handleClick(value.userDetailId)}>
                                  <div className="inner-circle"></div>
                                </button>
                                <div className="address-text-align col-9-5">
                                  <span className="address-label">{value.name} | {value.phone}</span>
                                  <br/>
                                  <span className="address-text">
                                      {value.address + ", " + value.wardName + ", " + value.districtName + ", " + value.provinceName}
                                  </span><br/>
                                  {value.userDetailId === this.state.addressDefaultCheckedId &&
                                      <span className="red-text">Mặc định</span>}
                                </div>
                                <button className="edit-button" key={`'Update'${value.userDetailId}`}
                                        onClick={(e) => this.handleOpenModalAddressUpdate(value.userDetailId)}
                                        data-bs-toggle="modal" data-bs-target="#modalUpdateAddress">
                                  <i className="fas fa-pencil-alt"></i>
                                </button>

                                <button className="delete-button" style={{marginLeft: "40px"}}  key={`'Delete'${value.userDetailId}`}
                                        onClick={(e) => this.handleDeleteUserDetail(e, value.userDetailId)}>
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                          ))}
                    </div>
                    {this.state.isCloseAdd && this.state.isCloseUpdate &&
                    <div className="add-address">
                      <button className={`${this.state.idChecked !== 0 ? 'viewed-button' : 'gray-button'}`}
                              style={{marginLeft: "20px", marginTop: "10px"}}
                              onClick={() => this.handleFinishCart()}
                              data-bs-dismiss="modal" aria-label="Close">Hoàn thành
                        <i className="fa fa-angle-right ms-2"></i>
                      </button>
                      <i className="fa fa-plus-circle ms-8" aria-hidden="true"></i>
                      <span className="add-text" key="newAddress"
                            onClick={(e) => this.handleOpenModalAddressAdd()}
                            data-bs-toggle="modal" data-bs-target="#modalAddress">Thêm địa chỉ mới</span>
                    </div>
                    }
                    {/*{console.log("this.state.isCloseAdd, this.state.isCloseUpdate: ", this.state.isCloseAdd, this.state.isCloseUpdate,*/}
                    {/*    Object.keys(this.state.userDetail).length !== 0, this.state.userDetail.length, this.state.userDetail)}*/}
                    {!this.state.isCloseAdd && this.state.isCloseUpdate && this.state.modalAdd}
                    {!this.state.isCloseUpdate && this.state.isCloseAdd && Object.keys(this.state.userDetail).length !== 0
                        && this.state.modalUpdate}
                  </div>
                </div>
              </div>
            </div>
          </div>
    )
  }
}
