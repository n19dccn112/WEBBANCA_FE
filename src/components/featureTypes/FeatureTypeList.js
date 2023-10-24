import React, {Component} from 'react'

import get from '../../api/callAPI';
import FeatureType from './FeatureType';

export default class FeatureTypeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      featureTypes: []
    }
  }
  componentDidMount() {
    get('featureTypes')
        .then(res => {
          if (res !== undefined)
            if (res.status === 200)
              this.setState({
                featureTypes: res.data
              });
        });
  }
  render() {
    var listFeatureTypes = this.state.featureTypes
    return (
        listFeatureTypes.map((type, index) => {
          return (<FeatureType
              id={type.featureTypeId}
              name={type.featureTypeName}
              unit={type.featureTypeUnit}
              isShow={type.isShow}
              checkedFeature={(e, id) => this.props.checkedFeature(e, id)}
              checkedFeature2={(e, id) => this.props.checkedFeature2(e, id)}
              key={index}
              isTable={this.props.isTable}
              currentfeatures={this.props.currentfeatures}
              deleteFeature={(id) => this.props.deleteFeature(id)}
              handleModalComponent={(featureTypeId) => this.props.handleModalComponent(featureTypeId)}
          />)

        })
    );
  }
}
