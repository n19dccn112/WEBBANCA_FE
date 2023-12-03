import React, {Component} from 'react'
import {getPython} from "../../api/callAPI";
import Promotion from "./Promotion";

export default class PromotionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      predictPromotions: [],
    }
  }
  componentDidMount() {
    getPython(`predictPromotion`)
        .then(res => {
          if (res && res.status === 200) {
            this.setState({
              predictPromotions: res.data
            })

            if (this.props.handleNumberPage !== undefined)
              this.props.handleNumberPage(Math.round(Object.keys(res.data).length/10))
            // console.log("predictPromotions", res.data)
          }
        })
  }
  render() {
    return (
        this.state.predictPromotions.map((promotion, index) => {
          // console.log("promotion: ", promotion)
          if (index < this.props.maxNumber && index >= this.props.minNumber)
            return (
                <Promotion key={index}
                           unitDetailId={promotion.unitDetailId}
                           promotion={promotion.promotion}
                           handleSaveEvent = {(e, isPut, eventId, productId, eventProductId) => this.props.handleSaveEvent(e, isPut, eventId, productId, eventProductId)}/>
            )
        })
    );
  }
}
