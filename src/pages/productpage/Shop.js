import React, {Component} from 'react'
import ProductList from '../../components/products/ProductList'
import LeftBar from './LeftBar'
import Modal from './Modal';
import PageSlide from "../pageFoot/PageSlide";

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

      pageNumber: 0,
      minNumber: 0,
      maxNumber: 12,
      numberIndex: 1,
      pageComponent: [],
      numberPage: 1
    }
    this.productList = React.createRef();
  }
  buildPage(){
    let component = []
    for (let i=1; i<=this.state.numberPage; i++){
      component.push(
          <li key={`SelectedShop${i}`} className={`${this.state.numberIndex === i && 'active'} page-item`}>
            <button className="page-link" onClick={() => this.handleNumberIndex(i)}>{i}</button></li>
      )
    }
    setTimeout(() => {this.setState({pageComponent :component})}, 200)
  }
  handleNumberIndex(numberIndex){
    this.setState({
      minNumber: numberIndex * 12 - 12,
      maxNumber: numberIndex * 12,
    })
    this.setState({numberIndex: numberIndex})
    setTimeout(() => {
      console.log("min, max index:", this.state.minNumber, this.state.maxNumber, numberIndex)
      this.buildPage()
    }, 500)
  }

  handleNumberPage(numberPage) {
    this.setState({numberPage: numberPage})
    this.buildPage()
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
                      pageName={"Shop"}
                      minNumber={this.state.minNumber} maxNumber={this.state.maxNumber}
                      handleNumberPage={(numberPage) => this.handleNumberPage(numberPage)}
                      categoryTypeId={this.state.categoryTypeId}
                      categoryId={this.state.categoryId}
                      productIds={this.state.productIds}
                      key={this.state.productIds} ref={this.productList} openModel={(id) => this.openModel(id)}
                      minPriceFilter={this.state.minPriceFilter} maxPriceFilter={this.state.maxPriceFilter}
                      isDiscount={this.state.isDiscount} isNew={this.state.isNew}
                  />
                </div>

                <PageSlide handleNumberIndex={(numberIndex) => this.handleNumberIndex(numberIndex)}
                           numberIndex={this.state.numberIndex} numberPage={this.state.numberPage} pageComponent={this.state.pageComponent}/>

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
