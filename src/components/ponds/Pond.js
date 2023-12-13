import React, {Component} from 'react'
import {get} from "../../api/callAPI";

export default class Pond extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pond: [],
      name: ''
    }
  }
  componentDidMount() {
    setTimeout(() => {
      // console.log("11111111 this.props.unitDetailId: ", this.props.unitDetailId)
      get(`unitDetail/${this.props.unitDetailId}`)
          .then(res1 => {
            if (res1 && res1.status === 200) {
              // console.log("2222222222 unitDetail: ", res1.data)
              get(`products/${res1.data.productId}`)
                  .then(res2 => {
                    if (res2 && res2.status === 200) {
                      let name = res2.data.productName
                      let size = res1.data.unitId === 1 ? 'S' : res1.data.unitId === 2 ? 'M' : 'L'
                      console.log("3333333333 product: ", name + " " + size)
                      setTimeout(() => {
                        this.setState({
                          name: name + " " + size,
                        })
                      }, 300)
                    }
                  })
            }
          })
    }, 500)
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
          <td className="py-4 align-middle">{this.state.name}</td>
          <td className="py-4 align-middle">{this.props.pondAmount}</td>
          <td className="py-4 align-middle">{this.handleDate(this.props.inputDate)}</td>
          <td className="py-4 align-middle">{this.props.standardPrice} vnđ</td>
          <td className="py-4 align-middle">{this.props.priceShip} vnđ</td>
          <td className="py-4 align-middle">
            <a className="edit-button" key={`'UpdatePond'${this.props.id}}`}
               style={{marginLeft: "15px"}} href={`ponds/${this.props.id}`}>
              <i className="fas fa-pencil-alt"></i></a>
            {this.state.pond.unitDetailId > 0 &&
                <a className="delete-button" style={{marginLeft: "20px", color: "black"}} key={`'DeleteUser'${this.props.id}`}
                   onClick={(e) => this.props.deletePond(this.props.id)}>
                  <i className="fas fa-trash"></i>
                </a>}
          </td>
        </tr>
    )
  }
}
