
import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';


export default class BackProjectContainer extends Component {

    constructor(props) {
        super(props);
    }
    backProject(event){
        event.preventDefault();
        console.log('Back Back');
        console.log(this);
        const amountToBack = parseFloat(this.refs.amountToBack.value.trim());
        console.log(amountToBack);
        Meteor.call('project.back', this.props.project._id, amountToBack);
    }

    render() {
        return (
          <div>
            <button type="button" className="btn btn-primary btn-sm side-button" data-toggle="modal" data-target={`#investInProjectModal-${this.props.project._id}`}><span>Invest</span></button>

            <div id={`investInProjectModal-${this.props.project._id}`} className="modal fade" role="dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                        <h4 className="modal-title">Back this Project! {this.props.project.title}</h4>
                    </div>
                    <div className="modal-body">
                        <form id="js-create-project-from" onSubmit={this.backProject.bind(this)}>
                            <div className="form-group">
                                <label htmlFor="amountToBack">Title</label>
                                <div className="input-group">
                                    <input type="text" ref="amountToBack" className="form-control" step="0.000001" defaultValue="1.000000" placeholder="Amount to Back" />
                                    <span className="input-group-addon">Ξ</span>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary">Invest</button>
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

BackProjectContainer.propTypes = {
    project: PropTypes.object.isRequired,
}
