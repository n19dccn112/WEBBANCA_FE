import React, {Component} from 'react'
import {email, phone, required} from "../../util/constrain";
import AuthService from "../../services/AuthService";
import {get, post, put} from "../../api/callAPI";
import Message from "../../util/Message";

export default class ModalUpdateAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hadUpdate: false,
      userName: '',
      total: 0,
      provincesId: 0,
      districtsId: 0,
      wardsId: 0,
      provincesName: '',
      districtsName: '',
      wardsName: '',
      provinces: [],
      districts: [],
      wards: [],
      readOnlyStreet: true,
      street: '',
      address: '',
      phone: '',
      userId: 0,
      type: 'success',
      isShow: false,
      message: '',
      showPanel: false,
      checkFinish: false,
      checkFinishDefault: false,
      updateFirst: false,
      updateFirstProvince: false,
      updateFirstDistrict: false,
      updateFirstWard: false,
      checked: false
    }
  }
  componentDidMount(){
    // console.log("userDetail: componentDidMount: ", this.props.userDetail)

    // console.log(this.props.userDetail, Object.keys(this.props.userDetail).length !== 0, this.state.userName === '', this.state.phone === ''
    //     ,this.state.street === '' ,this.state.provincesName === '', this.state.districtsName === ''
    //     ,this.state.wardsName === '', this.state.provincesId === 0
    //     ,this.state.districtsId === 0, this.state.wardsId === 0)
    get('provinces')
        .then(res => {
          if (res !== undefined)
            if (res.status === 200) {
              this.setState({
                provinces: res.data
              });
            }
        });
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (Object.keys(this.props.userDetail).length !== 0 && this.props.updateCheckedUserDetail && this.state.userName === '' && this.state.phone === ''
        && this.state.street === '' && this.state.provincesName === '' && this.state.districtsName === ''
        && this.state.wardsName === '' && this.state.provincesId === 0
        && this.state.districtsId === 0 && this.state.wardsId === 0){
      this.setState({
        userName: this.props.userDetail.name,
        phone: this.props.userDetail.phone,
        street: this.props.userDetail.address,
        provincesName: this.props.userDetail.provinceName,
        districtsName: this.props.userDetail.districtName,
        wardsName: this.props.userDetail.wardName,
        provincesId: this.props.userDetail.provinceId,
        districtsId: this.props.userDetail.districtId,
        wardsId: this.props.userDetail.wardId,
        hadUpdate: true,
        checked: this.props.updateCheckedUserDetail === this.props.userDetail.userDetailId
      })
      // console.log("checked: ", this.state.checked, this.props.updateCheckedUserDetail,  this.props.userDetail.userDetailId)
    }
    if ((prevState.street !== this.state.street && this.state.street) ||
        (prevState.userName !== this.state.userName && this.state.userName) ||
        (prevState.phone !== this.state.phone && this.state.phone)){
      // console.log("this.state.phone: ", this.state.phone)
      if (this.state.street !== '' && this.state.userName !== null && this.state.phone !== null){
        if (this.state.phone.length !== 10){
          this.setState({
            message: `Số điện thoại chưa đúng`,
            type: 'danger',
            isShow: true,
          });
        }
      }
    }
    if (prevState.provincesId !== this.state.provincesId && this.state.provincesId !== 0 && this.state.provincesId !== undefined){
      if (!this.state.updateFirstProvince)
      this.setState({
        updateFirstProvince: true
      })
      if (this.state.updateFirst) {
        get('districts', {"provincesId": this.state.provincesId})
            .then(res => {
              if (res !== undefined)
                if (res.status === 200) {
                  this.setState({
                    districts: res.data,
                    districtsId: -2,
                    wardsId: -2,
                    wards: [],
                    districtsName: "Quận/Huyện",
                    wardsName: "Phường/Xã,",
                    street: ""
                  });
                }
            });
      }
    }
    if (prevState.districtsId !== this.state.districtsId && this.state.districtsId !== 0 && this.state.districtsId !== undefined){
      // console.log("this.state.districtsId: ", this.state.districtsId)
      if (!this.state.updateFirstDistrict)
        this.setState({
          updateFirstDistrict: true
        })
      if (this.state.updateFirst) {
        get('wards', {"districtsId": this.state.districtsId})
            .then(res => {
              if (res !== undefined)
                if (res.status === 200) {
                  this.setState({
                    wards: res.data,
                    wardsId: -2,
                    wardsName: "Phường/Xã,",
                    street: ""
                  });
                }
            });
      }
    }
    if (prevState.wardsId !== this.state.wardsId && this.state.wardsId !== 0 && this.state.wardsId !== undefined){
      if (!this.state.updateFirstWard)
        this.setState({
          updateFirstWard: true
        })
      if (this.state.updateFirst) {
        this.setState({
          readOnlyStreet: false,
          street: ""
        })
      }
    }
    if (prevState.updateFirstProvince !== this.state.updateFirstProvince && this.state.updateFirstProvince &&
        prevState.updateFirstDistrict !== this.state.updateFirstDistrict && this.state.updateFirstDistrict &&
        prevState.updateFirstWard !== this.state.updateFirst && this.state.updateFirst){
      this.setState({
        updateFirst: true
      })
    }
  }
  handleOnChangeProvinces(e) {
    const selectedIndex = e.target.value;
    const selectedProvinces = this.state.provinces[selectedIndex];
    const provincesId = selectedProvinces.provincesId;
    const provincesName = selectedProvinces.provincesName;

    // console.log("handleOnChangeProvinces: ",selectedIndex, selectedProvinces, provincesId, provincesName)

    this.setState({
      provincesId: provincesId,
      provincesName: provincesName,
      checkFinish: true
    })
  }
  handleOnChangeDistricts(e) {
    const selectedIndex = e.target.value;
    const selectedDistrict = this.state.districts[selectedIndex];
    const districtsId = selectedDistrict.districtsId;
    const districtsName = selectedDistrict.districtsName;

    // console.log("handleOnChangeDistricts: ", e.target.value, districtsId, districtsName);

    this.setState({
      districtsId: districtsId,
      districtsName: districtsName,
      checkFinish: true
    });
  }
  handleOnChangeWards(e) {
    const selectedIndex = e.target.value;
    const selectedWard = this.state.wards[selectedIndex]
    const wardsId = selectedWard.wardsId;
    const wardsName = selectedWard.wardsName;

    // console.log("handleOnChangeDistricts: ", selectedIndex, wardsId, wardsName);

    this.setState({
      wardsId: wardsId,
      wardsName: wardsName,
      checkFinish: true
    })
  }
  checkDigits(str) {
    const chars = str.split('');
    const number = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
    for (let i = 0; i < chars.length; i++) {
      // console.log("number.length: ", number.length, number, number[0])
      let countTrue = false;
      for (let n = 0; n < number.length; n++){
        if (chars[i] === number[n]){
          countTrue = true;
        }
      }
      if (!countTrue){
        return true;
      }
    }
    return false;
  };
  handleOnChangePhone(e) {
    if (e.target.value === ''){
      this.setState({
        message: `Số điện thoại không được để trống`,
        type: 'danger',
        isShow: true,
      })
      this.setState({
        phone: e.target.value
      })
    }else if (e.target.value.split('')[0] !== '0'){
      this.setState({
        message: `Số điện thoại không đúng định dạng`,
        type: 'danger',
        isShow: true,
      })
    }else if (this.checkDigits(e.target.value)){
    }else {
      this.setState({
        phone: e.target.value,
        checkFinish: true
      })
    }
  }
  handleOnChangeStreet(e) {
    if (e.target.value === '') {
      this.setState({
        message: `Địa chỉ không được để trống`,
        type: 'danger',
        isShow: true,
      });
    }
    this.setState({
      street: e.target.value,
      checkFinish: true
    })
  }
  handleOnChangeName(e){
    if (e.target.value === ''){
      this.setState({
        message: `Tên không được để trống`,
        type: 'danger',
        isShow: true,
      });
    }
    this.setState({
      userName: e.target.value,
      checkFinish: true
    })
  }
  handleFinish(e){
    // console.log("handleFinish: ", this.state.checkFinish, this.state.checkFinishDefault)
    if (this.state.checkFinish) {
      const user = AuthService.getCurrentUser();
      let body = {};
      body['userId'] = user.userId;
      body['address'] = this.state.street;
      body['phone'] = this.state.phone;
      body['name'] = this.state.userName;
      body['provinceId'] = this.state.provincesId;
      body['districtId'] = this.state.districtsId;
      body['wardId'] = this.state.wardsId;
      // console.log("updatePage")
      put(`userDetails/${this.props.userDetail.userDetailId}`, body)
          .then(res => {
                if (res && res.status === 201) {
                  this.setState({
                    message: `Cập nhật địa chỉ mới thành công`,
                    type: 'success',
                    isShow: true,
                  });
                }
                // console.log(res);
              },
              err => {
                err.response && this.setState({
                  message: `Cập nhật địa chỉ mới thất bại`,
                  type: 'danger',
                });
              });
      // console.log("gần hết finish")
    }
    if (this.state.checkFinishDefault)  this.updateAddressDefault()
    this.props.handleCloseModalAddressUpdate(this.state.checkFinish, this.state.checkFinishDefault);
  }
  updateAddressDefault(){
    // console.log("updateAddressDefault")
    const user = AuthService.getCurrentUser();
    let body = {};
    body['userDetailIdDefault'] = this.props.userDetail.userDetailId;
    put(`users/${user.userId}`, body)
        .then(res => {
              if (res && res.status === 202)
                this.setState({
                  message: `Cập nhật địa chỉ mặc định thành công!`,
                  type: 'success'
                });
              // console.log(res);
            },
            err => {
              err.response && this.setState({

                message: `Cập nhật địa chỉ mặc định thất bại`,
                type: 'danger',
              });
            })
  }
  handleClickChecked (e){
    e.preventDefault();
    if (this.props.updateCheckedUserDetail === this.props.userDetail.userDetailId){
      this.setState({
        message: `Hãy chọn địa chỉ mặc định khác!`,
        type: 'success',
        show: true,
      });
      // console.log(this.state.message)
    }
    else
    this.setState({
      checked: !this.state.checked,
      checkFinishDefault: true
    })
  }
  render() {
    return (
        <form>
          <div className="block">
            <Message isShow={this.state.isShow} type={this.state.type} message={this.state.message} key={this.state.message}/>
            {this.state.hadUpdate &&
            <div className="panel-header">
              <span className="panel-title">CẬP NHẬP ĐỊA CHỈ</span>
            </div>}
            {this.state.hadUpdate ?
                <div className="block-body">
                  <div className="row">
                    <div className="form-group col-md-6">
                      <label className="form-label" htmlFor="name_add"/>
                      <input className="form-control" type="text" name="name_add"
                             placeholder="Họ và tên" value={this.state.userName}
                             onChange={(e) => this.handleOnChangeName(e)}
                             id="name_add"/>
                    </div>
                    <div className="form-group col-md-6">
                      <label className="form-label" htmlFor="phonenumber_add"></label>
                      <input className="form-control" type="text"
                             name="phonenumber_add" value={this.state.phone}
                             onChange={(e) => this.handleOnChangePhone(e)}
                             placeholder="Số điện thoại" id="phonenumber_add"/>
                    </div>
                    <div className="form-group col-md-6">
                      <label className="form-label" htmlFor="provinces_add"></label>
                      <select className='form-select' id='provinces_add' name='provinces_add'
                              onChange={(e) => this.handleOnChangeProvinces(e)}>
                        <option value="">{this.state.provincesName}</option>
                        {this.state.provinces.length !== 0 && this.state.provinces.map((value, index) => (
                            <option value={index}>{value.provincesName}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group col-md-6">
                      <label className="form-label" htmlFor="districts_add"></label>
                      <select className='form-select' id='districts_add' name='districts_add'
                              onChange={(e) => this.handleOnChangeDistricts(e)}
                              validations={[required]}>
                        <option value="">{this.state.districtsName}</option>
                        {this.state.districts.length !== 0 && this.state.districts.map((value, index) => (
                            <option value={index}>{value.districtsName}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group col-md-12">
                      <label className="form-label" htmlFor="wards_add"></label>
                      <select className='form-select' id='wards_add' name='wards_add'
                              onChange={(e) => this.handleOnChangeWards(e)}
                              validations={[required]}>
                        <option value="">{this.state.wardsName}</option>
                        {this.state.wards.length !== 0 && this.state.wards.map((value, index) => (
                            <option value={index}>{value.wardsName}</option>))}
                      </select>
                    </div>
                    <div className="form-group col-md-12">
                      <label className="form-label" htmlFor="street_add"></label>
                      <input className="form-control" type="text"
                             name="street_add" value={this.state.street} readOnly={this.state.readOnlyStreet}
                             onChange={(e) => this.handleOnChangeStreet(e)}
                             placeholder="Địa chỉ cụ thể" id="street_add" validations={[required]}/>
                    </div>
                    <div className="address mt-2" style={{ display: 'flex', alignItems: 'center', marginLeft: "-10px"}}>
                      <button
                          className={`round-button ${this.state.checked ? 'clicked' : ''} col-md-6`}
                          onClick={(e) => this.handleClickChecked(e)}
                          style={{ flex: '0 0 auto' }}>
                        <div className="inner-circle"></div>
                      </button>
                      <div className="address-label col-md-6" style={{ flex: '1 1 auto' }}>Địa chỉ mặc định</div>
                    </div>
                  </div>
                </div> : <div></div>}
          </div>
          <div className="ms-4">
            <button className="white-button me-3" onClick={() => this.props.handleCloseModalAddressUpdate(false, false)}>
              <i className="fa fa-angle-left me-2"></i>Quay lại
            </button>
            <button className={`${(this.state.checkFinish || this.state.checkFinishDefault) ? 'viewed-button' : 'gray-button'}`} disabled={(!this.state.checkFinish && !this.state.checkFinishDefault)}
                    onClick={() => this.handleFinish()}>Hoàn thành
              <i className="fa fa-angle-right ms-2"></i>
            </button>
          </div>
        </form>
    )
  }
}
