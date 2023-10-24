import React, {Component} from 'react'
import FeatureList from '../features/FeatureList'
import {get} from "../../api/callAPI";

export default class FeatureType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      features: [],
    }
  }
  componentDidMount() {
    console.log("componentDidMount features", this.props.id)
    get('features', {"featureTypeId": this.props.id})
        .then(res => {
          if (res !== undefined) {
            if (res.status === 200) {
              console.log("res.data: features", res.data)
              this.setState({
                features: res.data
              });
            }
          }
        })
  }
  render() {
    if (this.props.isTable)
      return (
          <tr>
            <th className="py-4 align-middle"># {this.props.id}</th>
            <td className="py-4 align-middle">{this.props.name}</td>
            <td className="py-4 align-middle">{this.props.unit}</td>
            <td className="py-4 text-sm text-center">
              {this.props.isShow === "true" ? (
                  <span style={{ color: 'green' }}>&#x2714;</span>
              ) : (
                  <span style={{ color: 'red' }}>&#x2718;</span>
              )}
            </td>
            <td className="py-4 align-middle text-center">
              <button className="category-seen-button" data-bs-toggle="modal"
                      data-bs-target="#modalFeature"
                      onClick={() => this.props.handleModalComponent(this.props.id)}>
                Loại {this.props.name} <i className="fa fa-list-ol me-1"></i>
              </button>
            </td>
            <td className="py-4 align-middle">
              <a className="edit-button" key={`'UpdateFeatureTypes'${this.props.id}}`}
                 style={{marginLeft: "15px"}} href={`featureTypes/${this.props.id}`}>
                <i className="fas fa-pencil-alt"></i></a>
              {Object.keys(this.state.features).length === 0 &&
                  <a className="delete-button" style={{marginLeft: "20px", color: "black"}} key={`'DeleteFeatureTypes'${this.props.id}`}
                     onClick={(e) => this.props.deleteFeature(this.props.id)}>
                    <i className="fas fa-trash"></i>
                  </a>}
            </td>
          </tr>
      )
    return (
        <>
          <div className="expand-lg collapse show" id="brandFilterMenu">
            <h6 className="sidebar-heading d-none d-lg-block">{this.props.name} </h6>
            <form className="mt-4 mt-lg-0" action="#">
              <FeatureList unit={this.props.unit}
                           id={this.props.id}
                           checkedFeature={(e, id) => this.props.checkedFeature(e, id)}
              />
            </form>
          </div>
        </>
    )
  }
}

