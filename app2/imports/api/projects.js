import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Match, check } from 'meteor/check';

// TODO: Check this export
export const Projects = new Mongo.Collection('projects');

if (Meteor.isServer) {
    Meteor.publish('projects', function projectsPublication() {
        return Projects.find({
            // Return all the projects
        });
    });
}

Meteor.methods({
    'projects.create'(title, description, fundingGoal) {
        check(title, String);
        check(description, String);
        check(fundingGoal, Match.Integer);

        if(!Meteor.userId()) {
            throw new Meteor.Error('Not Authorized. Please log in');
        }

        Projects.insert({
            title,
            description,
            fundingGoal,
            createdAt: new Date,
        });
    },
})