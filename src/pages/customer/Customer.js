import React, {Component} from 'react'
import Login from './Login'
import Register from './Register'

export default class Customer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalComponent: <> </>,
    }
  }
  openModal(e) {
    e.preventDefault();
    console.log("openModal")
    this.setState({
      modalComponent: <Register/>
    })
  }
  render() {
    return (
        <>
          <section className="hero">
            <div className="">
              <div className="hero-content pb-5 text-center">
                <h1 className="hero-heading mb-0">Khu vực khách hàng</h1>
              </div>
            </div>
          </section>
          <section>
            <div className="container1">
                <div style={{marginRight: "-600px", marginLeft: "20px"}}>
                  <Login/>
                </div>
                <div className="col-12 container1">
                  <img
                      src="https://icandywebs.com/images/article-images/website-maintenance/questions-avatar-3.jpg"
                      width="300px" height="350px" alt="product"/>
                  <div>
                    <p className="lead justify-content-center">Bạn chưa có tài khoản?</p>
                    <a className="btn btn-outline-dark btn-product-right d-none d-sm-inline-block "
                       onClick={(e) => this.openModal(e)}
                       data-bs-toggle="modal"
                       data-bs-target="#modalRegister">
                      <i className="fa fa-sign-in-alt "></i> Đăng ký
                    </a>
                  </div>
                </div>
            </div>
          </section>
          {this.state.modalComponent}
        </>
    )
  }
}
