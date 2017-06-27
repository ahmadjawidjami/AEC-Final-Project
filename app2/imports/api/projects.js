import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Match, check } from 'meteor/check';

// TODO: Check this export
export const Projects = new Mongo.Collection('projects');

if (Meteor.isServer) {
  Meteor.publish('projects', () => {
      return Projects.find({
            // Return all the projects
        });
    });
}

Meteor.methods({
    'project.create': function(title, description, fundingGoal, initialSupply, availableTokens) {
        check(title, String);
        check(description, String);
        check(fundingGoal, Number);
        check(initialSupply, Match.Integer);
        check(availableTokens, Match.Integer);

        if (title === '') {
            throw new Error('Not possible. Please add the title');
        }

        if (!Meteor.userId()) {
            throw new Meteor.Error('Not Authorized. Please log in');
        }

        Projects.insert({
            title,
            description,
            fundingGoal,
            fundingRaised: 0,
            owner: Meteor.userId(),
            createdAt: new Date(),
            initialSupply,
            availableTokens,
            status: 'open',
            funds: [],
        });
    },
    'project.delete': function(projectId) {
        check(projectId, String);
        // I retrieve the project in order to know the owner
        const project = Projects.findOne({ _id: projectId });
        if (project.owner !== Meteor.userId()) {
            throw new Meteor.Error('Not Authorized. Not your project');
        }
        Projects.remove({ _id: projectId });
    },
    'project.back': function(projectId, amount) {
        check(projectId, String);
        check(amount, Number);
        console.log(projectId, amount, "HELLO");
        if (!Meteor.userId()) {
            throw new Meteor.Error('Not Authorized. Who are you? Login');
        }
        
        const thisProject = Projects.findOne({ _id: projectId });
        let fundingRaised = thisProject.fundingRaised;

        if (fundingRaised === thisProject.fundingGoal) {
            throw new Meteor.Error('Sorry, Project closed')
        }
        fundingRaised += amount;

        if (fundingRaised > thisProject.fundingGoal) {
            throw new Meteor.Error(`You can insert maximum ${thisProject.fundingGoal - thisProject.fundingRaised}Ξ`);
        }

        console.log(projectId);
        console.log(Meteor.userId());
        Projects.update({ _id: projectId }, { $push: { funds: { backer: Meteor.userId(), amount } } });
        Projects.update({ _id: projectId }, { $set: { fundingRaised } });
        console.log('done');
    }
});
