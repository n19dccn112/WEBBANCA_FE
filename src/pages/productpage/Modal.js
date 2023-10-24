import React, {Component} from 'react'
import {get} from '../../api/callAPI';
import ProductView from '../detailpage/components/ProductView';

export default class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: {},
      rates: [],
      rate: 0,
    }
  }
  componentDidMount() {
    get(`products/${this.props.productId}`)
        .then(res => {
          if (res && res.status === 200) {
            this.setState({
              product: res.data,
            })
          }
        })
    get('userProducts', {"productId": this.props.productId})
        .then(res => {
          if (res !== undefined)
            if (res.status === 200)
              console.log("hồi đáp rate product Id: " + res.data.length + ": " + res);
          this.setState({
            rates: res.data,
            rate: res.data.length === 0 ? 0 :
                Math.ceil(res.data.reduce((a, b) => a + b.point, 0) / res.data.length),
          });
        });
  }
  render() {
    return (
        <div className="modal fade quickview" id="exampleModal" tabIndex="-1" role="dialog" aria-hidden="true">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <button className="close modal-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
              <div className="modal-body">
                <div className="ribbon ribbon-primary mt-5-5">Giảm giá</div>
                <ProductView product={this.state.product} productId={this.props.productId}
                             ratePoint={this.state.rate} key={this.state.rate}
                             totalReview={this.state.rates.length}/>
              </div>
            </div>
          </div>
        </div>
    )
  }
}
