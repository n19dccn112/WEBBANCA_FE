import React, {Component} from 'react'
import AuthService from "../../services/AuthService";
import Message from "../../util/Message";
import {isMatch, password, required} from "../../util/constrain";

import Form from 'react-validation/build/form';
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import Button from "react-validation/build/button";
import Avatar from './Avatar';
import {put} from "../../api/callAPI";
import CartService from "../../services/CartService";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldpass: '',
      newpass: '',
      newpass2: '',
      type: 'success',
      isShow: false,
      message: '',
      username: AuthService.getCurrentUser().username,
      name: '',
      email: '',
      checkFinish: false
    }
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.oldpass !== this.state.oldpass || this.state.newpass !== prevState.newpass || this.state.newpass2 !== prevState.newpass2){
      if (this.state.oldpass !== '' && this.state.newpass !== '' && this.state.newpass2 !== '') {
        if (this.state.newpass.length < 6 || this.state.newpass.length > 40 ||
            this.state.newpass2.length < 6 || this.state.newpass2.length > 40) {
          this.setState({
            message: "Mật khẩu từ 6 đến 40 ký tự",
            isShow: true
          });
        }else this.setState({checkFinish: true})
      }else {
        this.setState({checkFinish: false})
      }
    }
  }

  onChangeOldPass(e) {
    this.setState({
      oldpass: e.target.value
    });
  }
  onChangeNewPass(e) {
    this.setState({
      newpass: e.target.value
    });
  }
  onChangeNewPass2(e) {
    this.setState({
      newpass2: e.target.value
    });
  }
  handleChangePass(e) {
    e.preventDefault()
    this.setState({
      message: "",
      isShow: false
    });
    if (this.state.newpass !== this.state.newpass2){
      this.setState({
        message: "Mật khẩu không khớp",
        isShow: true
      });
      return
    }
    if (this.state.newpass === this.state.oldpass){
      this.setState({
        message: "Mật khẩu cũ",
        isShow: true
      });
      return
    }
      AuthService.changePass(
          this.state.username,
          this.state.oldpass,
          this.state.newpass,
      ).then(
          response => {
            console.log(response.message);
            this.setState({
              message: response.message,
              isShow: true,
              type: 'success',
            });
          },
          error => {
            this.setState({
              isShow: true,
              type: 'danger',
              message: 'Password sai'
            });
          }
      );
  }
  render() {
    return (
        <>
          <section className="hero">
            <div className="container">

              <div className="hero-content pb-5 text-center">
                <h1 className="hero-heading">Thông tin của bạn</h1>
                <div className="row">
                  <div className="col-xl-8 offset-xl-2"><p className="lead text-muted">
                    Chào mừng bạn tới tham quan cửa hàng của chúng tôi</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section>
            <div className="container">
              <div className="row">
                <div className="col-lg-8 col-xl-9">
                  <div className="block mb-5">
                    <div className="block-header"><strong className="text-uppercase">Thay đổi mật khẩu
                    </strong></div>
                    <div className="block-body">
                      <Form onSubmit={(e) => this.handleChangePass(e)} ref={c => {
                        this.form = c;
                      }}>
                        <div className="row">
                          <div className="col-sm-6">
                            <div className="mb-4">
                              <label className="form-label" htmlFor="password_old">Mật khẩu cũ</label>
                              <Input className="form-control" id="password_old" type="password" name="password_old"
                                     value={this.state.oldpass} onChange={(e) => this.onChangeOldPass(e)} validations={[required, password]}/>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-sm-6">
                            <div className="mb-4">
                              <label className="form-label" htmlFor="password_1">New
                                password</label>
                              <Input className="form-control" id="password_1" type="password" name="password"
                                     value={this.state.newpass} onChange={(e) => this.onChangeNewPass(e)} validations={[required, password, isMatch]}/>
                            </div>
                          </div>
                          <div className="col-sm-6">
                            <div className="mb-4">
                              <label className="form-label" htmlFor="password_2">Retype new
                                password</label>
                              <Input className="form-control" id="password_2" type="password" name="confirm" value={this.state.newpass2}
                                     onChange={(e) => this.onChangeNewPass2(e)} validations={[required, password, isMatch]}/>
                            </div>
                          </div>
                        </div>
                        <div className="text-center mt-4">
                          <button className={`${this.state.checkFinish ? 'viewed-button' : 'gray-button'}`} disabled={!this.state.checkFinish}
                                  type="submit"><i className="far fa-save me-2"></i>Thay đổi mật khẩu
                          </button>
                        </div>
                        {this.state.isShow &&
                            <Message isShow={this.state.isShow} type={this.state.type} message={this.state.message} key={this.state.message}/>}
                        <CheckButton style={{display: "none"}} ref={c => {this.checkBtn = c;}}/>
                      </Form>
                    </div>
                  </div>
                </div>
                <Avatar/>
              </div>
            </div>
          </section>
        </>
    )
  }
}
