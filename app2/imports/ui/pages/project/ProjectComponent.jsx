import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';


// Task component - represents a singel todo Item
export default class Task extends Component {

    deleteThisProject() {
        Meteor.call('projects.remove', this.props.project._id);
    }

    render() {

        return (
            <li>
              {this.props.project.title}
            </li>
        )
    }
}

Task.propTypes = {
    project: PropTypes.object.isRequired,
}