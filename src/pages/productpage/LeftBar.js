import React, {Component} from 'react'
import CategoryTypeList from '../../components/categorieTypes/CategoryTypeList'
import FeatureTypeList from '../../components/featureTypes/FeatureTypeList'
import FilterBar from "./FilterBar";
import CategoryButton from "./CategoryButton";

export default class LeftBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCheckedNew: false,
      isCheckedDiscount: false,
    }
  }
  handleNewProduct = (e)=> {
    this.setState({
      isCheckedNew: e.target.checked
    });
    this.props.fileterNewProduct(!this.state.isCheckedNew)
  }

  handleDiscountProduct = (e)=> {
    this.setState({
      isCheckedDiscount: e.target.checked
    });
    this.props.filterProductsByDiscount(!this.state.isCheckedDiscount)
  }

  render() {
    return (
        <>
          <div className="sidebar background-leftbar col-xl-3 col-lg-4 order-lg-1 pt-2">
            <div className="sidebar-block px-lg-0 ">
              <div className="expand-lg collapse" id="categoryTypeMenu">
                <div className="nav nav-pills flex-column mt-lg-4 mt-lg-0" role="menu">
                  <span style={{fontWeight : "bolder", color : "gray", marginBottom: "10px"}}>Tất cả</span>
                  <CategoryButton canClick = {1} filterByCateType={(id) => this.props.filterByCateType(id)}
                                  filterByCate={(id) => this.props.filterByCate(id)}/>
                </div>
              </div>
            </div>
            <div className="sidebar-block px-3 px-lg-0">
              <span style={{fontWeight : "bolder", color : "gray"}}>Lọc giá</span>
              <div className="px-35 mt-3">
                <FilterBar
                    filterProductsByPrice={(minPriceFilter, maxPriceFilter) => this.props.filterProductsByPrice(minPriceFilter, maxPriceFilter)}>
                </FilterBar>
              </div>
            </div>
            <span className="mb-7" style={{fontWeight : "bolder", color : "gray"}}>Lọc theo</span>
            <div className="ms-3 mt-3">
              <input type="checkbox"
                     name="{this.props.group}"
                     value="{this.props.id}"
                     id="newFilter"
                     checked={this.state.isCheckedNew}
                     onChange={this.handleNewProduct}/>
              <label className="ms-3" htmlFor="1">
                <strong className="mb-2" style={{fontWeight : "inherit", color : "gray", marginTop : "5px"}}> Sản phẩm mới</strong>
              </label>
            </div>
            <div className="ms-3">
              <input type="checkbox"
                     name="{this.props.group}"
                     value="{this.props.id}"
                     id="discountFilter"
                     checked={this.state.isCheckedDiscount}
                     onChange={this.handleDiscountProduct}/>
              <label className="ms-3" htmlFor="2">
                <strong className="mb-2" style={{fontWeight : "inherit", color : "gray", marginTop : "5px"}}> Giảm giá</strong>
              </label>
            </div>
          </div>
        </>
    )
  }
}
