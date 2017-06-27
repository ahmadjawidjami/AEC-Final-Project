import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { browserHistory, Link } from 'react-router';
import { Accounts } from 'meteor/accounts-base';

// TrackerReact is imported (default) with Meteor 1.3 new module system
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import { Projects } from '../../api/projects';
import ProjectComponent from './project/ProjectComponent';

export default class ProjectsPage extends TrackerReact(React.Component) {

    constructor() {
        super();
        this.state = {
            subscription: {
                projects: Meteor.subscribe('projects'),
            },
        };
    }

    componentWillUnmount() {
        this.state.subscription.projects.stop();
	}

    getMyProjects() {
        const myProjects = Projects.find({ owner: Meteor.userId() }).fetch();
        return myProjects.map((myProject) => {
          return (
            <ProjectComponent 
                key={myProject._id}
                project={myProject}
                type="myProjects"
            />
          );
        });
    }
    render() {
        return (
          <div>
            <h2>Projects</h2>
            <div>
                { this.getMyProjects() }
            </div>
          </div>
        );
    }
}
