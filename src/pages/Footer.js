import React, {Component} from 'react'

import {Link} from 'react-router-dom';

export default class Footer extends Component {
  render() {
    return (
        <footer className="main-footer">
          <div className="py-6 background-header text-muted">
            <div className="container">
              <div className="row">
                <div className="col-lg-4 mb-5 mb-lg-0">
                  <div className="fw-bold text-uppercase text-lg text-dark mb-3">Đam mê của bạn là niềm của của chúng tôi<span
                      className="text-primary">.</span></div>
                  <p>Chào mừng bạn đến với cửa hàng cá cảnh FishIN.
                    Cá mua từ trang trại. Cá khỏe mạnh, có nguồn gốc. Chào hàng nào - mua hàng đó.y
                  </p>
                </div>
                <div className="col-lg-2 col-md-6 mb-5 mb-lg-0">
                  <h6 className="fw-bold text-uppercase text-lg text-dark mb-3">Loại hàng</h6>
                  <ul className="list-unstyled">
                    <li><Link className="text-muted" to="#">Cát xây dựng</Link></li>
                  </ul>
                </div>
                <div className="col-lg-2 col-md-6 mb-5 mb-lg-0">
                  <h6 className="fw-bold text-uppercase text-lg text-dark mb-3">Chức năng</h6>
                  <ul className="list-unstyled">
                    <li><Link className="text-muted" to="#">Đăng nhập </Link></li>
                    <li><Link className="text-muted" to="#">Đăng ký </Link></li>
                    <li><Link className="text-muted" to="#">Sản phẩm </Link></li>
                    <li><Link className="text-muted" to="#">Sản phẩm mới </Link></li>
                    <li><Link className="text-muted" to="#">Kiểm tra giỏ hàng </Link></li>
                  </ul>
                </div>
                <div className="col-lg-4">
                  <h6 className="fw-bold text-uppercase text-lg text-dark mb-3">Cập nhập lại email của bạn</h6>
                  <form action="#" id="newsletter-form">
                    <div className="input-group mb-3">
                      <input className="form-control bg-transparent border-secondary border-end-0"
                             type="email" placeholder="Địa chỉ Email của bạn"
                             aria-label="Địa chỉ Email của bạn"/>
                      <div className="input-group-append">
                        <button className="btn btn-outline-secondary border-start-0" type="submit">
                          <i className="fa fa-paper-plane text-lg text-dark"></i></button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div className="py-4 fw-light bg-gray-800 text-gray-300">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-md-6 text-center text-md-start">
                  <p className="mb-md-0">&copy; 2023 FishIN. Đam mê của bạn là niềm vui của chúng tôi.</p>
                </div>
                <div className="col-md-6">
                  <ul className="list-inline mb-0 mt-2 mt-md-0 text-center text-md-end">
                    <li className="list-inline-item"><img className="w-2rem" src="img/visa.svg" alt=""/>
                    </li>
                    <li className="list-inline-item"><img className="w-2rem" src="img/mastercard.svg"
                                                          alt=""/></li>
                    <li className="list-inline-item"><img className="w-2rem" src="img/paypal.svg"
                                                          alt=""/></li>
                    <li className="list-inline-item"><img className="w-2rem" src="img/western-union.svg"
                                                          alt=""/></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </footer>
    )
  }
}
