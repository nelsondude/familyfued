import React, {Fragment} from 'react';
import {Meteor} from 'meteor/meteor';
import './RegularPlay.css';
import {withRouter} from "react-router";
import Grid from "@material-ui/core/Grid";
import * as _ from 'lodash';
import Button from "@material-ui/core/Button";
import withAudio from "../../hoc/withAudio";
import QRCode from 'qrcode.react';
import Fab from "@material-ui/core/Fab";
import CloseIcon from "@material-ui/icons/Close";
import Modal from "@material-ui/core/Modal";

class GameBoard extends React.Component {
  state = {
    answers: []
  }

  componentDidMount() {
    this.setState({
      answers: _.map(this.props.answers, (element, i) => ({...element, show: false, index: i}))
    });
  }

  // componentWillReceiveProps(nextProps, nextContext) {
  //   if (!_.isEqual(nextProps.answers, this.props.answers)) {
  //     this.mapAnswers();
  //   }
  // }

  toggleAnswer = (i) => {
    let new_answers = [...this.state.answers];
    new_answers[i].show = !new_answers[i].show;
    if (new_answers[i].show) {
      new_answers[i].index === 0 ? this.props.playNumberOne() : this.props.playRight();
    }
    this.setState({answers: new_answers}, () => {
      const filtered = new_answers.filter(value => value.show === true);
      const summed = filtered.reduce((prev,next) => prev + next.responses,0);
      this.props.sendSumValue(summed);
    });
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
                  <span className={'panel-answer'}>{answer.answer}</span><span className={'points'}>{answer.responses}</span>
                </div>
              </div>
            </div>
          </Grid>
        )
      })
    )
  };

  render() {
    const first_five = this.state.answers.slice(0, 4);
    const last_five = this.state.answers.slice(4, 8);
    return (
      <div className={'board'}>
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
      // console.log('A broadcast message', data);
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

  render() {
    const fast_button = (
      <Grid container>
        <Button
          variant={'contained'}
          onClick={this.startFastMoney}>
          Start Fast Money
        </Button>
      </Grid>
    );

    const buzzer = (
      this.state.can_buzz ? null
        :
        <div className={'buzzer'} style={{background: this.state.buzzer_side}}>
          <h1>Team {this.state.buzzer_side}</h1>
        </div>
    );

    const question = (
      <Modal
        id={'modal'}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={this.state.show_question}
        onClose={this.hideQuestion}
      >
        <div className={'question'}>
          <Fab color="primary" aria-label="Add" onClick={this.hideQuestion} style={{float: 'right'}}>
            <CloseIcon/>
          </Fab>

          <h1>Question: {this.state.question.text}</h1>
        </div>

      </Modal>
    );

    const url = new URL(window.location.href);
    const qr_url = url.origin + '/games/' + this.game_id + '/buzzer';
    // console.log(qr_url)
    const qrcode = (
      <div className={'qrcode'}>
        <a href={qr_url} target="_blank">
          <h3>Buzzer Link</h3>
        </a>
        <QRCode value={qr_url} />
      </div>
    );
    return (
      <div className={'RegularPlay'}>
        {buzzer}
        {qrcode}
        {question}
        <Grid>
          <Button
            variant={'contained'}
            disabled={this.question_num <= 0}
            onClick={this.previousQuestion}>Previous Slide</Button>
          <Button
            variant={'contained'}
            style={{
              float: 'right'
            }}
            disabled={this.question_num >= this.state.num_questions - 1}
            onClick={this.nextQuestion}>Next Slide</Button>
          <br/>
          <Button
            variant={'contained'}
            onClick={this.showQuestion}>
            Show Question
          </Button>
        </Grid>
        {Object.keys(this.state.question).length > 0 ?
          <Fragment>
            {/*<h1>{this.state.title}</h1>*/}
            {/*<h4>Question #{this.question_num+1}: {this.state.question.text}</h4>*/}
            <span className={'fued-points'}>{this.state.sum}</span>
            {Object.keys(this.state.question).length > 0 ?
              <GameBoard
                key={this.state.key} // new key remounts the component
                sendSumValue={(sum) => this.setState({sum})}
                answers={this.state.question.answers}
                {...this.props}
              /> :
              <h4>Loading...</h4>}
          </Fragment> : <h3>Loading...</h3>}
        {this.question_num === 9 ? fast_button : null}
      </div>
    )
  }
}

export default withRouter(withAudio(RegularPlay));