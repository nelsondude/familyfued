import React from 'react';
import {Meteor} from 'meteor/meteor';
import {withTracker} from "meteor/react-meteor-data";
import {Route, Switch} from "react-router";
import NewGameComponent from "../NewGame";
import GamesComponent from '../Home';
import RegularPlay from "../RegularPlay/RegularPlay";
import FastMoney from "../FastMoney/FastMoney";

import './App.css';
import Navbar from "../../components/Navbar";
import Buzzer from "../Buzzer/Buzzer";

const EverythingButBuzzer = (props) => (
  props.currentUser ?
    <Switch>
      <Route path="/" exact component={GamesComponent}/>
      <Route path="/games/new" component={NewGameComponent}/>
      <Route path="/games/:game_id/regular/:question_num" component={RegularPlay}/>
      <Route path="/games/:game_id/fast/:round_num" component={FastMoney}/>
    </Switch> : <h2>Login to Play!</h2>
);


class App extends React.Component {
  render() {
    return (
      <div className={'App'}>
        <Navbar/>
        <Switch>
          {/*Buzzer doesnt require user to be logged in*/}
          <Route path="/games/:game_id/buzzer" component={Buzzer}/>
          <Route path="/" component={() => <EverythingButBuzzer {...this.props}/>}/>
        </Switch>
      </div>
    )
  }
}

export default withTracker(() => {
  return {
    currentUser: Meteor.user()
  };
})(App);
