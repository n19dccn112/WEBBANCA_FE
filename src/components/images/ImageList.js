import React, {Component} from 'react'
import {get} from '../../api/callAPI';
import Image from './Image';

export default class ImageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: []
    }
  }
  componentDidMount() {
    get('images', {"productId": this.props.id})
        .then(res => {
          if (res !== undefined)
            if (res.status === 200) {
              this.setState({
                images: res.data
              });
            }
        });
  }
  render() {
    var listImage = this.state.images
    return (
        listImage.map((image, index) => {
          return (<Image key={index} id={image.imageId} url={image.url}/>)
        })
    );
  }
}

