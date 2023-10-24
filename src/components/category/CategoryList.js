import React, {Component} from 'react'

import get from '../../api/callAPI';
import Category from './Category';

export default class CategoryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
    }
  }
  componentDidMount() {
    console.log("componentDidMount categories", this.props.categoryTypeId)
    get('categories', {"categoryTypeId": this.props.categoryTypeId})
        .then(res => {
          if (res !== undefined) {
            if (res.status === 200) {
              console.log("res.data: categories", res.data)
              this.setState({
                categories: res.data
              });
            }
          }
        })
  }
  render() {
    return (
        this.state.categories.map((category, index) => {
          if (category.categoryTypeId === this.props.categoryTypeId)
          return (
              <Category key={index}
                        id={category.categoryId}
                        name={category.categoryName}
                        desc={category.categoryDescription}
                        deleteCate={(id) => this.props.deleteCate(id)}
                        handleEditCategoryId={(id) => this.props.handleEditCategoryId(id)}/>)
        })
    );
  }
}
