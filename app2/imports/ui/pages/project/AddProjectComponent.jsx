import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

export default class AddProjectComponent extends Component {

  addProject(event) {
      event.preventDefault();
      let title = ReactDOM.findDOMNode(this.refs.title).value.trim();
      let description = ReactDOM.findDOMNode(this.refs.description).value.trim();
      let fundingGoal = parseFloat(ReactDOM.findDOMNode(this.refs.fundingGoal).value.trim());
      Meteor.call('project.create', title, description, fundingGoal);
      $('#addProjectModal').modal('hide');
  }

  render(){
    return (
      <div>
        <button type="button" className="btn btn-info btn-lg" data-toggle="modal" data-target="#addProjectModal">
            Fund new Project!
        </button>
        
        <div id="addProjectModal" className="modal fade" role="dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                    <h4 className="modal-title">Fund new Project</h4>
                </div>
                <div className="modal-body">
                    <p>Compile here</p>
                    <form onSubmit={this.addProject.bind(this)}>
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input type="text" ref="title" className="form-control" placeholder="Enter the title of the project" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <input type="text" ref="description" className="form-control" placeholder="Enter the description of the project" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="fundingGoal">Funding Goal</label>
                            <div className="input-group">
                                <input type="number" ref="fundingGoal" className="form-control" step="0.000001" defaultValue="1.000000" placeholder="Enter the amount of money you want to raise"/>
                                <span className="input-group-addon">Ξ</span>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
      </div>
    );
  }
}