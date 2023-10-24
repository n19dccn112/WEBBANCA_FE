import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import AuthService from "../services/AuthService";
import {routes} from "../const/routes";
import SearchInput from "./productpage/SearchInput";
import CartService from "../services/CartService";
import {get} from "../api/callAPI";

class Header extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);
  }
  curruser = AuthService.getCurrentUser();
  nav = routes.map(({path, name, pub, sub, user, admin}, key) =>
      (pub ||
          ((this.curruser && user && this.curruser.role === 'ROLE_USER' && (name !== 'Đơn hàng' && path !== '/checkout')) ||
              (this.curruser && this.curruser.role === 'ROLE_SHOP' && admin && (path !== '/cart' && path !== '/checkout')))
      ) &&
      (<li key={key} className={sub.length > 0 ? 'nav-item dropdown' : 'nav-item'}>
        <a className={sub.length > 0 ? 'nav-link dropdown-toggle' : 'nav-link'}
            id="homeDropdownMenuLink"
            onClick={() => this.handleClick(path)}>{name}</a>
      </li>));

  logOut() {
    AuthService.logout();
    window.location.href = '/';
  }

  handleClick = (targetUrl) => {
    if (window.location.pathname === targetUrl) {
      window.location.reload();
    } else {
      window.location.href = targetUrl;
    }
  };

  render() {
    return (
        <header className='header background-header'>
          <nav
              className="navbar navbar-expand-lg bg-transparent navbar-sticky navbar-airy navbar-light bg-hover-white navbar-hover-light navbar-fixed-light">
            <div className="container-fluid on-header">
              <div className="text-primary" style={{marginLeft : '20px' }}>
                <div className="css-row">
                  <img src="https://tourneyx.com/app/lib/uploads/angler_uploads/22338_1600564048_9530a113c62ad9c0b5591a5920ace55a.jpg?d=1614829692" width="80px" height="80px" alt="product"/>
                  <SearchInput/>
                  <div className="recently-viewed">
                    <a className="viewed-button"
                       href={`/IsLoveOrSeenPage/${1}`}>
                      Đã xem <i className="fa fa-chevron-down"></i>
                    </a>
                  </div>
                  <div className="favorite">
                    <a className="favorite-button"
                       href={`/IsLoveOrSeenPage/${0}`}>
                      <i className="fa fa-heart"></i> Yêu thích
                    </a>
                  </div>
                  <div className="login-icons">
                    <i className="fa fa-user larger-icon"/>
                    <div>
                      {this.curruser && (this.curruser.role === 'ROLE_USER' || this.curruser.role === 'ROLE_SHOP') &&
                          <div className="login-links">
                          <a href="/customer"
                             onClick={(e) => this.logOut()}>{this.curruser.username}</a>
                          <a href="/profile">Hồ sơ</a>
                          </div>
                      }
                      {!this.curruser &&
                          <a href="/customer">Tài khoản</a>}
                    </div>
                  </div>
                  {this.curruser && this.curruser.role === 'ROLE_USER' &&
                  <div className="cart">
                    <div className="logo">
                      {/* Thẻ logo */}
                    </div>
                    <a className="cart" href="/cart">
                      <i className="fa fa-shopping-cart" href></i>
                      <span className="cart-count">{CartService.getTotalCart()}</span>
                    </a>
                  </div>}
                </div>
                <div className="collapse navbar-collapse mx-auto_0 background-header-on" id="navbarCollapse">
                  <ul className="title navbar-nav mx-auto">
                    {this.nav}
                    {this.curruser && <li className='nav-item'>
                      {/*<a className='title nav-link' href="/customer" onClick={(e) => this.logOut()}>Đăng xuất</a>*/}
                    </li>}
                  </ul>
                </div>
              </div>
            </div>
          </nav>
        </header>
    );
  }

}

export default Header;

