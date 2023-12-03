import React, {Component} from 'react'
import {get} from "../../api/callAPI";

export default class Event extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventProducts: [],
    }
    this.label = {
      1: "badge-info-light",
      2: "badge-success-light",
      3: "badge-warning-light"
    }
  }

  componentDidMount() {
    get('eventProducts', {"eventId": this.props.id})
        .then(res => {
          if (res !== undefined) {
            if (res.status === 200) {
              this.setState({
                eventProducts: res.data
              });
            }
          }
        })
  }
  handleDate(dateStr){
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate
  }
  render() {
    return (
        <tr>
          <th className="py-4 align-middle"># {this.props.id}</th>
          <td className="py-4 align-middle">{this.props.name}</td>
          <td className="py-4 align-middle">{this.handleDate(this.props.startDate)}</td>
          <td className="py-4 align-middle">{this.handleDate(this.props.endDate)}</td>
          <td className="py-4 align-middle">
            <span className={`badge p-2 text-uppercase ${this.label[this.props.eventStatusId]}`}>
                 {this.props.eventStatusId === 1 ? 'SẮP DIỄN RA' : this.props.eventStatusId === 2 ? 'DIỄN RA' : `KẾT THÚC`}
            </span>
          </td>
          <td className="py-4 align-middle">
            <a className="edit-button" key={`'UpdateEvent'${this.props.id}}`}
               style={{marginLeft: "15px"}} href={`events/${this.props.id}`}>
              <i className="fas fa-pencil-alt"></i>
            </a>
            {Object.keys(this.state.eventProducts).length === 0 &&
                <a className="delete-button" style={{marginLeft: "20px", color: "black"}} key={`'DeleteEvent'${this.props.id}`}
                   onClick={(e) => this.props.deleteEvent(this.props.id)}>
                  <i className="fas fa-trash"></i>
                </a>}
          </td>
        </tr>
    )
  }
}
