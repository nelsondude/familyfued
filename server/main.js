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
          $addFields: {
            question: {$arrayElemAt: ["$question", 0]},
          }
        },
        {
          $group: {
            _id: {_id: "$_id", title: "$title", fast_money: "$fast_money_questions"},
            questions: {$push: "$question"}
          }
        },
        {$unwind: "$_id.fast_money"},
        {
          $lookup: {
            from: 'questions',
            localField: '_id.fast_money',
            foreignField: '_id',
            as: 'fast_money'
          }
        },
        {
          $addFields: {
            fast_money: {$arrayElemAt: ["$fast_money", 0]},
          }
        },
        {
          $group: {
            _id: {_id: "$_id._id", questions: "$questions", title: "$_id.title"},
            fast_money: {$push: "$fast_money"}
          }
        },
        {
          $project: {
            _id: "$_id._id",
            title: "$_id.title",
            fast_money: 1,
            questions: "$_id.questions"
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
