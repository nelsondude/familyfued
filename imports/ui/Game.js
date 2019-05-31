import React, {Fragment} from 'react';
import {Questions} from '../api/links';
import { withTracker } from 'meteor/react-meteor-data';


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
    const question = this.renderQuestion();
    return (
      <div>
        <h1>Questions Here</h1>
        {question}
      </div>
    )
  }
}


export default withTracker(() => {
  return {
    questions: Questions.find().fetch()
  }
})(Game);