import React, {Component} from 'react'
import axios from 'axios';

import RecommendItem from './RecommendItem';
import {get, getPython} from "../../../api/callAPI";

export default class Recommend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recommenders: []
    }
  }
  componentDidMount() {
    let params = {};
    params["productId"] = this.props.productId
    console.log(params)
    getPython(`predictKnn`, params)
        .then(res => {
          if (res && res.status === 200) {
            this.setState({
              recommenders: res.data
            })
            console.log("predictKnn:", res.data)
          }
        })
  }
  render() {
    let list = this.state.recommenders;
    return (
        <section className="my-5">
          <div className="container">
            <header className="text-center">
            </header>
            <div className="row">
              {list && list.map((value, index) => (
                  <RecommendItem productId={value["productId"]} key={index}/>
              ))}
            </div>
          </div>
        </section>
    )
  }
}
