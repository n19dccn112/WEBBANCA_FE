import React, {Component} from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import {get} from "../../api/callAPI";
import moment from "moment";

export default class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
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
              this.setState({
                orders: res.data
              });
              setTimeout(() => {
                if (this.props.unit === "Ngày") this.date(res.data)
                else if (this.props.unit === "Tháng") this.month(res.data)
                else if (this.props.unit === "Năm") this.year(res.data)
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
                  <div className="modal-body body-background-white">
                    <div className="panel-header1">
                      <span className="title-small" style={{fontSize: "20px"}}>Báo cáo doanh thu</span>
                    </div>
                    {this.state.data !== [] && <div>
                    {/*<Message isShow={this.state.isShow} type={this.state.type} message={this.state.message} key={this.state.message}/>*/}
                      <LineChart width={600} height={300} data={this.state.data}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                        <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                        <Tooltip />
                        <Legend />
                      </LineChart>
                    </div>
                    }

                  </div>
            </div>
          </div>
        </div>
    );
  }
}
