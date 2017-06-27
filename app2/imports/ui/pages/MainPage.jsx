import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Projects } from '../../api/projects';

import ProjectsPage from './ProjectsPage';
import AddProjectComponent from './project/AddProjectComponent';
import OpenProjectsPage from './OpenProjectsPage';
import ProjectsBacked from './ProjectsBacked';

class MainPage extends Component {

    showUserProjects() {
    // return this.props.projects.map((project) => {
        return (
          <ProjectsPage />
        );
    // });
    }

    addProject() {
        return <AddProjectComponent />;
    }

    openProjects() {
        return (
            <OpenProjectsPage />
        );
    }

    projectsBacked() {
      return (
        <ProjectsBacked />
      )
    }

    render() {
        return (
          <div>
            <div className="container">
              <ul className="nav nav-tabs">
                <li className="active"><a data-toggle="tab" href="#projects">My Projects</a></li>
                <li><a data-toggle="tab" href="#exploreProjects">Explore</a></li>
                <li><a data-toggle="tab" href="#backedProjects">Backed</a></li>
              </ul>
              <div className="tab-content">
                <div id="projects" className="tab-pane fade in active">
                  {this.addProject()}
                  {this.showUserProjects()}
                </div>
                <div id="exploreProjects" className="tab-pane fade">
                   {this.openProjects()}
                </div>
                <div id="backedProjects" className="tab-pane fade">
                  {this.projectsBacked()}
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
        projects: Projects.find({}, { sort: { createdAt: -1 } }).fetch(),
        currentUser: Meteor.user(),
    };
}, MainPage);
