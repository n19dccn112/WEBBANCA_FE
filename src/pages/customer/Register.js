import React, {Component} from 'react'
import {email, phone, required} from "../../util/constrain";
import AuthService from "../../services/AuthService";
import {get, post} from "../../api/callAPI";
import Message from "../../util/Message";

export default class ModalAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      username: '',
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
    }
  }
  componentDidMount(){
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
  componentDidUpdate( prevProps, prevState, snapshot) {
    if (prevState.street !== this.state.street ||
        prevState.username !== this.state.username ||
        prevState.phone !== this.state.phone ||
        prevState.password !== this.state.password){
      if (this.state.street !== '' && this.state.username !== '' && this.state.password !== '' &&
          this.state.phone !== '' && this.state.wardsId && this.state.districtsId && this.state.provincesId){
        if (this.state.username.length < 3){
          this.setState({
            message: `Tên từ 3 ký tự`,
            type: 'danger',
            isShow: true,
          });
        }else if (this.state.password.length < 6){
          this.setState({
            message: `Mật khẩu từ 6 ký tự`,
            type: 'danger',
            isShow: true,
          });
        } else if (this.state.phone.length !== 10){
          this.setState({
            message: `Số điện thoại chưa đúng`,
            type: 'danger',
            isShow: true,
          });
        }else {
          console.log("body", this.state.username, this.state.street, this.state.phone, this.state.password,
              this.state.wardsId, this.state.districtsId, this.state.provincesId)
          this.setState({
            checkFinish: true
          })
        }
      }
    }
    if (prevState.provincesId !== this.state.provincesId && this.state.provincesId !== 0 && this.state.provincesId !== undefined){
      get('districts', {"provincesId": this.state.provincesId})
          .then(res => {
            if (res !== undefined)
              if (res.status === 200) {
                this.setState({
                  districts: res.data
                });
              }
          });
    }
    if (prevState.districtsId !== this.state.districtsId && this.state.districtsId !== 0 && this.state.districtsId !== undefined){
      console.log("this.state.districtsId, prevState.districtsId: ", this.state.districtsId, prevState.districtsId)
      get('wards', {"districtsId": this.state.districtsId})
          .then(res => {
            if (res !== undefined)
              if (res.status === 200) {
                this.setState({
                  wards: res.data
                });
              }
          });
    }
    if (prevState.wardsId !== this.state.wardsId && this.state.wardsId !== 0 && this.state.wardsId !== undefined){
      this.setState({
        readOnlyStreet: false
      })
    }
  }
  handleOnChangeProvinces(e) {
    const selectedIndex = e.target.value;
    const selectedProvinces = this.state.provinces[selectedIndex];
    const provincesId = selectedProvinces.provincesId;
    const provincesName = selectedProvinces.provincesName;

    this.setState({
      provincesId: provincesId,
      provincesName: provincesName,
      districtsId: 0,
      wardsId: 0,
      districtsName: '',
      wardsName: '',
      districts: [],
      wards: [],
    })

    console.log("handleOnChangeProvinces: ", this.state.provincesId, this.state.provincesName)
  }
  handleOnChangeDistricts(e) {
    const selectedIndex = e.target.value;
    const selectedDistrict = this.state.districts[selectedIndex];
    const districtsId = selectedDistrict.districtsId;
    const districtsName = selectedDistrict.districtsName;

    this.setState({
      districtsId: districtsId,
      districtsName: districtsName,
      wardsId: 0,
      wardsName: '',
      wards: [],
    });
    console.log("handleOnChangeDistricts: ", this.statedistrictsId, districtsName);
  }
  handleOnChangeWards(e) {
    const selectedIndex = e.target.value;
    const selectedWard = this.state.wards[selectedIndex]
    const wardsId = selectedWard.wardsId;
    const wardsName = selectedWard.wardsName;

    console.log("handleOnChangeDistricts: ", selectedIndex, wardsId, wardsName);

    this.setState({
      wardsId: wardsId,
      wardsName: wardsName
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
        phone: e.target.value
      })
    }
  }
  handleOnChangeStreet(e) {
    if (e.target.value === ''){
      this.setState({
        message: `Địa chỉ không được để trống`,
        type: 'danger',
        isShow: true,
      });
    }
    this.setState({
      street: e.target.value
    })
  }
  handleOnChangeName(e){
    if (e.target.value === ''){
      this.setState({
        message: `Tên không được để trống`,
        type: 'danger',
        isShow: true,
      });
      this.setState({
        username: e.target.value
      })
    }else if (e.target.value.length > 20){
      this.setState({
        message: `Tên không quá 20 ký tự`,
        type: 'danger',
        isShow: true,
      });
    }else {
      this.setState({
        username: e.target.value
      })
    }
  }
  handleOnChangePassword(e){
    if (e.target.value === ''){
      this.setState({
        message: `Mật khẩu không được để trống`,
        type: 'danger',
        isShow: true,
      });
      this.setState({
        password: e.target.value
      })
    }else if (e.target.value.length > 20){
      this.setState({
        message: `Mâ khẩu không quá 40 ký tự`,
        type: 'danger',
        isShow: true,
      });
    }else {
      this.setState({
        password: e.target.value
      })
    }
  }
  handleFinish(e){
    e.preventDefault(); // Ngăn trang load lại sau khi submit form
    console.log("body", this.state.username, this.state.street, this.state.phone, this.state.password,
        this.state.wardsId, this.state.districtsId, this.state.provincesId)
    let body = {};
    body['username'] = this.state.username;
    body['address'] = this.state.street;
    body['phone'] = this.state.phone;
    body['password'] = this.state.password;
    body['wardId'] = this.state.wardsId;
    body['districtId'] = this.state.districtsId;
    body['provinceId'] = this.state.provincesId;
    console.log("body", body)

    post('auth/register', body)
        .then(res => {
              if (res && res.status === 201) {
                this.setState({
                  message: res.data.message,
                  type: 'success',
                  isShow: true,
                });
              }
              console.log(res);
            },
            err => {
              err.response && this.setState({
                message: "Thông tin chưa chính xác hoặc đã được đăng ký",
                type: 'danger',
              });
            });
  }
  render() {
    {
      return (
          <div className="modal fade quickview" id="modalRegister" tabIndex="-1" role="dialog" aria-hidden="true">
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <button className="close modal-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
                <div className="modal-body panel-background-whitesmoke">
                  <div className="address-panel panel-background-whitesmoke">
                    <form>
                      <div className="">
                        <img
                            src="https://tourneyx.com/app/lib/uploads/angler_uploads/22338_1600564048_9530a113c62ad9c0b5591a5920ace55a.jpg?d=1614829692"
                            width="70px" height="70px" alt="product"/>
                        <span className="register-header" style={{marginLeft: "270px", fontSize: "20px"}}>ĐĂNG KÝ</span>
                      </div>
                      <div className="block panel-header">
                        <Message isShow={this.state.isShow} type={this.state.type} message={this.state.message}
                                 key={this.state.message}/>
                        <div className="block-body">
                          <div className="row">
                            <div className="form-group col-md-6">
                              <label className="form-label" htmlFor="name_add"/>
                              <input className="form-control" type="text" name="name_add"
                                     placeholder="Họ và tên" value={this.state.username}
                                     onChange={(e) => this.handleOnChangeName(e)}
                                     id="name_add"/>
                            </div>
                            <div className="form-group col-md-6">
                              <label className="form-label" htmlFor="name_add"/>
                              <input className="form-control" type="password" name="name_add"
                                     placeholder="Họ và tên" value={this.state.password}
                                     onChange={(e) => this.handleOnChangePassword(e)}
                                     id="name_add"/>
                            </div>
                            <div className="form-group col-md-12">
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
                                <option value="">Tỉnh/Thành phố</option>
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
                                <option value="">Quận/Huyện</option>
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
                                <option value="">Phường/Xã</option>
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
                          </div>
                        </div>
                      </div>
                      <div className="ms-4 mt-2 ">
                        <button className={`${this.state.checkFinish ? 'viewed-button' : 'gray-button'}`}
                                disabled={!this.state.checkFinish}
                                style={{marginLeft: "300px"}} onClick={(e) => this.handleFinish(e)}>Hoàn thành
                          <i className="fa fa-angle-right ms-2"></i>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
      )
    }
  }
}
