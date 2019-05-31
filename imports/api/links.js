import { Mongo } from 'meteor/mongo';

export const Links = new Mongo.Collection('links');
export const Questions = new Mongo.Collection('questions');
export const Games = new Mongo.Collection('games');
