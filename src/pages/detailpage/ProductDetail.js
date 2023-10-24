import React, {Component} from 'react'
import {withRouter} from 'react-router-dom';
import ProductView from './components/ProductView';
import {get} from '../../api/callAPI';
import FormReview from './components/FormReview';
import Recommend from './components/Recommend';

class ProductDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: {},
      features: [],
      table1: <></>,
      table2: <></>,
      comment: <></>,
      rates: [],
      rateComponent: <></>,
      rateUpdate: false,
      rate: 0,
    }
    this.star = [1, 2, 3, 4, 5];
  }
  componentDidMount() {
    get('products/' + this.props.match.params.id)
        .then(res => {
          if (res !== undefined)

            if (res.status === 200)
              this.setState({
                product: res.data
              });
          console.log(res.data);
        });
    get('features', {"productId": this.props.match.params.id})
        .then(res => {
          if (res !== undefined)
            if (res.status === 200)
              this.setState({
                features: res.data
              });
        });
    get('userProducts', {"productId": this.props.match.params.id})
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
  handleSubmitRate(rate, isCreate) {
    const oldRates = this.state.rates;
    if (isCreate)
      this.setState({
        rates: [...this.state.rates, rate],
        rate: Math.ceil((oldRates.reduce((a, b) => a + b.point, 0) + rate.point) / (oldRates.length + 1)),
      });
    else {
      console.log("1111111111 this.state.rates: ", this.state.rates[0].userId, rate.userId)
      let newRate = this.state.rates.filter(item => item.userId !== rate.userId);
      console.log("newRate: ", newRate)
      let newPoint = Math.ceil((newRate.reduce((a, b) => a + b.point, 0) + rate.point) / (oldRates.length));
      this.setState({
        rates: [...newRate, rate],
        rate: newPoint,
      });
    }
    this.handleRateClick();
  }
  async handleRateClick(e) {
    console.log('rate: '  + this.state.rate, this.star)
    await this.setState({
      rateComponent: this.state.rates.length === 0 ? <div>Chưa có đánh giá nào cho sản phẩm,
            bạn hãy là người đầu tiên đánh giá cho sản phẩm này</div> :
          this.state.rates.map((rate, index) => (<div key={index} className="review d-flex">
            <div className="flex-shrink-0 text-center me-4 me-xl-5">
              <img className="review-image" src="https://th.bing.com/th/id/OIP.fRuAjWMRwF-AvZ24UFGcrAHaHa?pid=ImgDet&rs=1"/>
              <span className="text-uppercase text-muted"></span>
            </div>
            <div>
              <h5 className="mt-2 mb-1">{rate.username}</h5>
              <div className="mb-2"> {this.star.map((num, index) => {
                if (num <= rate.point)
                  return <i key={index} className="fa fa-xs fa-star text-warning"/>
                else return <i key={index} className="fa fa-xs fa-star text-gray-200"/>
              })}
              </div>
              <p className="text-muted">{rate.comment} </p>
            </div>
          </div>))
    })
    console.log(this.state.rateComponent)
  }
  async handleFeatureClick(e) {
    await this.setState({
      table1: this.state.features.map((feature, index) => {
          return (<tr key={index}>
            <th className="text-uppercase fw-normal border-0">{feature.featureTypeName}</th>
            <td className="text-muted border-0">{feature.specific} {feature.unit}</td>
          </tr>);
        return '';
      })
    })
  }
  render() {
    return (
        <>
          <div className="product-detail-padding-background">
            <div className="product-detail-css">
              <section className="product-details">
                <div className="container-fluid">
                  <ProductView product={this.state.product} productId={this.props.match.params.id}
                               ratePoint={this.state.rate} key={this.state.rate} totalReview={this.state.rates.length}/>
                </div>
              </section>
              <section className="mt-5">
                <div className="container">
                  <ul className="nav nav-tabs flex-column flex-sm-row" role="tablist">
                    <li className="nav-item">
                      <a className="nav-link detail-nav-link active" data-bs-toggle="tab"
                         href="#description" role="tab">Chi tiết</a></li>
                    <li className="nav-item">
                      <a className="nav-link detail-nav-link" data-bs-toggle="tab" href="#additional-information"
                         role="tab" onClick={(e) => this.handleFeatureClick(e)}>Thêm thông tin
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link detail-nav-link" data-bs-toggle="tab" href="#reviews" role="tab"
                         onClick={(e) => this.handleRateClick(e)}>Bình luận</a></li>
                  </ul>
                  <div className="tab-content py-4">
                    <div className="tab-pane active px-3" id="description" role="tabpanel">
                      <p className="text-muted">{this.state.product.productDescription}</p>
                    </div>
                    <div className="tab-pane" id="additional-information" role="tabpanel">
                      <div className="row">
                        <div className="col-lg-6">
                          <table className="table text-sm">
                            <tbody>{this.state.table1}</tbody>
                          </table>
                        </div>
                        <div className="col-lg-6">
                          <table className="table text-sm">
                            <tbody>{this.state.table2}</tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane" id="reviews" role="tabpanel">
                      <div className="row mb-5">
                        <div className="col-lg-10 col-xl-9">
                          {this.state.rateComponent}
                          <FormReview productId={this.props.match.params.id} postReview={(rate, isCreate) => this.handleSubmitRate(rate, isCreate)}/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <Recommend productId={this.props.match.params.id} key={this.props.match.params.id}/>
            </div>
          </div>
        </>
    )
  }
}
export default withRouter(ProductDetail);