import React, {Component} from 'react'

import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Button from 'react-validation/build/button';
import CheckButton from 'react-validation/build/button';
import TextArea from 'react-validation/build/textarea';

import {get, post, put} from '../../api/callAPI';
import {withRouter} from 'react-router-dom';
import Message from '../../util/Message';
import {required,} from "../../util/constrain";

class ModalAddOrEditFeature extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      key: 0,
      name: '',
      descript: '',
      type: 'success',
      isShow: false,
      message: '',
    }
  }
  componentDidMount() {
    console.log(this.props.id);
    if (this.props.id) {
      get(`features/${this.props.id}`)
          .then(res => {
            if (res !== undefined)
              console.log("features: ", res.data)
            if (res.status === 200)
              this.setState({
                specific: res.data.specific,
              });
          });
      this.setState({
        id: this.props.id,
      })
    }
  }
  idOnChange(e) {
    this.setState({
      id: this.state.id,
    })
  }
  nameOnChange(e) {
    this.setState({
      specific: e.target.value,
    })
  }
  async doCreate(e) {
    e.preventDefault();
    this.form.validateAll();
    if (this.checkBtn.context._errors.length === 0) {
      let params = {};
      params['specific'] = this.state.specific;
      params['featureTypeId'] = this.props.featureTypeId;
      console.log(params);
      if (this.props.id) {
        put(`features/${this.props.id}`, params)
            .then(res => {
                  if (res && res.status === 202)
                    this.setState({
                      message: `Cập nhập tính năng thành công!`,
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
        post(`features`, params)
            .then(res => {
                  if (res && res.status === 201)
                    this.setState({
                      message: `Tạo tính năng ${res.data.featureName} thành công!`,
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
  }
  render() {
    return (
        <div className="modal-body body-background-light">
          <div className="panel-header1">
            <strong className="text-uppercase title-small">{this.props.id ? 'Sửa' : 'Thêm'} tính năng</strong>
          </div>
          <Message isShow={this.state.isShow} type={this.state.type} message={this.state.message}
                   key={this.state.message}/>
          <div className="block-body">
            <Form onSubmit={(e) => this.doCreate(e)} ref={c => {this.form = c;}}>
              <div className="row body-background-white">
                {this.props.id !== 0 && (<div className="col-sm-12">
                  <div className="mb-4">
                    <label className="form-label" htmlFor="featureid">Id</label>
                    <input className="form-control" name="featureid" id="featureid" value={this.state.id}
                           onChange={(e) => this.idOnChange(e)}
                           type="text" readOnly={true}/>
                  </div>
                </div>)}
              </div>
              <div className="row body-background-white">
                <div className="col-sm-12">
                  <div className="mb-4">
                    <label className="form-label" htmlFor="featurename">Tên</label>
                    <input className="form-control" name="featurename" id="featurename" value={this.state.specific}
                           onChange={(e) => this.nameOnChange(e)} type="text"/>
                  </div>
                </div>
              </div>
              <div className="text-center mt-3">
                <button className="white-button me-3" onClick={() => this.props.handleNotEdit()}>
                  <i className="fa fa-angle-left me-2"></i>Quay lại
                </button>
                <button className="viewed-button" type="submit" >Lưu
                  <i className="far fa-save ms-2"></i>
                </button>
              </div>
              <CheckButton style={{display: "none"}} ref={c => {this.checkBtn = c;}}
              />
            </Form>
          </div>
        </div>
    )
  }
}

export default withRouter(ModalAddOrEditFeature);
