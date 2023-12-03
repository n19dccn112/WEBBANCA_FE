import React, {Component} from 'react';
import NumberFormat from 'react-number-format';
import {Link} from 'react-router-dom';
import Image from '../../assets/img/default.png';
import {get} from "../../api/callAPI";

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: {},
      images : [],
      products: []
    }
  }
  orderDetails() {
    get('orderDetails', {"productId": this.props.productId})
        .then(res => {
          if (res !== undefined) {
            if (res.status === 200) {
              this.setState({
                products: res.data
              });
            }
          }
        })
  }
  unitDetail() {
    get('unitDetail', {"productId": this.props.productId})
        .then(res => {
          if (res !== undefined) {
            if (res.status === 200) {
              this.setState({
                products: res.data
              });
            }
            if (Object.keys(res.data).length === 0) this.orderDetails()
          }
        })
  }
  imagesDetail() {
    get('imagesDetail', {"productId": this.props.productId})
        .then(res => {
          if (res !== undefined) {
            if (res.status === 200) {
              this.setState({
                products: res.data
              });
            }
            if (Object.keys(res.data).length === 0) this.unitDetail()
          }
        })
  }
  eventProducts() {
    get('eventProducts', {"productId": this.props.productId})
        .then(res => {
          if (res !== undefined) {
            if (res.status === 200) {
              this.setState({
                products: res.data
              });
              if (Object.keys(res.data).length === 0)   this.imagesDetail()
            }
          }
        })
  }
  categoryDetail() {
    get('categoryDetail', {"productId": this.props.productId})
        .then(res => {
          if (res !== undefined) {
            if (res.status === 200) {
              this.setState({
                products: res.data
              });
            }
            if (Object.keys(res.data).length === 0) this.eventProducts()
          }
        })
  }
  businessDetail(){
    get('businessDetail', {"productId": this.props.productId})
        .then(res => {
          if (res !== undefined) {
            if (res.status === 200) {
              this.setState({
                products: res.data
              });
              if (Object.keys(res.data).length === 0) this.categoryDetail()
            }
          }
        })
  }
  userProducts(){
    get('userProducts', {"productId": this.props.productId})
        .then(res => {
          if (res !== undefined) {
            if (res.status === 200) {
              this.setState({
                products: res.data
              });
              if (Object.keys(res.data).length === 0)   this.businessDetail()
            }
          }
        })
  }
  componentDidMount() {
    setTimeout(() => this.userProducts(), 500)
    setTimeout(() => {
      console.log("gọi events")
      if (!this.props.isTable)
        get('eventProducts', {"productIdMaxEvent": this.props.productId})
            .then(res => {
              if (res !== undefined) {
                if (res.status === 200 && Object.values(res.data).length !== 0) {
                  get(`events/${res.data[0].eventId}`)
                      .then(res => {
                        if (res !== undefined) {
                          if (res.status === 200) {
                            this.setState({
                              event: res.data
                            });
                          }
                        }
                      })
                }
              }
            })
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
    if (this.props.isTable)
      return (
          <tr>
            <td className="py-4 text-sm"># {this.props.productId}</td>
            <td className="py-4 text-sm">{this.props.productName}</td>
            <td className="py-4 text-sm text-center">
              {this.props.isAnimal === "true" ? (
                  <span style={{ color: 'green' }}>&#x2714;</span>
              ) : (
                  <span style={{ color: 'red' }}>&#x2718;</span>
              )}
            </td>
            <td className="py-4 text-sm">{this.props.productDescription}</td>

            <td className="py-4 text-sm">{this.props.isAnimal === "true" ?
                `${this.handleDate(this.props.importDate)}`: `${this.handleDate(this.props.expirationDate)}`}</td>
            <td className="py-4 align-middle">
              <a className="edit-button" key={`'Update'${this.props.productId}}`}
                 style={{marginLeft: "15px"}} href={`products/${this.props.productId}`}>
                <i className="fas fa-pencil-alt"></i></a>
              {Object.keys(this.state.products).length === 0 &&
                  <a className="delete-button" style={{marginLeft: "20px", color: "black"}} key={`'DeleteProduct'${this.props.id}`}
                     onClick={(e) => this.props.deleteProduct(this.props.productId)}>
                    <i className="fas fa-trash"></i>
                  </a>
            }
            </td>
          </tr>
      )
    const currentDate = new Date();
    const targetDate = new Date(this.props.updateDateProduct);
    const timeDiff = Math.abs(currentDate.getTime() - targetDate.getTime());
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    const isWithin30Days = daysDiff <= 30;

      if (this.props.isDiscount === true && Object.keys(this.state.event).length === 0)
        return (<div></div>);
      if (this.props.isNew === true && !isWithin30Days)
        return (<div></div>);
      return (<div className="col-xl-4 col-6">
            <div className="product detail-background">
              <div className="product-image">
                {this.props.amountProduct === 0 ? <div className="ribbon ribbon-danger">Bán hết</div> : ''}
                <div className="image-container">
                  {this.props.images.length > 0 ?
                      (<img src={this.props.images[0]} style={{width: '100%', height: '200px'}} alt="product"/>) :
                      (<img src={Image} style={{width: '100%', height: '200px'}} alt="product"/>)
                  }
                  {Object.keys(this.state.event).length === 0 ? ('') : (
                      <div className="discount-sticker">
                        <i className="fas fa-tag"></i>
                        <span className="discount-text">Giảm {this.state.event.discountValue}%</span>
                      </div>
                  )}
                  {isWithin30Days ? (
                      <div className="ribbon2 ribbon-new">new</div>
                  ) : ''}
                </div>
                <div className="product-hover-overlay">
                  <Link className="product-hover-overlay-link" to={'/products/' + this.props.productId}></Link>
                  <div className="product-hover-overlay-buttons">
                    <Link className="btn btn-dark btn-buy" to={'/products/' + this.props.productId}>
                      <i className="fa-search fa"></i>
                      <span className="btn-buy-label ms-2">Xem</span>
                    </Link>
                    <a className="btn btn-outline-dark btn-product-right d-none d-sm-inline-block"
                       onClick={(e) => this.props.openModel(this.props.productId)}
                       data-bs-toggle="modal"
                       data-bs-target="#exampleModal">
                      <i className="fa fa-expand-arrows-alt"></i>
                    </a>
                  </div>
                </div>
              </div>
              <div className="py-2">
                {this.props.categoryNames.map((key, value) => (
                    <p className="text-muted text-sm mb-1">{key}</p>
                ))}

                <p className="text-muted text-sm mb-1">Còn lại: {this.props.amountProduct}</p>
                <h3 className="h6 text-uppercase mb-1">
                  <Link className="title-small" to={'/products/' + this.props.productId}>
                    {this.props.productName}
                  </Link>
                </h3>
                <div className="container1">
                  <span className="text-red bold-text" style={{fontSize: "14px"}}>
                  {Object.keys(this.state.event).length === 0 ? (
                      this.props.minPrice === this.props.maxPrice ?
                          <div><NumberFormat value={this.props.minPrice} displayType={'text'} thousandSeparator={true} suffix=' vnđ'/></div> :
                          <div>
                            <NumberFormat value={this.props.minPrice} displayType={'text'} thousandSeparator={true}/> -
                            <NumberFormat value={this.props.maxPrice} displayType={'text'} thousandSeparator={true} suffix=' vnđ'/>
                          </div>
                  ) : (
                      this.props.minPrice === this.props.maxPrice ?
                          <div><NumberFormat value={Math.floor((this.props.minPrice * ((100 - this.state.event.discountValue)/100))/1000)*1000}
                                             displayType={'text'} thousandSeparator={true} suffix=' vnđ'/></div> :
                          <div>
                            <NumberFormat value={Math.floor((this.props.minPrice * ((100 - this.state.event.discountValue)/100))/1000)*1000}
                                          displayType={'text'} thousandSeparator={true}/> -
                            <NumberFormat value={Math.floor((this.props.maxPrice * ((100 - this.state.event.discountValue)/100))/1000)*1000}
                                          displayType={'text'} thousandSeparator={true} suffix=' vnđ'/>
                          </div>
                  )}
                </span>
                  <span className="list-inline-item text-muted fw-light" style={{fontSize: "12px", textDecoration: "line-through"}}>
                    {this.props.minPrice === this.props.maxPrice ?
                        <div><NumberFormat value={this.props.minPrice} displayType={'text'} thousandSeparator={true} suffix=' vnđ'/></div> :
                        <div>
                          <NumberFormat value={this.props.minPrice} displayType={'text'} thousandSeparator={true}/> -
                          <NumberFormat value={this.props.maxPrice} displayType={'text'} thousandSeparator={true} suffix=' vnđ'/>
                        </div>
                      }
                  <del>
                  </del>
                </span>
                </div>
              </div>
            </div>
          </div>
      );
  }
}

export default Product;