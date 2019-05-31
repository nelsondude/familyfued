import { Mongo } from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const Links = new Mongo.Collection('links');
export const Questions = new Mongo.Collection('questions');
export const Games = new Mongo.Collection('games');


Questions.before.insert(function (userId, doc) {
  if(Meteor.isServer) {
    //Format the document
    doc.createdAt = Date.now();
    doc.updatedAt = Date.now();
  }
});

Questions.before.update(function(userId, doc) {
  if(Meteor.isServer) {
    doc.updatedAt = Date.now();
  }
});