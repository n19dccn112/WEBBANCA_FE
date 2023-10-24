import React, {Component} from 'react'

import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Button from 'react-validation/build/button';
import CheckButton from 'react-validation/build/button';

import {get, post, put} from '../../api/callAPI';
import {withRouter} from 'react-router-dom';
import Message from '../../util/Message';
import {required,} from "../../util/constrain";

class FormFeature extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      key: 0,
      name: '',
      descript: '',
      unit: '',
      checked: false,
      type: 'success',
      isShow: false,
      message: '',
    }
  }
  componentDidMount() {
    console.log(this.props.match.params.id);
    if (this.props.match.params.id) {
      get(`featureTypes/${this.props.match.params.id}`)
          .then(res => {
            if (res !== undefined)
              console.log("featureType: ", res.data)
            if (res.status === 200)
              this.setState({
                name: res.data.featureTypeName,
                unit: res.data.featureTypeUnit,
                checked: res.data.isShow
              });
          });
      this.setState({
        id: this.props.match.params.id,
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
      name: e.target.value,
    })
  }
  unitOnChange(e) {
    this.setState({
      unit: e.target.value,
    })
  }
  async doCreate(e) {
    e.preventDefault();
    this.form.validateAll();
    if (this.checkBtn.context._errors.length === 0) {
      let params = {};
      params['featureTypeName'] = this.state.name;
      params['featureTypeUnit'] = this.state.unit;
      params['isShow'] = this.state.checked;
      console.log(params);
      if (this.props.match.params.id) {
        put(`featureTypes/${this.props.match.params.id}`, params)
            .then(res => {
                  if (res && res.status === 202)
                    this.setState({
                      message: `Cập nhập tính năng thành công!`,
                      type: 'success'
                    });
                  console.log(res.data);
                },
                err => {
                  err.response && this.setState({
                    message: `${err.response.data.error} ${err.response.data.message}`,
                    type: 'danger',
                  });
                })
      } else {
        post(`featureTypes`, params)
            .then(res => {
                  if (res && res.status === 201)
                    this.setState({
                      message: `Tạo tính năng thành công!`,
                      type: 'success'

                    });
                  console.log(res.data);
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
  handleCheck(){
    this.setState({
      checked: !this.state.checked
    })
  }
  render() {
    return (
        <><Message isShow={this.state.isShow} type={this.state.type} message={this.state.message}
                   key={this.state.message}/>
          <div className="block mb-5">
            <div className="block-header">
              <strong className="text-uppercase">{this.props.match.params.id ? 'Sửa' : 'Thêm'} tính năng</strong>
            </div>
            <div className="block-body">
              <Form onSubmit={(e) => this.doCreate(e)} ref={c => {this.form = c;}}>
                <div className="row">
                  {this.props.match.params.id && (<div className="col-sm-6">
                    <div className="mb-3">
                      <label className="form-label" htmlFor="cateid">Id</label>
                      <Input className="form-control" name="cateid" id="cateid" value={this.state.id} onChange={(e) => this.idOnChange(e)}
                             type="text" validations={[required]} readOnly={true}/>
                    </div>
                  </div>)}
                </div>
                <div className="row">
                  <div className="col">
                    <div className="mb-4">
                      <label className="form-label" htmlFor="catename">Tên</label>
                      <Input className="form-control" name="catename" id="catename" value={this.state.name}
                             onChange={(e) => this.nameOnChange(e)} type="text" validations={[required]}/>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="mb-4">
                      <label className="form-label" htmlFor="catename">Đơn vị</label>
                      <Input className="form-control" name="catename" id="catename" value={this.state.unit}
                             onChange={(e) => this.unitOnChange(e)} type="text" validations={[required]}/>
                    </div>
                  </div>
                  <div className="col-sm-2">
                    <div className="mb-4">
                      <label className="form-label text-center" htmlFor="checkBoxIsAnimal">Show</label>
                      <br/>
                      <input className=""
                             id="checkBox" type="checkbox"
                             checked={this.state.checked} onChange={() => this.handleCheck()}/>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-4">
                  <Button className="btn btn-outline-dark" type="submit"><i className="far fa-save me-2"></i>Lưu</Button>
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

export default withRouter(FormFeature);
