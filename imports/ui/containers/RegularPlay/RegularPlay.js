import React from 'react';
import {Meteor} from 'meteor/meteor';
import './RegularPlay.css';
import {withRouter} from "react-router";
import Grid from "@material-ui/core/Grid";
import * as _ from 'lodash';
import Button from "@material-ui/core/Button";
import withAudio from "../../hoc/withAudio";
import Question from './Question/Question';
import BuzzerLink from './BuzzerLink/BuzzerLink';
import BuzzerPopup from './BuzzerPopup/BuzzerPopup';
import {objectEmpty} from "../../components/utils";
import WrongAnswer from "./WrongAnswer/WrongAnswer";

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
                <h2>{answer.index + 1}</h2>
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
    show_question: false,
    wrong_answers: 0,
    show_wrong_answer: false,
    include_current_round: false
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
      setTimeout(() => {
        this.setState({can_buzz: true})
      }, 2000)
    });
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

  sum_points = (team, question_num) => {
    const game = JSON.parse(localStorage.getItem(this.game_id));
    if (!game) return 0;
    return game
      .filter((o, i) => o.team === team && i <= question_num)
      .reduce((prev, next) => prev + next.points, 0)
  };

  get red_points() {
    return this.sum_points('red', this.question_num - (+!this.state.include_current_round));
  }

  get red_points_previous() {
    return this.sum_points('red', this.question_num - 1);
  }

  get blue_points() {
    return this.sum_points('blue', this.question_num - (this.state.include_current_round ? 0 : 1));
  }

  get blue_points_previous() {
    return this.sum_points('blue', this.question_num - 1);
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
          sum: 0,
          wrong_answers: 0,
          include_current_round: false
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
        onClick={this.nextQuestion}>Next Question
      </Button>
      {this.question_num > 0 ?
        <Button
          variant={'contained'}
          onClick={this.previousQuestion}>Previous Question
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

  wrongAnswer = () => {
    this.setState(prevState => ({
      wrong_answers: (prevState.wrong_answers + 1),
      show_wrong_answer: true
    }), () => {
      this.props.playWrongShort();
      setTimeout(() => {
        this.setState({show_wrong_answer: false})
      }, 2000)
    })
  };

  clear = () => {
    this.setState({wrong_answers: 0});
  };

  addPoints = (team) => {
    let game = JSON.parse(localStorage.getItem(this.game_id));
    if (!game) {
      game = new Array(10).fill({});
    }
    game[this.question_num] = {
      team,
      points: this.state.sum
    };
    localStorage.setItem(this.game_id, JSON.stringify([...game]));
    this.setState({include_current_round: true}, () => {
      this.forceUpdate();
    });
  };

  render() {
    const {can_buzz, buzzer_side, wrong_answers, question, show_question, sum, key, show_wrong_answer} = this.state;
    return (
      <div className={'RegularPlay'}>
        <div className="team-points team-red">
          <Button
            color={'secondary'}
            variant={'contained'}
            onClick={this.addPoints.bind(this, 'red')}>Add Points to Red</Button>
          <h1>{this.red_points}</h1>
          <h4>Previous Round: {this.red_points_previous}</h4>
        </div>
        <div className="team-points team-blue">
          <Button
            color={'primary'}
            variant={'contained'}
            onClick={this.addPoints.bind(this, 'blue')}>Add Points to Blue</Button>
          <h1>{this.blue_points}</h1>
          <h4>Previous Round: {this.blue_points_previous}</h4>
        </div>

        <BuzzerPopup
          can_buzz={can_buzz}
          buzzer_side={buzzer_side}/>
        <WrongAnswer
          show_wrong_answer={show_wrong_answer}
          wrong_answers={wrong_answers}/>


        <div className="bottom-right-controls">
          <div className="wrong-controls">
            <img src="/ffx.png" alt="" onClick={this.wrongAnswer}/>
            <span onClick={this.clear}>CLEAR X's</span>
          </div>
          <BuzzerLink game_id={this.game_id}/>
        </div>
        <Question
          question={question}
          hideQuestion={this.hideQuestion}
          show_question={show_question}/>

        <h2 style={{marginTop: 0}}>Question {this.question_num + 1}</h2>
        {this.renderSlideQuestions()}
        <span className={'fued-points'}>{sum}</span>
        {!objectEmpty(question) ?
          <GameBoard
            key={key} // new key remounts the component
            sendSumValue={(sum) => this.setState({sum})}
            answers={question.answers}
            {...this.props}
          /> :
          <h4>Loading...</h4>}
      </div>
    )
  }
}

export default withRouter(withAudio(RegularPlay));