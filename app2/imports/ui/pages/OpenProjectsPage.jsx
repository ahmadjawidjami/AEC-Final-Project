import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';


import { Projects } from '../../api/projects';
import ProjectComponent from './project/ProjectComponent';

export default class ProjectsPage extends Component {

    getOpenProjects() {
        const openProjects = Projects.find({ owner: { $ne: Meteor.userId() }, status: 'open' }).fetch();
        return openProjects.map((openProject) => {
          return (
            <ProjectComponent 
                key={openProject._id}
                project={openProject}
                type="openProject"
            />
          );
        });
    }

    activateLasers() {
        Meteor.call('gigi', 1, (err, succ) => {
            console.log(succ);
        });
    }

    render() {
        return (
          <div>
            <h2>Projects</h2>
            <button onClick={this.activateLasers}> Activate Lasers </button>
            <div>
                { this.getOpenProjects() }
            </div>
          </div>
        );
    }
}
