import React, {Component} from "react";
import AuthService from "../../services/AuthService";
import Message from "../../util/Message";
import {password, required, username} from "../../util/constrain";

import Form from 'react-validation/build/form';
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import Button from "react-validation/build/button";
import {post} from "../../api/callAPI";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.state = {
      username: "",
      password: "",
      isShow: false,
      message: ""
    };
  }
  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    });
  }
  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }
  handleLogin(e) {
    e.preventDefault();
    this.setState({
      message: "",
      isShow: false
    });
    this.form.validateAll();
    if (this.checkBtn.context._errors.length === 0) {
      AuthService.login(this.state.username, this.state.password).then(
          res => {
            if (res) {
              this.setState({
                isShow: true,
                type: 'success',
                message: 'đăng nhập thành công: ' + res.role + ': ' + res.userId
              });
              if (res.role === "ROLE_SHOP")
                window.location.href = '/dashboard/categoryType';
              else
                window.location.href = '/profile';
            }
          },
          error => {
            if (error.response.status === 401) {
              this.setState({
                isShow: true,
                type: 'danger',
                message: 'Thông tin đăng nhập của bạn không chính xác'
              });
            } else {
              const resMessage =
                  (error.response &&
                      error.response.data &&
                      error.response.data.error) ||
                  error.message ||
                  error.toString();

              this.setState({
                isShow: true,
                type: 'danger',
                message: resMessage
              });
            }
          }
      );
    }
  }

  handleFinish1(){
    let body = {};
    body['username'] = '321';
    body['address'] = '98'
    body['phone'] = '0987654321'
    body['password'] = '654321'
    body['wardId'] = 10
    body['districtId'] = 1
    body['provinceId'] = 10
    post('auth/register', body)
        .then(res => {
              if (res && res.status === 201) {
                this.setState({
                  message: `Đăng ký thành công`,
                  type: 'success',
                  isShow: true,
                });
              }
              console.log(res);
            },
            err => {
              err.response && this.setState({
                message: `${err.response.data.error} ${err.response.data.message}`,
                type: 'danger',
              });
            });
  }
  render() {
    return (
        <>
          <div className="col-lg-5">
            <div className="block">
              <div className="block-header">
                <h6 className="text-uppercase mb-0">Đăng nhập</h6>
              </div>
              <div className="block-body">
                {/*<button className="viewed-button"*/}
                {/*        style={{marginLeft: "300px"}} onClick={() => this.handleFinish1()}>Hoàn thành*/}
                {/*  <i className="fa fa-angle-right ms-2"></i>*/}
                {/*</button>*/}
                <hr/>
                <Form onSubmit={this.handleLogin}
                      ref={c => {
                        this.form = c;
                      }}>
                  <div className="mb-4">
                    <label className="form-label" htmlFor="username1">Tên đăng nhập</label>
                    <Input className="form-control" id="username1" type="text" name="username"
                           value={this.state.username}
                           onChange={this.onChangeUsername} validations={[required, username]}/>
                  </div>
                  <div className="mb-4">
                    <label className="form-label" htmlFor="password1">Mật khẩu</label>
                    <Input className="form-control" id="password1" type="password" name="password"
                           value={this.state.password}
                           onChange={this.onChangePassword}
                           validations={[required, password]}/>
                  </div>
                  <div className="mb-4 text-center">
                    <Button className="btn btn-outline-dark" type="submit"><i
                        className="fa fa-sign-in-alt me-2"></i> Đăng nhập</Button>
                  </div>
                  {this.state.isShow && <Message isShow={this.state.isShow} type={this.state.type}
                                                 message={this.state.message} key={this.state.message}/>}
                  <CheckButton
                      style={{display: "none"}}
                      ref={c => {
                        this.checkBtn = c;
                      }}
                  />
                </Form>
              </div>
            </div>
          </div>


        </>
    );
  }
}
