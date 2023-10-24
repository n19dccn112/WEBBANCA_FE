import React, {Component} from 'react'

import get from '../../api/callAPI';
import Feature from './Feature';

export default class FeatureList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      features: []
    }
  }
  componentDidMount() {
    get('features', {"featureType": this.props.id})
        .then(res => {
          if (res !== undefined)
            if (res.status === 200)
              this.setState({
                features: res.data
              });
        });
  }
  render() {
    var listFeatures = this.state.features
    return (
        listFeatures.map((feature, index) => {
          if (feature.featureTypeId === this.props.featureTypeId)
          return (
              <Feature key={index}
                       checkedFeature={(e, id) => this.props.checkedFeature(e, id)}
                       id={feature.featureId}
                       spec={feature.specific}
                       isRadio={this.props.isRadio}
                       group={this.props.group}
                       currentfeatures={this.props.currentfeatures}
                       deleteFeature={(id) => this.props.deleteFeature(id)}
                       handleEditFeatureId={(id) => this.props.handleEditFeatureId(id)}
              />
          )
        })
    );
  }
}
