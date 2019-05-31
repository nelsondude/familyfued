import React, {Fragment} from 'react';
import {Questions} from '../api/links';
import {Games} from '../api/links';
import { withTracker } from 'meteor/react-meteor-data';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {Route, Switch} from "react-router";
import NewGame from './NewGame';


class Game extends React.Component {

  renderQuestion = () => {
    return this.props.questions.map((question, i) => (
      <Fragment key={i}>
        <h3>{question.text}</h3>
        {question.answers.map((response, j) => (
          <li key={j}>{response.answer} | {response.responses}</li>
        ))}
      </Fragment>
    ))
  };

  render() {
    return (
      <Switch>
        <Route path="/" exact component={Games} />
        <Route path="/games/new" component={NewGame} />
      </Switch>
    )
  }
}

export default withTracker(() => {
  return {
    // games: Games.find({user_id: Meteor.userId()}).fetch()
  }
})(Game);