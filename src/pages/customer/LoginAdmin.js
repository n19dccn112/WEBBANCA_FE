import React, {Component} from 'react'
import Login from './Login'
import Register from './Register'
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import {password, required, username} from "../../util/constrain";
import Button from "react-validation/build/button";
import Message from "../../util/Message";
import CheckButton from "react-validation/build/button";
import AuthService from "../../services/AuthService";

export default class LoginAdmin extends Component {
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
      AuthService.loginAdmin(this.state.username, this.state.password).then(
          res => {
            if (res === null) {
              this.setState({
                isShow: true,
                type: 'danger',
                message: 'Thông tin đăng nhập của bạn không chính xác'
              });
            }
            else if (res) {
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

  render() {
    return (
        <>
          <section className="hero">
            <div className="">
              <div className="hero-content pb-5 text-center">
                <h1 className="hero-heading mb-0">Khu vực Quản trị viên</h1>
              </div>
            </div>
          </section>
          <section>
            <div className="container1">
              <img
                  src="https://www.shutterstock.com/image-photo/plasticine-webwords-isolated-on-white-260nw-122085937.jpg"
                  width="500px" height="250px" alt="product" style={{marginRight: "0px", marginLeft: "50px"}}/>
              <div style={{marginRight: "0px", marginLeft: "0px"}}>
                <div className="col-lg-10">
                  <div className="block">
                    <div className="block-header">
                      <h6 className="text-uppercase mb-0">Đăng nhập</h6>
                    </div>
                    <div className="block-body">
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
                        {this.state.isShow && <Message isShow={this.state.isShow} type={this.state.type}
                                                       message={this.state.message} key={this.state.message}/>}
                        <div className="mb-4 text-center">
                          <Button className="btn btn-outline-dark" type="submit"><i
                              className="fa fa-sign-in-alt me-2"></i> Đăng nhập</Button>
                        </div>
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
              </div>
            </div>
          </section>
          {this.state.modalComponent}
        </>
    )
  }
}
