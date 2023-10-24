import logo from './logo.svg';
import React, {Component} from 'react';

import Footer from './pages/Footer';

import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {routes} from './const/routes';
import Header from './pages/Header';
import AuthService from './services/AuthService';
import AdminRoute from './util/AdminRoute';
import PrivateRoute from './util/PrivateRoute';
import {get} from './api/callAPI';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAdminBoard: false,
      currentUser: undefined,
      routeComponents: undefined,
    };
  }
  componentDidMount() {
    const user = AuthService.getCurrentUser();
    this.setState({
      routeComponents: routes.map(({path, component, user, admin}, key) =>
          (
              user ? <PrivateRoute exact path={path} component={component} key={key}/> :
                  admin ? <AdminRoute path={path} component={component} key={key}/> :
                      <Route exact path={path} component={component} key={key}/>
          )
      ),
    });

  }
  render() {
    return (
        <>
          <Router>
            <Header/>
            <Switch>
              {this.state.routeComponents}
            </Switch>
            <Footer/>
          </Router>
        </>
    );
  }
}
export default App;