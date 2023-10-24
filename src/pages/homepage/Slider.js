import React, { Component } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default class SliderComponent extends Component {
  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 1200,
    };

    const halfScreenHeight = window.innerHeight/2;
    const width = "100%";
    const height = `${halfScreenHeight}px`

    return (
        <div className="slider">
          <Slider {...settings}>
              <div className="item home-full-item background-slide bg-no-dark">
                <img className="image-slide" width={width} height={height}
                     src="https://alltop.vn/backend/media/images/posts/650/Ca_Xiem__Ca_choi_-_Betta_-26158.jpg"
                     alt=""/>
                <div className="container-fluid h-100">
                  <div className="row align-items-center h-100">
                    <div className="col-lg-8 col-xl-6 mx-auto text-white text-center position-relative">
                      <h6 className="text-uppercase text-white fw-light mb-4 letter-spacing-5">Hãy mua sắm cùng chúng tôi</h6>
                      <h5 className="mb-4 fw-bold text-serif">
                        Ở đây chúng ta cung cấp những trãi nghiệm mua sắm tuyệt vời nhất!.
                      </h5>
                      <p><a className="btn btn-light" href={'/products'}>Mua sắm</a></p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item home-full-item background-slide bg-dark dark-overlay">
                <img className="image-slide" width={width} height={height}
                     src="https://anhdephd.vn/wp-content/uploads/2022/05/anh-ca-canh.jpg"
                     alt=""/>
                <div className="container-fluid h-100">
                  <div className="row align-items-center h-100">
                    <div className="col-lg-8 col-xl-6 mx-auto text-white text-center overlay-content">
                      <h4 className="text-uppercase fw-light mb-4 letter-spacing-5">WEB CÁ CẢNH</h4>
                      <h5 className="mb-4 fw-bold text-serif">
                        Cung cấp đa dạng các loại cá
                      </h5>
                      <p><a className="btn btn-light" href={'/products'}>Mua sắm</a></p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item home-full-item background-slide bg-no-dark">
                <img className="image-slide" width={width} height={height}
                     src="https://th.bing.com/th/id/R.b32913854140649522f86222463eb4c4?rik=OKkUtSEKdRzBSQ&pid=ImgRaw&r=0"
                     alt=""/>
                <div className="container-fluid h-100">
                  <div className="row align-items-center h-100">
                    <div className="col-lg-8 col-xl-6 mx-auto text-white text-center position-relative">
                      <h4 className="text-uppercase fw-light mb-4 letter-spacing-5">Kinh Doanh Cá cảnh</h4>
                      <h5 className="mb-4 fw-bold text-serif">Đam mê của bạn là niềm vui của chúng tôi</h5>
                      <p><a className="btn btn-light" href={'/products'}>Mua sắm</a></p>
                    </div>
                  </div>
                </div>
              </div>
          </Slider>
        </div>
    );
  }
}