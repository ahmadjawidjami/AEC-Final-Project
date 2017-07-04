import React, { Component, PropTypes } from 'react';


import ProjectComponent from './project/ProjectComponent';

export default class ProjectsPage extends Component {

    constructor() {
        super();
    }


    getMyProjects() {
        
        // const myProjects = Projects.find({ owner: Meteor.userId() }).fetch();
        // return myProjects.map((myProject) => {
        //   return (
        //     <ProjectComponent 
        //         key={myProject._id}
        //         project={myProject}
        //         type="myProjects"
        //     />
        //   );
        // });
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
