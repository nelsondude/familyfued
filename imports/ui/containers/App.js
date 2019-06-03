import React from 'react';
import AccountsUIWrapper from '../components/AccountsUIWrapper.js';
import {Meteor} from 'meteor/meteor';
import {withTracker} from "meteor/react-meteor-data";
import {Route, Switch} from "react-router";
import NewGameComponent from "./NewGame";
import GamesComponent from './Home';
import {Link} from "react-router-dom";
import RegularPlay from "./RegularPlay/RegularPlay";
import FastMoney from "./FastMoney";


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
            <Route path="/games/:game_id/fast/:round_num" component={FastMoney}/>
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
