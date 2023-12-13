import React, {Component} from 'react'
import NumberFormat from 'react-number-format';
import axios from "axios";
import {get} from "../../../api/callAPI";

export default class RecommendItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imagesDetails: {},
      imgs: [],
      product: {},
      category: {}
    }
  }
  componentDidMount() {
    get('products/' + this.props.productId)
        .then(res => {
          if (res !== undefined)

            if (res.status === 200)
              this.setState({
                product: res.data
              });
        });
    get('imagesDetail', {"productId": this.props.productId})
        .then(res => {
          if (res !== undefined) {
            if (res.status === 200) {
              this.setState({
                imagesDetails: res.data
              });

              let imgs = this.state.imgs
              res.data.map((value, index) => (
                  get(`images/${value.imageId}`)
                      .then(res => {
                        if (res !== undefined) {
                          if (res.status === 200) {
                            imgs.push(res.data.url)
                          }
                        }
                      })
              ))
              setTimeout(() => this.setState({imgs: imgs, imgsOk: true}), 1000);
            }
          }
        })
    get('categoryDetail', {"productId": this.props.productId})
        .then(res => {
          if (res !== undefined) {
            if (res.status === 200) {
              res.data.map((value, index) => {
                get('categories')
                    .then(res => {
                      if (res !== undefined)
                        if (res.status === 200) {
                          this.setState({
                            category: res.data,
                          });
                        }
                    });
              })
            }
          }
        })
  }
  render() {
    return (
        <div className="col-lg-2 col-md-4 col-6">
          <div className="product">
            <div className="product-image">
              <img className="img-fluid" src={this.state.imgs[0] !== undefined && this.state.imgs[0]} alt="product"
                   style={{width: '100%', height: '100px'}}/>
              <div className="product-hover-overlay">
                <a className="product-hover-overlay-link" href={'/products/' + this.props.productId}></a>
                <div className="product-hover-overlay-buttons">
                  <a className="btn btn-dark btn-buy" href={'/products/' + this.props.productId}>
                    <i className="fa-search fa"></i><span className="btn-buy-label ms-2">Xem</span></a>
                </div>
              </div>
            </div>
            <div className="py-2">
              <p className="text-muted text-sm mb-1">{this.state.category.categoryName}</p>
              <p className="text-muted text-sm mb-1">Còn lại: {this.state.product.amountProduct}</p>
              <h3 className="h6 text-uppercase mb-1">
                <a className="title-small" href={'/products/' + this.props.productId}>{this.state.product.productName}</a>
              </h3>
              <span className="text-muted">
                {this.state.product.minPrice === this.state.product.maxPrice ?
                    <div><NumberFormat value={this.state.product.minPrice} displayType={'text'} thousandSeparator={true} suffix=' vnđ'/></div> :
                    <div>
                      <NumberFormat value={this.state.product.minPrice} displayType={'text'} thousandSeparator={true}/> -
                      <NumberFormat value={this.state.product.maxPrice} displayType={'text'} thousandSeparator={true} suffix=' vnđ'/>
                    </div>}
              </span>
            </div>
          </div>
        </div>
    )
  }
}
