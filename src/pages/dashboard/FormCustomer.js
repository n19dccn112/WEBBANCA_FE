import React, {Component} from 'react'

import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Button from 'react-validation/build/button';
import CheckButton from 'react-validation/build/button';
import TextArea from 'react-validation/build/textarea';

import {get, post, put} from '../../api/callAPI';
import {withRouter} from 'react-router-dom';
import Message from '../../util/Message';
import {email, password, required, username} from "../../util/constrain";
import AuthService from "../../services/AuthService";

class FormCustomer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'success',
      isShow: false,
      message: '',
      id: 0,
      key: 0,
      username: '',
      password: '',
      rePassword: '',
      roleId: "",
      checkFinish: false,
      isCheckedRole: false
    }
    this.roles = ['Shop', 'User'];
  }
  componentDidMount() {
    if (this.props.match.params.id) {
      get(`users/${this.props.match.params.id}`)
          .then(res => {
            //console.log(res)
            if (res !== undefined)
                //console.log(res)
              if (res.status === 200)
                this.setState({
                  id: res.data.userId,
                  username: res.data.username,
                  password: res.data.password,
                  roleId: res.data.roleId,
                });
          });
      this.setState({
        id: this.props.match.params.id,
        checkFinish: true
      })
    }
  }
  componentDidUpdate( prevProps, prevState, snapshot) {
    if (prevState.username !== this.state.username ||
        prevState.password !== this.state.password ||
        prevState.rePassword !== this.state.rePassword ||
        prevState.isCheckedRole !== this.state.isCheckedRole){
      if (this.state.username !== '' && (this.state.password !== '' || this.props.match.params.id !== 0)){
        if (this.state.username.length < 3){
          this.setState({
            message: `Tên từ 3 ký tự`,
            type: 'danger',
            isShow: true,
            checkFinish: false
          });
        }else if (this.props.match.params.id === 0 && (this.state.password.length < 6 || this.state.rePassword.length < 6)){
          this.setState({
            message: `Mật khẩu từ 6 ký tự`,
            type: 'danger',
            isShow: true,
            checkFinish: false
          });
        }else if (this.state.isCheckedRole || this.props.match.params.id !== 0){
          console.log("body", this.state.username, this.state.password, this.state.rePassword, this.state.isCheckedRole)
          this.setState({
            checkFinish: true
          })
        }
      }
    }
  }
  nameOnChange(e) {
    this.setState({
      username: e.target.value,
    })
    console.log("username: ", e.target.value, this.state.username)
  }
  passOnChange(e) {
    this.setState({
      password: e.target.value,
    })
    console.log("password: ", e.target.value, this.state.password)
  }
  repassOnChange(e) {
      this.setState({
        rePassword: e.target.value,
      })
    console.log("rePassword: ", e.target.value, this.state.rePassword)
  }
  roleOnChange(e) {
    if (e.target.checked) {
      this.setState({
        isCheckedRole: true
      })
      this.roles.map((rl, index) =>
          (e.target.value === rl &&
              this.setState({
                roleId: index + 1
              })
          )
      )
      console.log("isCheckedRole: ", e.target.value, this.state.isCheckedRole)
    }
  }
  async doCreate(e) {
    e.preventDefault()
    this.setState({
      message: "",
      isShow: false
    });
    if (this.state.password !== this.state.rePassword){
      this.setState({
        message: "Mật khẩu không khớp",
        isShow: true
      });
      return
    }
    let params = {};
    params['username'] = this.state.username;
    params['roleId'] = this.state.roleId;
    params['password'] = this.state.password;
    console.log(params);
    if (this.props.match.params.id) {
      put(`users/${this.props.match.params.id}`, params)
          .then(res => {
                if (res && res.status === 202)
                  this.setState({
                    message: `Cập nhập user ${res.data.username} thành công!`,
                    type: 'success'
                  });
                console.log(res);
              },
              err => {
                err.response && this.setState({
                  message: `${err.response.data.error} ${err.response.data.message}`,
                  type: 'danger',
                });
              })
    } else {
      post(`users`, params)
          .then(res => {
                if (res && res.status === 201)
                  this.setState({
                    message: `Create user ${res.data.username} success!`,
                    type: 'success'
                  });
                console.log(res);
              },
              err => {
                err.response && this.setState({
                  message: `${err.response.data.error} ${err.response.data.message}`,
                  type: 'danger',
                });
              })
    }
    await this.setState({
      isShow: !this.setState.isShow,
    })
  }
  render() {
    return (
        <><Message isShow={this.state.isShow} type={this.state.type} message={this.state.message}
                   key={this.state.message}/>
          <div className="block mb-5">
            <div className="block-header">
              <strong className="text-uppercase">{this.props.match.params.id ? 'Sửa' : 'Thêm'} Khách hàng</strong></div>
            <div className="block-body">
              <Form onSubmit={(e) => this.doCreate(e)} ref={c => {this.form = c;}}>
                <div className="row">
                  {this.props.match.params.id && <div className="col-sm-6">
                    <div className="mb-4">
                      <label className="form-label" htmlFor="userid">Id</label>
                      <input className="form-control" name="userid" id="userid" value={this.state.id}
                             type="text" readOnly={true}/>
                    </div>
                  </div>
                  }
                  <div className="col-sm-6">
                    <div className="mb-4">
                      <label className="form-label" htmlFor="username">Username</label>
                      <input className="form-control" name="username" id="username" value={this.state.username}
                             onChange={(e) => this.nameOnChange(e)} type="text"/>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="mb-4">
                      <label className="form-label" htmlFor="password">Password</label>
                      <input className="form-control"
                             name="password" id="password" value={this.state.password} onChange={(e) => this.passOnChange(e)}
                             type="password"/>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mb-4">
                      <label className="form-label" htmlFor="repassword">Xác nhận mật khẩu</label>
                      <input
                          className="form-control"
                          name="repassword"
                          id="repassword"
                          value={this.state.rePassword}
                          onChange={(e) => this.repassOnChange(e)}
                          type="password"/>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="mb-4" value={this.state.role} onChange={(e) => this.roleOnChange(e)}>
                      <label className="form-label" htmlFor="role">Role</label>
                      <div className="row">
                        {
                          this.roles.map((rl, index) =>
                                  (this.state.roleId === (index + 1) ?
                                      <div key={index} className="col-sm-6">
                                        <input key={index} className="form-check-input me-2" name="role" id="role"
                                               defaultChecked value={rl} type="radio"/>
                                        <label className="form-check-label" htmlFor='role'>{rl}</label>
                                      </div> :
                                      <div key={index} className="col-sm-6">
                                        <input key={index} className="form-check-input me-2" name="role" id="role"
                                               value={rl} type="radio"/>
                                        <label className="form-check-label" htmlFor='role'>{rl}</label>
                                      </div>)
                          )
                        }
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <button className={`${this.state.checkFinish ? 'viewed-button' : 'gray-button'}`} disabled={!this.state.checkFinish}
                          type="submit">Lưu
                    <i className="far fa-save" style={{marginLeft: "5px"}}></i>
                  </button>
                </div>
                <CheckButton style={{display: "none"}} ref={c => {this.checkBtn = c;}}
                />
              </Form>
            </div>
          </div>
        </>
    )
  }
}

export default withRouter(FormCustomer);
