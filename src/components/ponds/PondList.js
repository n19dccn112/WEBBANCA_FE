import React, {Component} from 'react'

import get from '../../api/callAPI';
import Pond from "./Pond";

export default class PondList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ponds: [],
    }
  }
  componentDidMount() {
    get('ponds')
        .then(res => {
          if (res !== undefined)
            if (res.status === 200)
              this.setState({
                ponds: res.data
              });
        });
  }
  render() {
    var listPonds = this.state.ponds
    return (
        listPonds.map((pond, index) => {
          return (
              <Pond key={index}
                    id={pond.pondId}
                    standardPrice={pond.standardPrice}
                    pondAmount={pond.pondAmount}
                    inputDate={pond.inputDate}
                    priceShip={pond.priceShip}
                    deletePond={(id) => this.props.deletePond(id)}
              />
          )

        })
    );
  }
}
