import { Meteor } from 'meteor/meteor';
import { Match, check } from 'meteor/check';

import Projects from '../imports/api/projects';

import interaction from '../imports/api/interaction';

Meteor.startup(() => {
  // code to run on server at startup
});


// Meteor.methods({
//     'gigi': function(number) {
//         check(number, Number);
//         console.log(number);
//         console.log(interaction);
//         return 10;
//     },
// });