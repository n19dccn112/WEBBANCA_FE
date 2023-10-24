import React, {Component} from 'react'
import NumberFormat from 'react-number-format';
import axios from "axios";
import {get} from "../../../api/callAPI";

export default class RecommendItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: {}
    }
  }
  componentDidMount() {
    get(`products/${Number(this.props.productId)}`)
        .then(res => {
          if (res && res.status === 200) {
            this.setState({
              product: res.data
            })
          }
        },err => {
          err.response && this.setState({
            message: `${err.response.data.error} ${err.response.data.message}`,
            type: 'danger',
          });
        })
  }
  render() {
    return (
        <div className="col-lg-2 col-md-4 col-6">
          <div className="product">
            <div className="product-image">
              <img className="img-fluid" src={this.state.product.imageUrl && this.state.product.imageUrl[0]} alt="product"/>
              <div className="product-hover-overlay">
                <a className="product-hover-overlay-link" href={'/products/' + this.state.product.productId}></a>
                <div className="product-hover-overlay-buttons">
                  <a className="btn btn-dark btn-buy" href={'/products/' + this.state.product.productId}>
                    <i className="fa-search fa"></i><span className="btn-buy-label ms-2">Xem</span></a>
                </div>
              </div>
            </div>
            <div className="py-2">
              <p className="text-muted text-sm mb-1">{this.state.product.categoryName}</p>
              <p className="text-muted text-sm mb-1">Còn lại: {this.state.product.remain}</p>
              <h3 className="h6 text-uppercase mb-1">
                <a className="text-dark" href={'/products/' + this.state.product.id}>{this.state.product.name}</a>
              </h3>
              <span className="text-muted">
                <NumberFormat value={this.state.product.price} displayType={'text'} thousandSeparator={true} suffix=' vnđ'/>
              </span>
            </div>
          </div>
        </div>
    )
  }
}
