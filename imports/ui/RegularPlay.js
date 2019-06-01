import React, {Fragment} from 'react';
import {Meteor} from 'meteor/meteor';
import './RegularPlay.css';
import {withRouter} from "react-router";
import Grid from "@material-ui/core/Grid";
import * as _ from 'lodash';
import Button from "@material-ui/core/Button";

class GameBoard extends React.Component {
  state = {
    answers: []
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      answers: _.map(this.props.answers, (element, i) => ({...element, show: false, index: i}))
    });
  }

  toggleAnswer = (i) => {
    let new_answers = [...this.state.answers];
    new_answers[i].show = !new_answers[i].show;
    this.setState({answers: new_answers});
  };

  renderPanelColumn = (answers) => {
    return (
      answers.map((answer, i) => {
        return (
          <Grid item key={answer.index}>
            <div className="fued-result" onClick={this.toggleAnswer.bind(this, answer.index)} >
              <div className="flip-panel" style={{transform: answer.show ? "rotateX(180deg)" : "rotateX(0)"}}>
                <div className="panel-front">
                  <h1>{answer.index + 1}</h1>
                </div>
                <div className="panel-back">
                  <h1>{answer.answer} | {answer.responses}</h1>
                </div>
              </div>
            </div>
          </Grid>
        )
      })
    )
  }

  render() {
    const first_five = this.state.answers.slice(0, 5);
    const last_five = this.state.answers.slice(5, 10);
    return (
      <div>
        <Grid container>
          <Grid item xs={6}>
            {this.renderPanelColumn(first_five)}
          </Grid>
          <Grid item xs={6}>
            {this.renderPanelColumn(last_five)}
          </Grid>
        </Grid>
      </div>
    )
  }
}


class RegularPlay extends React.Component {
  state = {
    question: {},
    title: "",
    num_questions: 0,
    questions: []
  };

  componentDidMount() {
    const {question_num} = this.props.match.params;
    this.getNewQuestion(question_num);
  }

  getNewQuestion = (question_num) => {
    const {game_id} = this.props.match.params;
    Meteor.call('join_questions', game_id, (error, result) => {
      if (error) console.log(error);
      else {
        const data = result[0]; // single element array
        this.setState({
          num_questions: data.questions.length,
          question: data.questions[parseInt(question_num)], // 0 indexing
          title: data.title,
          questions: data.questions
        }, () => this.forceUpdate());
      }
    });
  };

  nextQuestion = () => {
    const {game_id, question_num} = this.props.match.params;
    const new_num = parseInt(question_num) + 1;
    this.props.history.push(`/games/${game_id}/regular/${new_num}`);
    this.getNewQuestion(new_num);
  };

  previousQuestion = () => {
    const {game_id, question_num} = this.props.match.params;
    const new_num = parseInt(question_num) - 1;
    this.props.history.push(`/games/${game_id}/regular/${new_num}`);
    this.getNewQuestion(new_num);
  };


  render() {
    let {question_num} = this.props.match.params;
    question_num = parseInt(question_num);
    return (
      <div className={'RegularPlay'}>
        <Grid>
          <Button
            variant={'contained'}
            disabled={question_num <= 0}
            onClick={this.previousQuestion}>Previous Slide</Button>
          <Button
            variant={'contained'}
            disabled={question_num >= this.state.num_questions - 1}
            onClick={this.nextQuestion}>Next Slide</Button>
        </Grid>
        {Object.keys(this.state.question).length > 0 ?
          <Fragment>
            <h1>{this.state.title}</h1>
            <h4>Question #{question_num+1}: {this.state.question.text}</h4>
            {Object.keys(this.state.question).length > 0 ? <GameBoard answers={this.state.question.answers}/> :
              <h4>Loading...</h4>}
          </Fragment> : <h3>Loading...</h3>}
      </div>
    )
  }
}

export default withRouter(RegularPlay);