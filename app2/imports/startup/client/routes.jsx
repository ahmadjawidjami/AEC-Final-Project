import React from 'react'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'

// containers
import AppContainer from '../../ui/containers/AppContainer'
import MainContainer from '../../ui/containers/MainContainer'

// pages
import SignupPage from '../../ui/pages/SignupPage'
import LoginPage from '../../ui/pages/LoginPage'
import ProfilePage from '../../ui/pages/ProfilePage'
import ProjectsPage from '../../ui/pages/ProjectsPage'

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="login" component={LoginPage}/>
    <Route path="signup" component={SignupPage}/>
    <Route path="/" component={AppContainer}>
      <IndexRoute component={MainContainer}/>
      <Route path="profile" component={ProfilePage}/>
      <Route path="projects" component={ProjectsPage}/>
      // https://stackoverflow.com/questions/42525644/in-react-router-v3-must-all-routes-be-nested-within-a-route-with-path
    </Route>
  </Router>
);