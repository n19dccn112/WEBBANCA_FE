import React, {Component} from 'react'

import get from '../../api/callAPI';
import CategoryTypes from './CategoryTypes';

export default class CategoryTypeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryTypes: [],
    }
  }
  componentDidMount() {
    get('categoryTypes')
        .then(res => {
          if (res !== undefined)
            if (res.status === 200)
              this.setState({
                categoryTypes: res.data
              });
        });
  }
  render() {
    return (
        this.state.categoryTypes.map((categoryType, index) => {
          return (
              <CategoryTypes key={index}
                             filterByCate={(id) => this.props.filterByCate(id)}
                             id={categoryType.categoryTypeId}
                             name={categoryType.categoryTypeName}
                             desc={categoryType.categoryTypeDescription}
                             isTable={this.props.isTable}
                             deleteCate={(id) => this.props.deleteCate(id)}
                             select={this.props.select}
                             handleModalComponent={(categoryTypeId) => this.props.handleModalComponent(categoryTypeId)}/>
          )

        })
    );
  }
}
