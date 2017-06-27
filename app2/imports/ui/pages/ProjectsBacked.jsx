import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';

import { Projects } from '../../api/projects.js';
import ProjectComponent from './project/ProjectComponent';

export default class ProjectsPage extends Component {

    getBackedProjects() {
        let projectsBacked = [];
        const openProjects = Projects.find().fetch();
        for (let project of openProjects){

            if(project.funds) {
                console.log(project);
                for (let fund of project.funds) {
                    if(fund.backer === Meteor.userId()) {
                        if (!projectsBacked[project._id]) {
                            // create the value in the array
                            projectsBacked[project._id] = [];
                            console.log(project._id);
                        }
                        projectsBacked[project._id] = fund;
                    }
                }
            }
        }
        console.log(projectsBacked['WCKSi3Yw4KXP99zym']);
        const renderArray = [];

        for (projectBacked in projectsBacked) {
            console.log(projectBacked);
            const project = Projects.findOne({ _id: projectBacked});
            renderArray.push(
                <ProjectComponent 
                    key={projectBacked}
                    project={project}
                    funds={projectsBacked[projectBacked]}
                    type="backed"
                />
            );
        }
        console.log(renderArray);
        return renderArray;

    }

    render() {
        return <div>
            <h1>Backed Projects</h1>
            {this.getBackedProjects()}
        </div>;
    }
}
