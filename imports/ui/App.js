import React from 'react';
import Game from './Game';
import AccountsUIWrapper from './AccountsUIWrapper.js';
import {Meteor} from 'meteor/meteor';
import {withTracker} from "meteor/react-meteor-data";
import {Questions} from "../api/links";


class App extends React.Component {
  render() {
    return (
      <div>
        <AccountsUIWrapper/>
        <h1>Welcome to Meteor!</h1>
        {this.props.currentUser ? <Game/> : <h2>Login to Play!</h2>}
      </div>
    )
  }
};

export default withTracker(() => {
  return {
    currentUser: Meteor.user()
  };
})(App);
