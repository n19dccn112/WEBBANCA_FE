import React, {Component} from 'react';
import get, {getPython} from '../../api/callAPI';
import Product from './Product';
import SearchProductIds from "../../services/SearchProductIds";

class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      categoryId: 0,
      categoryTypeId: 0,
      productIds: [],
      update: false,
      imageUrl: ""
    }
  }
  componentDidMount() {
    get('products')
        .then(res => {
          if (res !== undefined) {
            // console.log("this.props.productIds: : ", res.data);
            if (res.status === 200)
              this.setState({
                products: res.data
              });
            // console.log("Object.keys(res.data).length: ", Math.round(Object.keys(res.data).length/20 + 1))
            if (this.props.handlePageNumber !== undefined)
            this.props.handlePageNumber(Math.round(Object.keys(res.data).length/20 + 1))
          }
        });

    // console.log("this.props.minNumber, this.props.maxNumber: ", this.props.minNumber, this.props.maxNumber)
  }

componentDidUpdate(prevProps)
{
  // console.log(
  //     "CateType state, props - trước: ", this.state.categoryTypeId, this.props.categoryTypeId, " - ", prevProps.categoryTypeId,
  //     "1", (this.props.categoryTypeId !== undefined && this.state.categoryTypeId !== this.props.categoryTypeId) ,
  //     "2", (this.props.categoryId && this.state.categoryId !== this.props.categoryId),
  //     "3", (this.props.productIds && this.state.productIds !== this.props.productIds))
  if ((this.props.categoryTypeId !== undefined  && this.state.categoryTypeId !== this.props.categoryTypeId) ||
      (this.props.categoryId && this.state.categoryId !== this.props.categoryId) ||
      (this.props.productIds && this.state.productIds !== this.props.productIds)){
    // console.log("this.state.categoryId - prevProps.categoryId: ", this.state.categoryId, " - ", prevProps.categoryId)
    if (this.props.categoryTypeId !== -1){
      // console.log("no select all")
      this.setState({
        update: true,
        categoryTypeId: this.props.categoryTypeId,
        categoryId: this.props.categoryId,
        productIds: this.props.productIds,
      });
    }
    else {
      // console.log("select all")
      get('products')
          .then(res => {
            if (res !== undefined)
              if (res.status === 200)
                this.setState({
                  products: res.data
                });
          });
    }
  }
  if (this.state.update) {
    let params = {};
    if (this.state.categoryTypeId !== 0)
      params["categoryTypeId"] = this.state.categoryTypeId;
    if (this.state.categoryId !== 0)
      params["categoryId"] = this.state.categoryId;
    if (this.state.productIds.length > 0)
      params["productIds"] = this.state.productIds.reduce((p, s) => `${p},${s}`);
    get('products', params)
        .then(res => {
          if (res !== undefined)
            if (res.status === 200)
              this.setState({
                products: res.data
              });
        });
    this.setState({
      update: false,
    });

    SearchProductIds.setquery("")
  }
}

  render() {
    var listProducts = this.state.products
    return (
        listProducts.map((product, index) => {
          // console.log("product.minPrice, product.maxPrice: ", product.minPrice, product.maxPrice)
          if ((this.props.isTable && index < this.props.maxNumber && index > this.props.minNumber) ||
              (!this.props.isTable &&
                ((this.props.minPriceFilter <= product.maxPrice && product.maxPrice <= this.props.maxPriceFilter) ||
                  (this.props.minPriceFilter <= product.minPrice && product.minPrice <= this.props.maxPriceFilter)))) {
          return (
              <Product
                  productId={product.productId}
                  importDate={product.importDate}
                  productDescription={product.productDescription}
                  productName={product.productName}
                  updateDateProduct={product.updateDateProduct}
                  expirationDate={product.expirationDate}
                  minPrice={product.minPrice}
                  maxPrice={product.maxPrice}
                  key={product.productId}
                  isAnimal={product.isAnimal}
                  amountProduct={product.amountProduct}
                  images={product.images}
                  // unitIdNameRemainLengthPrice={product.unitIdNameRemainLengthPrice}
                  // featureIdPriceUnit={product.featureIdPriceUnit}
                  isTable={this.props.isTable}
                  categoryNames={product.categoryNames}
                  deleteProduct={(id) => this.props.deleteProduct(id)}
                  openModel={(id) => this.props.openModel(id)}
                  minPriceFilter={this.props.minPriceFilter}
                  maxPriceFilter={this.props.maxPriceFilter}
                  // isDiscount={this.props.isDiscount}
                  isNew={this.props.isNew}
              />
          )}
          return;
        })
    );
  }

}
export default ProductList;