import React, { Component } from 'react';
import {get} from "../../api/callAPI";

class CategoryButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPanel: false,
      showSubPanel: false,
      category: {},
      categoryType: {},
      categoryMenu: {},
      productIds: {},
      categoryTypeIndex: null,
      categorySelect: null,
      moreCategoryType: false,
      moreCategory: false,
      colorSelect: {color: "red"},
      down : 0,
    };
    this.panelTimer = null;
  }

  handleButtonMouseEnter = () => {
    clearTimeout(this.panelTimer);
    this.setState({ showPanel: true });
  };

  handleButtonMouseLeave = () => {
    this.panelTimer = setTimeout(() => {
      this.setState({ showPanel: false });
    }, 200);
  };

  handleMoreType = () => {
    this.setState({ moreCategoryType: true });
  }

  handleUpCategory = () => {
    let down = this.state.down - 1
    this.setState({
      down: down});
  }

  handleDownCategory = () => {
    let down = this.state.down + 1
    this.setState({
      down: down,});
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.state.down!== prevState.down){
      console.log("down",this.state.down)
    }
  }

  handleCategoryTypeMouseEnter = (key) => {
    console.log("key 5555: ", key)
    clearTimeout(this.panelTimer);
    let categoryMenu = this.state.category.filter(item => item.categoryTypeId === this.state.categoryType[key].categoryTypeId);
    console.log("222222222222 this.state.category: ", this.state.category[0].categoryTypeId, this.state.categoryType[key].categoryTypeId)
    console.log("333333333333 categoryMenu: ", categoryMenu)
    this.setState({
      showPanel: true,
      categoryTypeIndex: key,
      showSubPanel: true,
      categoryMenu: categoryMenu,
      moreCategory: false
    });
  };

  handleCategoryTypeMouseLeave = () => {
    this.panelTimer = setTimeout(() => {
    }, 200);
  };

  handleCategoryMouseEnter = (category) => {
    console.log(category)
    clearTimeout(this.panelTimer);
    this.setState({
      showPanel: true,
      categorySelect: category,
      showSubPanel: true,
    });
  };

  handleCategoryMouseLeave = () => {
    this.panelTimer = setTimeout(() => {
    }, 200);
  };

  handleCategoryMouseClick = () => {

  };

  handleSubpanelMouseLeave = () => {
    this.panelTimer = setTimeout(() => {
      this.setState({
        showPanel: false,
        selectedCategory: null,
        showSubPanel: false,
        moreCategoryType: false,
        moreCategory: false
      });
    }, 200);
  };

  componentDidMount() {
    console.log("canClick", this.props.canClick)
    get('categoryTypes')
        .then(res => {
          if (res !== undefined)
            if (res.status === 200) {
              // console.log("0000000000000000: ", res.data)
              this.setState({
                categoryType: res.data,
              });
            }
        });
    get('categories')
        .then(res => {
          if (res !== undefined)
            if (res.status === 200) {
              // console.log("0000000000000000: ", res.data)
              this.setState({
                category: res.data,
              });
            }
        });
  }
  render() {
    const amountShowCate = (this.state.moreCategoryType || this.state.categoryMenu.length <= 5) ?
        this.state.categoryMenu.length : 5;
    const showIndex = amountShowCate > 3 ? amountShowCate/2 : 2
    const marginTopValueOfCategoryType = 35 * (this.state.categoryTypeIndex + showIndex) - 150;
    return (
        <div className="category-button">
          {this.props.canClick === 1 ?
              <button className="cate-button"
                      onMouseEnter={this.handleButtonMouseEnter}
                      onMouseLeave={this.handleButtonMouseLeave}
                      onClick={(e) => this.props.filterByCateType(-1)}>
                Danh mục sản phẩm <i className="fa fa-window-restore"></i>
              </button> :
              <a className="cate-button button"
                      onMouseEnter={this.handleButtonMouseEnter}
                      onMouseLeave={this.handleButtonMouseLeave}>
                Danh mục sản phẩm <i className="fa fa-window-restore"></i>
              </a>}
          {this.state.showPanel && (
              <ul className="panel-category-button button-category-button no-bullet background-grey"
                  onMouseEnter={() => clearTimeout(this.panelTimer)}
                  onMouseLeave={this.handleSubpanelMouseLeave}>
                {this.state.categoryType.map((type, key) => (
                    (key <= 5 || this.state.moreCategoryType) &&
                        // console.log("444444444444 key, type: ", key, type)
                  <li key={`categoryType${key}`}
                      className="button-none-border with-divider background-white"
                      style={{ ...(key === this.state.categoryTypeIndex ? this.state.colorSelect : {}) }}
                      onMouseEnter={() => this.handleCategoryTypeMouseEnter(key)}
                      onMouseLeave={this.handleCategoryTypeMouseLeave()}
                      onClick={(e) => this.props.filterByCateType(type.categoryTypeId)}>
                    {type.categoryTypeName}
                  </li>
                ))}
                {(!this.state.moreCategoryType  && this.state.categoryType.length > 5) ?
                    <li key="moreCtegoryType" className="button-none-border with-divider background-white border"
                                                   onClick={() => this.handleMoreType()}>
                  <i className="fa fa-angle-down m-lg-2"> Xem thêm ...</i>
                </li> : <nav></nav>}

                {this.state.showSubPanel && <div className="subpanel-category-button"
                style={{marginTop: `${marginTopValueOfCategoryType}px`}}>
                      <ul className="panel-category-button button-category-button no-bullet">
                        {this.state.down > 0 &&
                            <li key="upCategory" className="button-none-border with-divider background-white border"
                                onClick={() => this.handleUpCategory()}>
                              <i className="fa fa-angle-up m-lg-2">  ...</i>
                            </li>}
                        {this.state.categoryMenu.map((value, key) =>(
                            // console.log("key, this.state.down, (this.state.down * key) < key, (this.state.down + 1) * key): ", key, this.state.down, (this.state.down * key) < key, key <(this.state.down + 1) * key)
                            ((this.state.down * 5) <= key && key < (this.state.down + 1) * 5) &&
                            <li key={`category${key}`}
                                style={{ ...(key === this.state.categoryIndex ? this.state.colorSelect : {}) }}
                                onMouseEnter={() => this.handleCategoryMouseEnter(value)}
                                onMouseLeave={this.handleCategoryMouseLeave()}
                                onClick={(e) => this.props.filterByCate(value.categoryId)}
                                className="button-none-border with-divider background-white">
                               <i className="fa fa-angle-right m-lg-2"/> {value.categoryName.split(' (')[0]}
                            </li>
                        ))}
                        {(this.state.categoryMenu.length-1 > (this.state.down+1) * 5) &&
                            <li key="downCategory" className="button-none-border with-divider background-white border"
                                onClick={() => this.handleDownCategory()}>
                              <i className="fa fa-angle-down m-lg-2"> ...</i>
                            </li>}
                      </ul>
                </div>}
              </ul>
          )}
        </div>
    );
  }
}


export default CategoryButton;