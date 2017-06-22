import React, { Component, PropTypes } from 'react';
import { browserHistory, Link } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';

import { Projects } from '../../api/projects';

import ProjectsPage from './ProjectsPage';
import AddProjectComponent from './project/AddProjectComponent';

class MainPage extends Component {
  
  showUserProjects(){
    //return this.props.projects.map((project) => {
      return (
          <ProjectsPage />
      )
    //});
  }

  addProject() {
    return <AddProjectComponent />
  }

  render(){
    return (
      <div>
        <div className="container">
          <ul className="nav nav-tabs">
            <li className="active"><a data-toggle="tab" href="#projects">My Projects</a></li>
            <li><a data-toggle="tab" href="#backe">Investments</a></li>
          </ul>
          <div className="tab-content">
            <div id="projects" className="tab-pane fade in active">
              {this.addProject()}
              {this.showUserProjects()}
            </div>
            <div id="backe" className="tab-pane fade">
              Backes
            </div>
          </div>
        </div>
      </div>
    );
  }
}

MainPage.PropTypes = {
};

export default createContainer(() => {
  Meteor.subscribe('projects');

  return {
    projects: Projects.find({}, { sort: {createdAt: -1 } }).fetch(),
    currentUser: Meteor.user(),
  }
}, MainPage);