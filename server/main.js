import { Meteor } from 'meteor/meteor';
import {Games, Questions} from '/imports/api/links';

function insertLink(title, url) {
  Links.insert({ title, url, createdAt: new Date() });
}

Meteor.startup(() => {
  Meteor.methods({
    async join_questions(game_id) {
      const pipeline = [
        {$match: {_id: game_id}},
        {$unwind: "$regular_questions"},
        {
          $lookup: {
            from: 'questions',
            localField: 'regular_questions',
            foreignField: '_id',
            as: 'question'
          }
        },
        {
          $project: {
            title: 1,
            question: {$arrayElemAt: ["$question", 0]}
          }
        },
        {
          $group: {
            _id: {_id: "$_id", title: "$title"},
            questions: {$push: "$question"}
          }
        },
        {
          $project: {
            questions: 1,
            _id: "$_id._id",
            title: "$_id.title"
          }
        }
      ];
      return await Games.rawCollection().aggregate(
        pipeline
      ).toArray(); // get first element
    }
  });
});


// {$sort: {_id: -1}}
