import React from 'react';
import {Route} from 'react-router-dom';
import AuthService from '../services/AuthService';
import Permit from './Permit';

const AdminRoute = ({component: Component, ...rest}) => {
  const user = AuthService.getCurrentUser();
  return (
      <Route exact {...rest} render={props => (
          user && user.role === "ROLE_SHOP" ?
              <Component {...props} /> :
              <Permit/>
      )}/>
  );
};

export default AdminRoute;