import React, {Component} from 'react'

export default class  Image extends Component {
  render() {
    return (
        <a className="background-leftbar glightbox d-block mb-4" style={{width: '100%', height: '200px'}}
           href={this.props.url} data-title="Modern Jacket 1 - Caption text"
           data-gallery="product-gallery">
          <div data-bs-toggle="zoom" data-image={this.props.url}>
            <img style={{width: '100%', height: '200px'}}  src={this.props.url}/></div>
        </a>

    )
  }
}
