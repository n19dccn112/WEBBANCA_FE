import React, {Component} from 'react'
import DatePicker from "react-datepicker";
import moment from "moment/moment";
import Message from "../../util/Message";
import Graph from "./Graph";

export default class ChartStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateFrom: new Date(),
      dateTo: new Date(),
      unit: '',
      dateFromOk: true,
      dateToOk: true,
      type: 'success',
      isShow: false,
      message: '',
      modal: <></>
      // date: moment(date).toDate(), tu api qua
    }
    // const date = moment(this.state.date).format('YYYY-MM-DD');
  }

  componentDidMount() {
    this.setState({unit: "Ngày"})
  }
  unitOnChange(e) {
    console.log("unit: ", e.target.value)
    this.setState({
      unit: e.target.value
    })
  }
  createBCDT(){
    if (this.state.unit === "Ngày"){
      if (this.state.dateFrom.getMonth() !== this.state.dateTo.getMonth()){
        this.setState({
          message: `Hãy chọn ngày trong cùng 1 tháng`,
          type: 'danger',
          isShow: true,
        });
        return
      }
    }
    else if (this.state.unit === "Tháng"){
      if (this.state.dateFrom.getFullYear() !== this.state.dateTo.getFullYear()){
        this.setState({
          message: `Hãy chọn tháng trong cùng 1 năm`,
          type: 'danger',
          isShow: true,
        });
        return
      }
    }
    this.setState({
      modal: <Graph closeModal={(e) => this.closeModal(e)} toDate={this.state.dateTo} fromDate={this.state.dateFrom} unit={this.state.unit}/>
    })
  }

  dateFromOnChange(date) {
    if (date >= new Date()){
      this.setState({
        message: `Chưa có báo cáo từ ngày ` + date,
        type: 'danger',
        isShow: true,
        dateFromOk: false
      });
    }
    else if (date === '') {
      this.setState({
        message: `Ngày không được trống`,
        type: 'danger',
        isShow: true,
        dateFromOk: false
      });
    }else {
      this.setState({
        dateFrom: date,
        dateFromOk: true
      })
    }
  }

  closeModal() {
    this.setState({modal: <></>})
  }

  dateToOnChange(date) {
    if (date > new Date()){
      this.setState({
        message: `Chưa có báo cáo đến ngày ` + date,
        type: 'danger',
        isShow: true,
        dateToOk: false
      });
    }
    else if (date === '') {
      this.setState({
        message: `Ngày không được trống`,
        type: 'danger',
        isShow: true,
        dateToOk: false
      });
    }else if (date < this.state.dateFrom){
      this.setState({
        message: `Ngày đến không nhỏ hơn ngày từ`,
        type: 'danger',
        isShow: true,
        dateToOk: false
      });
    }
    else {
      this.setState({
        dateTo: date,
        dateToOk: true
      })
    }
  }

  render() {
    return (
        <>
          <Message isShow={this.state.isShow} type={this.state.type} message={this.state.message} key={this.state.message}/>
          <div className="block-header mt-2 mb-2">
            <strong className="text-uppercase">Báo cáo doanh thu</strong>
          </div>
          <div className="row">
            <div className="col-sm-3">
              <div className="mb-4">
                <label className="form-label" htmlFor="productdate">
                  Từ <span style={{color: "red"}}>{!this.state.dateFromOk ? '*' : ''}</span>
                </label>
                <br/>
                <DatePicker
                    className="form-control"
                    name="productdate"
                    selected={this.state.dateFrom}
                    onChange={(date) => this.dateFromOnChange(date)}
                    id="productdate"/>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="mb-4">
                <label className="form-label" htmlFor="productdate">
                  Đến <span style={{color: "red"}}>{!this.state.dateToOk ? '*' : ''}</span>
                </label>
                <br/>
                <DatePicker
                    className="form-control"
                    name="productdate"
                    selected={this.state.dateTo}
                    onChange={(date) => this.dateToOnChange(date)}
                    id="productdate"/>
              </div>
            </div>
            <div className="col-sm-2">
              <div className="mb-4">
                <label className="form-label" htmlFor="unitbcdt">Đơn vị</label>
                <select className="form-control" name="unitbcdt" id="unitbcdt" value={this.state.unit}
                        onChange={(e) => this.unitOnChange(e)}>
                  <option value="Ngày">Ngày</option>
                  <option value="Tháng">Tháng</option>
                  <option value="Năm">Năm</option>
                </select>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="mt-3" style={{marginLeft: "20px"}}>
                <a className="add-button"
                   onClick={(e) => this.createBCDT()}
                   data-bs-toggle="modal"
                   data-bs-target="#modalGrapBCDT">
                  <i className="fa fa-expand-arrows-alt"></i> Tạo báo cáo
                </a>
              </div>
            </div>
          </div>
          {/*<Graph/>*/}
          {this.state.modal}
        </>
    )
  }
}