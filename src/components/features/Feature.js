import React, {Component} from 'react'
import {get} from "../../api/callAPI";

export default class Feature extends Component {
  constructor(props) {
    super(props);
    this.state = {
      featureDetail: [],
    }
  }
  componentDidMount() {
    console.log("componentDidMount features", this.props.id)
    get('featureDetails', {"featureId": this.props.id})
        .then(res => {
          if (res !== undefined) {
            if (res.status === 200) {
              console.log("res.data: features", res.data)
              this.setState({
                featureDetail: res.data
              });
            }
          }
        })
  }
  render() {
    if (this.props.isRadio)
      return (<>
        <div className="mb-4 col-md-3 d-flex align-items-center">
          {this.props.currentfeatures.includes(this.props.id) ?
              <input type="radio" name={this.props.group} value={this.props.id} defaultChecked
                     id={this.props.id}/>
              : <input type="radio" name={this.props.group} value={this.props.id} id={this.props.id}/>
          }
          <label className="ms-3" htmlFor={this.props.id}>
            <strong className="d-block text-uppercase mb-2"> {this.props.spec}</strong>
          </label>
        </div>
      </>)
    return (
        <>
          <tr>
            <td className="py-4 align-middle"># {this.props.id}</td>
            <td className="py-4 align-middle">{this.props.spec}</td>
            <td className="py-4 align-middle">
              <a className="edit-button" key={`'Updatefeature'${this.props.id}}`}
                 style={{marginLeft: "15px"}} onClick={() => this.props.handleEditFeatureId(this.props.id)}>
                <i className="fas fa-pencil-alt"></i>
              </a>
              {Object.keys(this.state.featureDetail).length === 0 &&
                  <a className="delete-button" style={{marginLeft: "20px", color: "black"}} key={`'Deletefeature'${this.props.id}`}
                     onClick={(e) => this.props.deleteFeature(this.props.id)}>
                    <i className="fas fa-trash"></i>
                  </a>}
            </td>
          </tr>
        </>
    )
  }
}
