import React from 'react';
import AccountsUIWrapper from './AccountsUIWrapper.js';
import {Meteor} from 'meteor/meteor';
import {withTracker} from "meteor/react-meteor-data";
import {Route, Switch} from "react-router";
import NewGameComponent from "./NewGame";
import GamesComponent from './GamesComponent';
import {Link} from "react-router-dom";
import RegularPlay from "./RegularPlay";


class App extends React.Component {
  render() {
    return (
      <div>
        <AccountsUIWrapper/> &nbsp;&nbsp;
        <Link to={'/'}>Home</Link>
        <hr/>
        {this.props.currentUser ?
          <Switch>
            <Route path="/" exact component={GamesComponent}/>
            <Route path="/games/new" component={NewGameComponent}/>
            <Route path="/games/:game_id/regular/:question_num" component={RegularPlay}/>
          </Switch>
          :
          <h2>Login to Play!</h2>}
      </div>
    )
  }
};

export default withTracker(() => {
  return {
    currentUser: Meteor.user()
  };
})(App);
