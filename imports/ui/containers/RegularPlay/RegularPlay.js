import React from 'react';
import {Meteor} from 'meteor/meteor';
import './RegularPlay.css';
import {withRouter} from "react-router";
import Grid from "@material-ui/core/Grid";
import * as _ from 'lodash';
import Button from "@material-ui/core/Button";
import withAudio from "../../hoc/withAudio";
import Question from './Question/Question';
import BuzzerLink from './BuzzerLink';
import BuzzerPopup from './BuzzerPopup/BuzzerPopup';
import {objectEmpty} from "../../components/utils";

class GameBoard extends React.Component {
  state = {
    answers: []
  };

  componentDidMount() {
    this.setState({
      answers: _.map(this.props.answers, (element, i) => ({...element, show: false, index: i}))
    });
  }

  toggleAnswer = (i) => {
    let new_answers = [...this.state.answers];
    new_answers[i].show = !new_answers[i].show;
    if (new_answers[i].show) {
      new_answers[i].index === 0 ? this.props.playNumberOne() : this.props.playRight();
    }
    this.setState({answers: new_answers}, () => {
      const filtered = new_answers.filter(value => value.show === true);
      const summed = filtered.reduce((prev, next) => prev + next.responses, 0);
      this.props.sendSumValue(summed);
    });
  };

  renderPanelColumn = (answers) => (
    answers.map(answer => {
      return (
        <Grid item key={answer.index}>
          <div className="fued-result" onClick={this.toggleAnswer.bind(this, answer.index)}>
            <div className="flip-panel" style={{transform: answer.show ? "rotateX(180deg)" : "rotateX(0)"}}>
              <div className="panel-front">
                <h1>{answer.index + 1}</h1>
              </div>
              <div className="panel-back">
                <span className={'panel-answer'}>{answer.answer}</span><span
                className={'points'}>{answer.responses}</span>
              </div>
            </div>
          </div>
        </Grid>
      )
    })
  );

  render() {
    return (
      <div className={'board'}>
        <Grid container>
          <Grid item xs={6}>
            {this.renderPanelColumn(this.state.answers.slice(0, 4))}
          </Grid>
          <Grid item xs={6}>
            {this.renderPanelColumn(this.state.answers.slice(4, 8))}
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
    questions: [],
    sum: 0,
    key: 0,
    buzzer_side: null,
    can_buzz: true,
    show_question: false
  };

  get question_num() {
    return parseInt(this.props.match.params.question_num);
  }

  get game_id() {
    return this.props.match.params.game_id;
  }

  buzz = (side) => {
    this.setState({
      buzzer_side: side,
      can_buzz: false,
      show_question: false
    }, () => {
      this.props.playBuzzIn();
    });
    setTimeout(() => {
      this.setState({can_buzz: true})
    }, 2000)
  };

  componentDidMount() {
    this.getNewQuestion(this.question_num);
    this.props.pause();

    Streamy.on(this.game_id, (data) => {
      if (this.state.can_buzz) {
        this.buzz(data.side)
      }
    });
  }

  getNewQuestion = (question_num) => {
    this.props.history.push(`/games/${this.game_id}/regular/${question_num}`);  // change address bar route
    Meteor.call('join_questions', this.game_id, (error, result) => {
      if (error) console.log(error);
      else {
        const data = result[0]; // single element array
        let question = {...data.questions[question_num]};
        question.answers = _.sortBy(question.answers, ['responses']).reverse();
        this.setState({
          num_questions: data.questions.length,
          question,
          title: data.title,
          questions: data.questions,
          key: this.state.key + 1,  // change key of child to remount component
          sum: 0
        });
      }
    });
  };

  nextQuestion = () => {
    this.getNewQuestion(this.question_num + 1);
  };

  previousQuestion = () => {
    this.getNewQuestion(this.question_num - 1);
  };

  startFastMoney = () => {
    this.props.history.push(`/games/${this.game_id}/fast/1`);
  };

  showQuestion = () => {
    this.setState({show_question: true})
  };

  hideQuestion = () => {
    this.setState({show_question: false});
  };

  renderSlideQuestions = () => (
    <div className={'button-group'}>
      <Button
        variant={'contained'}
        style={{
          float: 'right'
        }}
        disabled={this.question_num >= this.state.num_questions - 1}
        onClick={this.nextQuestion}>Next Slide
      </Button>
      {this.question_num > 0 ?
        <Button
          variant={'contained'}
          onClick={this.previousQuestion}>Previous Slide
        </Button> : null}
      <Button
        variant={'contained'}
        onClick={this.showQuestion}>
        Show Question
      </Button>
      {this.question_num === 9 ?
        <Button
          variant={'contained'}
          onClick={this.startFastMoney}>
          Start Fast Money
        </Button> : null}
    </div>
  );

  render() {
    return (
      <div className={'RegularPlay'}>
        <BuzzerPopup
          can_buzz={this.state.can_buzz}
          buzzer_side={this.state.buzzer_side}/>
        <BuzzerLink game_id={this.game_id}/>
        <Question
          question={this.state.question}
          hideQuestion={this.hideQuestion}
          show_question={this.state.show_question}/>
        {this.renderSlideQuestions()}
        <span className={'fued-points'}>{this.state.sum}</span>
        {!objectEmpty(this.state.question) ?
          <GameBoard
            key={this.state.key} // new key remounts the component
            sendSumValue={(sum) => this.setState({sum})}
            answers={this.state.question.answers}
            {...this.props}
          /> :
          <h4>Loading...</h4>}
      </div>
    )
  }
}

export default withRouter(withAudio(RegularPlay));