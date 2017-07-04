import React, { Component, PropTypes } from 'react';


// import BackProjectComponent from './BackProjectContainer';

// Task component - represents a singel todo Item
export default class ProjectComponent extends Component {
    

    deleteProject() {
        // Meteor.call('project.delete', this.props.project._id);
    }

    projectOwner() {
        if (this.props.type === "myProjects" && this.props.project.owner === Meteor.userId()) {
            return (<button type="button" className="btn btn-danger btn-xs side-button" onClick={this.deleteProject.bind(this)}><span>&times;</span></button>);
        }
        return '';
    }

    backProject() {
        // if (this.props.type === "openProject") {
        //     return (<BackProjectComponent
        //       key={this.props.project._id}
        //       project={this.props.project}
        //     />);
        // }
        return '';
    }
    myFunds() {
        if (this.props.type === "backed") {
            return this.props.funds
        }
    }

    render() {
        return (
          <div className="panel panel-default">
            <div className="panel-body">
                {this.projectOwner()}
                {this.backProject()}
                <h2>{ this.props.project.title }</h2>
                <div>
                    Backed 
                    <p>{this.props.project.fundingRaised}</p>/<p>{this.props.project.fundingGoal}</p>
                    {JSON.stringify(this.myFunds())}
                </div>
            </div>
          </div>
        );
    }
}

ProjectComponent.propTypes = {
    project: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
};
