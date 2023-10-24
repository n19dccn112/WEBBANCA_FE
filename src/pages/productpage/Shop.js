import React, {Component} from 'react'
import ProductList from '../../components/products/ProductList'
import LeftBar from './LeftBar'
import Modal from './Modal';

export default class Shop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryId: undefined,
      categoryTypeId: undefined,
      featureIds: [],
      productIds: [],
      modelId: 0,
      modelComponent: <> </>,
      minPriceFilter: 0,
      maxPriceFilter: 1000000,
      isNew: false,
      isDiscount: false,
    }
    this.productList = React.createRef();
  }

  componentDidMount() {
    // if (SearchProductIds.getquery() !== "") {
    //   let params = {};
    //   params["query"] = SearchProductIds.getquery();
    //   getPython(`search`, params)
    //       .then(res => {
    //         console.log("777777777 res.data: ", res.data)
    //         if (Array.isArray(res.data)) {
    //           console.log("res.data is a list.");
    //         } else {
    //           console.log("res.data is not a list.");
    //         }
    //         this.setState({
    //           productIds: res.data,
    //         })
    //       });
    // }
  }
  filterProductsByPrice(minPriceFilter, maxPriceFilter) {
    this.setState({
      minPriceFilter: minPriceFilter,
      maxPriceFilter: maxPriceFilter
    })
  }

  filterProductsByNew(isNew) {
    this.setState({
      isNew: isNew
    })
  }

  filterProductsByDiscount(isDiscount) {
    this.setState({
      isDiscount: isDiscount
    })
  }
  async handleFilterByCate(id) {
    await this.setState({
      categoryId: id,
    })
  }
  async handleFilterByCateType(id) {
    console.log("bấm nút cateType", id)
    await this.setState({
      categoryTypeId: id,
    })
  }
  openModel(id) {
    this.setState({
      modelId: id,
      modelComponent: <Modal productId={id} key={id}/>
    })
  }
  render() {
    return (
        <>
          <div className="container-fluid">
            <div className="row">
              <div className="products-grid col-xl-9 col-lg-8 order-lg-2 detail-background">
                <div className="row mt-lg-4 ms-lg-05">
                  <ProductList
                      categoryTypeId={this.state.categoryTypeId}
                      categoryId={this.state.categoryId}
                               productIds={this.state.productIds}
                               key={this.state.productIds} ref={this.productList} openModel={(id) => this.openModel(id)}
                               minPriceFilter={this.state.minPriceFilter} maxPriceFilter={this.state.maxPriceFilter}
                               isDiscount={this.state.isDiscount} isNew={this.state.isNew}
                  />
                </div>

                {<nav className="d-flex justify-content-center mb-5 mt-3" aria-label="page navigation">
                  <ul className="pagination">
                    <li className="page-item"><a className="page-link" href="#" aria-label="Previous"><span aria-hidden="true">Trước</span></a></li>
                    <li className="page-item active"><a className="page-link" href="#">1       </a></li>
                    <li className="page-item"><a className="page-link" href="#">2       </a></li>
                    <li className="page-item"><a className="page-link" href="#">3       </a></li>
                    <li className="page-item"><a className="page-link" href="#">4       </a></li>
                    <li className="page-item"><a className="page-link" href="#">5 </a></li>
                    <li className="page-item"><a className="page-link" href="#" aria-label="Next"><span aria-hidden="true">Sau</span></a></li>
                  </ul>
        </nav>}
              </div>
              {this.state.modelComponent}
              <LeftBar filterByCate={(id) => this.handleFilterByCate(id)}
                       filterByCateType={(id) => this.handleFilterByCateType(id)}
                       filterProductsByPrice={(minPriceFilter, maxPriceFilter) => this.filterProductsByPrice(minPriceFilter, maxPriceFilter)}
                       fileterNewProduct={(isNew) => this.filterProductsByNew(isNew)}
                       filterProductsByDiscount={(isDiscount) => this.filterProductsByDiscount(isDiscount)}/>
            </div>
          </div>
        </>
    )
  }
}
