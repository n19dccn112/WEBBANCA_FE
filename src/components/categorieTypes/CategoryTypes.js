import React, {Component} from 'react'
import ModalCart from "../../pages/cart/ModalCart";
import ModalCategory from "../../pages/dashboard/ModalCategory";
import {get} from "../../api/callAPI";

export default class CategoryTypes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
    }
  }
  componentDidMount() {
    console.log("componentDidMount categories", this.props.id)
    get('categories', {"categoryTypeId": this.props.id})
        .then(res => {
          if (res !== undefined) {
            if (res.status === 200) {
              console.log("res.data: categories", res.data)
              this.setState({
                categories: res.data
              });
            }
          }
        })
  }
  render() {
    if (this.props.select)
      return (<option value={this.props.id}>{this.props.name}</option>)

    if (this.props.isTable)
      return (
          <tr>
            <th className="py-4 align-middle"># {this.props.id}</th>
            <td className="py-4 align-middle">{this.props.name}</td>
            <td className="py-4 align-middle">{this.props.desc}</td>
            <td className="py-4 align-middle">
              <button className="category-seen-button" data-bs-toggle="modal"
                      data-bs-target="#modalCategory"
                      onClick={() => this.props.handleModalComponent(this.props.id)}>
                Loại {this.props.name} <i className="fa fa-list-ol me-1"></i>
              </button>
            </td>
            <td className="py-4 align-middle">
              <a className="edit-button" key={`'UpdateCategoryTypes'${this.props.id}}`}
                      style={{marginLeft: "15px"}} href={`categoryTypes/${this.props.id}`}>
                  <i className="fas fa-pencil-alt"></i></a>
              {Object.keys(this.state.categories).length === 0 &&
              <a className="delete-button" style={{marginLeft: "20px", color: "black"}} key={`'DeleteCategoryTypes'${this.props.id}`}
                      onClick={(e) => this.props.deleteCate(this.props.id)}>
                <i className="fas fa-trash"></i>
              </a>}
            </td>
          </tr>
      )
    else
      return (
          <div className="sidebar-menu-item mb-2" role="menuitem">
            <a className="nav-link" onClick={(e) => this.props.filterByCate(this.props.id)}>
            <span>{this.props.name}</span>{this.props.amount > 0 ?
              <span className="sidebar-badge ms-2">{this.props.amount}</span> : ''}</a>
          </div>
      )
  }
}
