import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

export default class AddProjectComponent extends Component {

  addProject(event) {
      event.preventDefault();
      const title = ReactDOM.findDOMNode(this.refs.title).value.trim();
      const description = ReactDOM.findDOMNode(this.refs.description).value.trim();
      const fundingGoal = parseFloat(ReactDOM.findDOMNode(this.refs.fundingGoal).value.trim());
      const initialSupply = parseInt(ReactDOM.findDOMNode(this.refs.initialSupply).value.trim());
      const availableTokens = parseInt(ReactDOM.findDOMNode(this.refs.availableTokens).value.trim());
      Meteor.call('project.create', title, description, fundingGoal, initialSupply, availableTokens);
      $('#addProjectModal').modal('hide');
      $('#js-create-project-from').get(0).reset();
  }

  render(){
    return (
      <div className="side-button">
        <button type="button" className="btn btn-info btn-sm" data-toggle="modal" data-target="#addProjectModal">
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
                    <form id="js-create-project-from" onSubmit={this.addProject.bind(this)}>
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
                            <label htmlFor="initialSupply">Number of Tokens to create</label>
                            <div className="input-group">
                                <input type="number" ref="initialSupply" className="form-control" step="0" defaultValue="1" placeholder=""/>
                                <span className="input-group-addon">Tokens</span>
                            </div>
                        <div>
                        <div>
                            <label htmlFor="availableTokens">Number of Tokens in the found raising</label>
                            <div className="input-group">
                                <input type="number" ref="availableTokens" className="form-control" step="0" defaultValue="1" placeholder=""/>
                                <span className="input-group-addon">Tokens</span>
                            </div>
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