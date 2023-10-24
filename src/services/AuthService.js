import axios from 'axios';
import authHeader from './authHeader';

const AUTH_URL = process.env.REACT_APP_AUTH_URL;

class AuthService {
  login(username, password) {
    return axios.post(AUTH_URL + "login", {username, password})
        .then(response => {
          if (response.data.token) {
            localStorage.setItem("user", JSON.stringify(response.data));
          }
          return response.data;
        });
  }
  changePass(username, oldPassword, password) {
    return axios.post(AUTH_URL + "changePass", {
      "username": username,
      "password": password,
      "oldPassword": oldPassword
    }, {
      headers: authHeader()
    })
        .then(response => {
          return response.data;
        });
  }
  logout() {
    localStorage.removeItem("user");
  }
  register(username, address, phone, password, wardId, districtId, provinceId, email) {
    return axios.post(AUTH_URL + "register", {
      username, address, provinceId, districtId, wardId, phone, email, password
    });
  }
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default new AuthService();
