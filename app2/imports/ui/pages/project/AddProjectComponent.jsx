import React, { Component, PropTypes } from 'react';

export default class AddProjectComponent extends Component {

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