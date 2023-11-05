import React, {Component} from 'react';
import {BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import {get} from "../../api/callAPI";
import moment from "moment";

export default class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      day: [],
      month: [],
      year: [],
      to: '',
      from: ''
      // date: moment(date).toDate(), tu api qua
    }
    this.ngay31 = [0, 2, 4, 6, 7, 9, 11];
    this.ngay30 = [3, 5, 8, 10];
    this.ngay28 = [1];
    // const date = moment(this.state.date).format('YYYY-MM-DD');
  }
  date(data) {
    let dates = {}
    let dt = []
    Object.values(data).map((value, key) => {
      const day = moment(value.paymentDate).toDate().getDate()
      console.log("value: ", value, day, value.paymentAmount)
      if (value.paymentDate !== null) {
        for (let i = 1; i <= 30; i++) {
          console.log("day === i: ", typeof day, typeof i)
          if (dates[i] === undefined) dates[i] = 0
          if (day === i) {
            dates[i] = dates[i] + value.paymentAmount
            console.log("dates[i]", dates[i])
          }
        }
      }
    })
    setTimeout(() => {
      console.log("dates: ", dates)
      Object.values(dates).map((value, index) => {
        dt.push({ name: 'Ngày ' + Object.keys(dates)[index], sales: value})
      })
    }, 1000);
    setTimeout(() => this.setState({data: dt}), 1500)
  }
  month(data) {
    let months = {}
    let dt = []
    console.log("data: ", data)
    Object.values(data).map((value, key) => {
      const month = moment(value.paymentDate).toDate().getMonth();
      if (value.paymentDate !== null)
        for (let i=1; i<=12; i++) {
          if (months[i] === undefined) months[i] = 0
          if (month === i) months[i] = months[i] + value.paymentAmount
        }
    })
    setTimeout(() => {
      Object.values(months).map((value, index) => {
        dt.push({ name: 'Tháng ' + Object.keys(months)[index], sales: value})
      })
    }, 500);
    setTimeout(() => this.setState({data: dt}), 1000)
    setTimeout(() => console.log("tháng: ", dt), 1000)
  }
  year(data) {
    let years = {}
    let dt = []
    Object.values(data).map((value, key) => {
      if (value.paymentDate !== null) {
        const year = moment(value.paymentDate).toDate().getFullYear();
        console.log("năm, full: ", year, value.paymentDate)
        if (years[year.toString()] === undefined) years[year.toString()] = 0
        years[year.toString()] = years[year.toString()] + value.paymentAmount
      }
    })
    setTimeout(() => {
      Object.values(years).map((value, index) => {
        dt.push({ name: 'Năm ' + Object.keys(years)[index], sales: value})
      })
    }, 500);
    setTimeout(() => this.setState({data: dt}), 1000)
  }
  dateStatus(data) {
    let CHO_XAC_NHAN = {}
    let CHO_LAY_HANG = {}
    let CHO_GIAO_HANG = {}
    let DA_GIAO = {}
    let DA_HUY = {}

    let dt = []
    Object.values(data).map((value, key) => {
      const day = moment(value.orderTimeStart).toDate().getDate()
      if (value.orderTimeStart !== null) {
        for (let i = 1; i <= 30; i++) {
          if (CHO_XAC_NHAN[i] === undefined)    CHO_XAC_NHAN[i] = 0
          if (CHO_LAY_HANG[i] === undefined)    CHO_LAY_HANG[i] = 0
          if (CHO_GIAO_HANG[i] === undefined)   CHO_GIAO_HANG[i] = 0
          if (DA_GIAO[i] === undefined)         DA_GIAO[i] = 0
          if (DA_HUY[i] === undefined)          DA_HUY[i] = 0

          if (day === i) {
            if (value.orderStatusId === 1)           CHO_XAC_NHAN[i] = CHO_XAC_NHAN[i] + 1
            else if (value.orderStatusId === 2)      CHO_LAY_HANG[i] = CHO_LAY_HANG[i] + 1
            else if (value.orderStatusId === 3)      CHO_GIAO_HANG[i] = CHO_GIAO_HANG[i] + 1
            else if (value.orderStatusId === 4)      DA_GIAO[i] = DA_GIAO[i] + 1
            else if (value.orderStatusId === 5)      DA_HUY[i] = DA_HUY[i] + 1
          }
        }
      }
    })
    setTimeout(() => {
      Object.values(CHO_XAC_NHAN).map((CXN, index) => {
        let key = Object.keys(CHO_XAC_NHAN)[index]
        dt.push({ name: 'Ngày ' + key,
                  CHO_XAC_NHAN: CXN,
                  CHO_LAY_HANG: CHO_LAY_HANG[key],
                  CHO_GIAO_HANG: CHO_GIAO_HANG[key],
                  DA_GIAO: DA_GIAO[key],
                  DA_HUY: DA_HUY[key]})
      })
    }, 1000);
    setTimeout(() => this.setState({data: dt}), 1500)
  }
  monthStatus(data) {
    let CHO_XAC_NHAN = {}
    let CHO_LAY_HANG = {}
    let CHO_GIAO_HANG = {}
    let DA_GIAO = {}
    let DA_HUY = {}

    let dt = []

    Object.values(data).map((value, index) => {
      const month = moment(value.paymentDate).toDate().getMonth();
      if (value.paymentDate !== null)
        for (let i=1; i<=12; i++) {
          if (CHO_XAC_NHAN[i] === undefined)    CHO_XAC_NHAN[i] = 0
          if (CHO_LAY_HANG[i] === undefined)    CHO_LAY_HANG[i] = 0
          if (CHO_GIAO_HANG[i] === undefined)   CHO_GIAO_HANG[i] = 0
          if (DA_GIAO[i] === undefined)         DA_GIAO[i] = 0
          if (DA_HUY[i] === undefined)          DA_HUY[i] = 0

          if (month === i) {
            if (value.orderStatusId === 1)           CHO_XAC_NHAN[i] = CHO_XAC_NHAN[i] + 1
            else if (value.orderStatusId === 2)      CHO_LAY_HANG[i] = CHO_LAY_HANG[i] + 1
            else if (value.orderStatusId === 3)      CHO_GIAO_HANG[i] = CHO_GIAO_HANG[i] + 1
            else if (value.orderStatusId === 4)      DA_GIAO[i] = DA_GIAO[i] + 1
            else if (value.orderStatusId === 5)      DA_HUY[i] = DA_HUY[i] + 1
          }
        }
    })
    setTimeout(() => {
      Object.values(CHO_XAC_NHAN).map((CXN, index) => {
        let key = Object.keys(CHO_XAC_NHAN)[index]
        dt.push({ name: 'Tháng ' + key,
          CHO_XAC_NHAN: CXN,
          CHO_LAY_HANG: CHO_LAY_HANG[key],
          CHO_GIAO_HANG: CHO_GIAO_HANG[key],
          DA_GIAO: DA_GIAO[key],
          DA_HUY: DA_HUY[key]})
      })
    }, 1000);
    setTimeout(() => this.setState({data: dt}), 1500)
  }
  yearStatus(data) {
    let CHO_XAC_NHAN = {}
    let CHO_LAY_HANG = {}
    let CHO_GIAO_HANG = {}
    let DA_GIAO = {}
    let DA_HUY = {}
    let dt = []
    Object.values(data).map((value, key) => {
      if (value.paymentDate !== null) {
        const year = moment(value.paymentDate).toDate().getFullYear();
        if (CHO_XAC_NHAN[year.toString()] === undefined)    CHO_XAC_NHAN[year.toString()] = 0
        if (CHO_LAY_HANG[year.toString()] === undefined)    CHO_LAY_HANG[year.toString()] = 0
        if (CHO_GIAO_HANG[year.toString()] === undefined)   CHO_GIAO_HANG[year.toString()] = 0
        if (DA_GIAO[year.toString()] === undefined)         DA_GIAO[year.toString()] = 0
        if (DA_HUY[year.toString()] === undefined)          DA_HUY[year.toString()] = 0

        if (value.orderStatusId === 1)           CHO_XAC_NHAN[year.toString()] = CHO_XAC_NHAN[year.toString()] + 1
        else if (value.orderStatusId === 2)      CHO_LAY_HANG[year.toString()] = CHO_LAY_HANG[year.toString()] + 1
        else if (value.orderStatusId === 3)      CHO_GIAO_HANG[year.toString()] = CHO_GIAO_HANG[year.toString()] + 1
        else if (value.orderStatusId === 4)      DA_GIAO[year.toString()] = DA_GIAO[year.toString()] + 1
        else if (value.orderStatusId === 5)      DA_HUY[year.toString()] = DA_HUY[year.toString()] + 1
      }
    })
    setTimeout(() => {
      Object.values(CHO_XAC_NHAN).map((CXN, index) => {
        let key = Object.keys(CHO_XAC_NHAN)[index]
        dt.push({ name: 'Ngày ' + key,
          CHO_XAC_NHAN: CXN,
          CHO_LAY_HANG: CHO_LAY_HANG[key],
          CHO_GIAO_HANG: CHO_GIAO_HANG[key],
          DA_GIAO: DA_GIAO[key],
          DA_HUY: DA_HUY[key]})
      })
    }, 1000);
    setTimeout(() => this.setState({data: dt}), 1500)
  }
  beginNgay(){
    this.setState({
      to: moment(this.props.toDate).format('YYYY-MM-DD'),
      from: moment(this.props.fromDate).format('YYYY-MM-DD')
    })
  }
  begin(isThang){
    console.log("this.props.toDate, this.props.fromDate: ", this.props.toDate, this.props.fromDate)
    let dateFrom = moment(this.props.fromDate, 'YYYY-MM-DD');
    let dateTo = moment(this.props.toDate, 'YYYY-MM-DD');
    let soNgayFrom;

    if (this.ngay31.includes(dateTo.month())) soNgayFrom = 31;
    else if (this.ngay30.includes(dateTo.month())) soNgayFrom = 30;
    else if (this.ngay28.includes(dateTo.month())) soNgayFrom = 28;

    if (isThang)
      this.setState({
        to: dateTo.date(soNgayFrom).format('YYYY-MM-DD'),
        from: dateFrom.date(1).format('YYYY-MM-DD')
      })
    else
      this.setState({
        from: dateFrom.month(0).date(1).format('YYYY-MM-DD'),
        to: dateTo.month(11).date(soNgayFrom).format('YYYY-MM-DD')
      })
  }
  beginThang(){
    this.begin(true)
  }
  beginNam(){
    this.begin(false)
  }
  componentDidMount() {
    if (this.props.unit === "Ngày") this.beginNgay()
    else if (this.props.unit === "Tháng") this.beginThang()
    else if (this.props.unit === "Năm") this.beginNam()

    setTimeout(() =>get('orders/bcdt', {"dateTo": this.state.to, "dateFrom": this.state.from})
        .then(res => {
          if (res !== undefined)
            if (res.status === 200) {
              setTimeout(() => {
                if (!this.props.isStatus){
                  if (this.props.unit === "Ngày") this.date(res.data)
                  else if (this.props.unit === "Tháng") this.month(res.data)
                  else if (this.props.unit === "Năm") this.year(res.data)
                }
                else {
                  if (this.props.unit === "Ngày") this.dateStatus(res.data)
                  else if (this.props.unit === "Tháng") this.monthStatus(res.data)
                  else if (this.props.unit === "Năm") this.yearStatus(res.data)
                }
              })
            }
        }), 1000)
  }
  render() {
    return (
        <div className="modal fade quickview" id="modalGrapBCDT" tabIndex="-1" role="dialog" aria-hidden="true">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <button className="close modal-close" type="button" data-bs-dismiss="modal" aria-label="Close"
              onClick={(e) => (this.props.closeModal(e))}/>
                    {this.state.data !== [] && this.props.isStatus &&
                        <div className="modal-body body-background-white">
                          <div className="panel-header1">
                            <span className="title-small" style={{fontSize: "20px"}}>Báo cáo trạng thái</span>
                          </div>
                          <div>
                            <BarChart width={700} height={300} data={this.state.data}>
                              <XAxis dataKey="name" />
                              <YAxis />
                              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                              <Bar dataKey="CHO_XAC_NHAN" stackId="status" fill="#0d6efd" />
                              <Bar dataKey="CHO_LAY_HANG" stackId="status" fill="#d63384" />
                              <Bar dataKey="CHO_GIAO_HANG" stackId="status" fill="#ffc107" />
                              <Bar dataKey="DA_GIAO" stackId="status" fill="#343a40" />
                              <Bar dataKey="DA_HUY" stackId="status" fill="#dc3545" />
                              <Tooltip />
                              <Legend />
                            </BarChart>
                          </div>
                        </div>
                    }
                    {this.state.data !== [] && !this.props.isStatus &&
                        <div className="modal-body body-background-white">
                          <div className="panel-header1">
                            <span className="title-small" style={{fontSize: "20px"}}>Báo cáo doanh thu</span>
                          </div>
                          <div>
                            <LineChart width={700} height={300} data={this.state.data}>
                              <XAxis dataKey="name" />
                              <YAxis />
                              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                              <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                              <Tooltip />
                              <Legend />
                            </LineChart>
                          </div>
                        </div>
                    }
            </div>
          </div>
        </div>
    );
  }
}
