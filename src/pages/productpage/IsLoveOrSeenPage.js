import {get} from "../../api/callAPI";
import React, { Component } from 'react';
import ProductView from "../detailpage/components/ProductView";
import Product from "../../components/products/Product";
import AuthService from "../../services/AuthService";

class IsLoveOrSeenPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPanel: false,
      list: [],
      listProduct: []
    }
    this.panelTimer = null;
  }

  handleButtonMouseEnter = () => {
    clearTimeout(this.panelTimer);
    this.setState({showPanel: true});
  };
  handleButtonMouseLeave = () => {
    this.panelTimer = setTimeout(() => {
      this.setState({showPanel: false});
    }, 200);
  };
  handleMore = () => {
    this.setState({moreCategoryType: true});
  }
  handleUp = () => {
    let down = this.state.down - 1
    this.setState({
      down: down
    });
  }
  handleDown = () => {
    let down = this.state.down + 1
    this.setState({
      down: down,
    });
  }
  getProduct = (data) => {
    let listProduct = []
    Object.values(data).map((value, index) => {
      get(`products/${value.productId}`)
          .then(res => {
            if (res !== undefined)
              if (res.status === 200) {
                listProduct.push(res.data)
                console.log("product - ", value.productId, res.data)
              }
          });
    })
    setTimeout(() => {
      this.setState({
        listProduct: listProduct
      })
    }, 500)
  }
  getLove = () => {
    get('userProducts', {"isLove": 'true', "userId": AuthService.getCurrentUser().userId})
        .then(res => {
          if (res !== undefined)
            if (res.status === 200) {
              this.setState({
                list: res.data
              });
              console.log("listIsLove: ", res.data)
              this.getProduct(res.data)
            }
        });
  }
  getSeen = () => {
    get('userProducts', {"isSeen": 'true', "userId": AuthService.getCurrentUser().userId})
        .then(res => {
          if (res !== undefined)
            if (res.status === 200) {
              this.setState({
                list: res.data
              });
              console.log("listIsSeen: ", res.data)
              this.getProduct(res.data)
            }
        });
  }

  seenOnClick() {
    get('userProducts', {"isSeen": 'true'})
        .then(res => {
          if (res !== undefined)
            if (res.status === 200)
              this.setState({
                listIsSeen: res.data
              });
        });
  }

  componentDidMount() {
    console.log("vào trang", this.props.match.params.id, this.props.match.params.id === "1")
    if (this.props.match.params.id === "0") {
      this.getLove()
    } else if (this.props.match.params.id === "1") {
      this.getSeen()
    }
  }

  render() {
    return (
        <div className="container-fluid">
          <div className="row">
            <div className="products-grid col-xl-12 col-lg-8 order-lg-2 detail-background">
              <div className="row mt-lg-4 ms-lg-05">
                {Object.values(this.state.listProduct).map((product, index) => {
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
                          categoryNames={product.categoryNames}
                      />
                  )}
                )}
              </div>
            </div>
          </div>
        </div>
    )
  }
}

export default IsLoveOrSeenPage;