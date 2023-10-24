import React, {Component} from 'react'
import ModalCart from "../../pages/cart/ModalCart";
import ModalCategory from "../../pages/dashboard/ModalCategory";
import {get} from "../../api/callAPI";

export default class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryDetail: [],
    }
  }
  componentDidMount() {
    console.log("componentDidMount categories", this.props.id)
    get('categoryDetail', {"categoryId": this.props.id})
        .then(res => {
          if (res !== undefined) {
            if (res.status === 200) {
              console.log("res.data: categories", res.data)
              this.setState({
                categoryDetail: res.data
              });
            }
          }
        })
  }
  render() {
    return (
        <tr>
          <th className="py-4 align-middle"># {this.props.id}</th>
          <td className="py-4 align-middle">{this.props.name}</td>
          <td className="py-4 align-middle">{this.props.desc}</td>
          <td className="py-4 align-middle">
            <a className="edit-button" key={`'UpdateCategory'${this.props.id}}`}
                    style={{marginLeft: "15px"}} onClick={() => this.props.handleEditCategoryId(this.props.id)}>
              <i className="fas fa-pencil-alt"></i>
            </a>
            {Object.keys(this.state.categoryDetail).length === 0 &&
            <a className="delete-button" style={{marginLeft: "20px", color: "black"}} key={`'DeleteCategory'${this.props.id}`}
                    onClick={(e) => this.props.deleteCate(this.props.id)}>
              <i className="fas fa-trash"></i>
            </a>}
          </td>
        </tr>
    )
  }
}
