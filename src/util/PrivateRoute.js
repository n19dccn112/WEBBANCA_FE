import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import UserRequire from './UserRequire';
import AuthService from '../services/AuthService';


const PrivateRoute = ({component: Component, ...rest}) => {
  const user = AuthService.getCurrentUser();
  return (
      <Route exact {...rest} render={props => (
          user ? user.role==="ROLE_USER" ? <Component {...props} /> : <UserRequire/>
              : <Redirect to="/customer"/>
      )}/>
  );
};


export default PrivateRoute;