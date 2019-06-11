import React from 'react';
import {withRouter} from "react-router";
import {Meteor} from "meteor/meteor";
import TextField from "@material-ui/core/TextField/index";
import * as _ from 'lodash';
import FormControl from "@material-ui/core/FormControl/index";
import Radio from "@material-ui/core/Radio/index";
import FormControlLabel from "@material-ui/core/FormControlLabel/index";
import FormLabel from "@material-ui/core/FormLabel/index";
import RadioGroup from "@material-ui/core/RadioGroup/index";
import {Button} from "@material-ui/core/index";
import Grid from "@material-ui/core/Grid/index";
import Timer from "../../components/Timer";
import FastResults from "../../components/FastResults/FastResults";
import './FastMoney.css';
import withAudio from "../../hoc/withAudio";
import Paper from "@material-ui/core/Paper";

const deepCopy = (data) => (
  JSON.parse(JSON.stringify(data))
);

const styles = {
  paper: {
    padding: '50px',
    margin: '30px'
  }
};

class FastMoney extends React.Component {
  state = {
    1: {
      fast_money: [],
      _id: "",
      questions: [],
      title: ""
    },
    2: {
      fast_money: [],
      _id: "",
      questions: [],
      title: ""
    }
  };

  get game_id() {
    return this.props.match.params.game_id;
  }

  get round_num() {
    return parseInt(this.props.match.params.round_num);
  }

  getFastQuestion = () => {
    Meteor.call('join_questions', this.game_id, (error, result) => {
      if (error) console.log(error);
      else {
        let data = result[0]; // single element array
        data.fast_money = _.map(data.fast_money, q => (
          {...q, input: "", closest_answer: "-1"}
        )); // -1 is no close answer
        this.setState({
          1: deepCopy(data),
          2: deepCopy(data)  // round 1 and round 2 in state
        });
      }
    });
  };

  componentDidMount() {
    this.getFastQuestion();
    this.props.pause();
  }

  handleFormChange = (i, round) => event => {
    const round_data = {...this.state[round]};
    round_data.fast_money[i].closest_answer = event.target.value;
    this.setState({[round]: round_data});
  };

  renderQuestionInput = (q, index, round) => {
    return (
      <div key={index + q.text + round}>
        <h3>{q.text}</h3>
        <Grid container spacing={4}>
          <Grid item xs>
            <TextField
              label="Your Answer"
              value={q.input}
              onChange={this.handleInputChange(index, round)}
              margin="normal"
              autoFocus={index === 0}
              fullWidth
            />

          </Grid>

          <Grid item xs>

            <FormControl component="fieldset">
              <FormLabel component="legend">Answers</FormLabel>
              <RadioGroup
                aria-label="Gender"
                name="gender1"
                value={q.closest_answer}
                onChange={this.handleFormChange(index, round)}
              >
                {q.answers.map((answer, i) => {
                    i = i.toString();
                    const is_duplicate_answer =
                      round === 2 &&
                      i === this.state[1].fast_money[index].closest_answer;
                    return <FormControlLabel
                      key={`${i}${round}`}
                      value={i}
                      control={<Radio/>}
                      disabled={is_duplicate_answer}
                      label={`${answer.answer} | ${answer.responses}`}/>
                  }
                )}
                <FormControlLabel
                  value={"-1"}
                  control={<Radio/>}
                  label="Incorrect Answer"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
      </div>
    )
  };

  handleInputChange = (i, round) => event => {
    const round_data = {...this.state[round]};
    round_data.fast_money[i].input = event.target.value;
    this.setState({[round]: round_data});
  };

  render() {
    const round_one = this.state[1].fast_money.map((q, i) => this.renderQuestionInput(q, i, 1));
    const round_two = this.round_num === 2
      ? this.state[2].fast_money.map((q, i) => this.renderQuestionInput(q, i, 2))
      : null;
    return (
      <Paper className={'FastMoney'} style={styles.paper}>
        {this.round_num === 1
          ? <Button
            variant="contained"
            style={{float: 'right'}}
            onClick={() => this.props.history.push(`/games/${this.game_id}/fast/2`)}>
            Next Round
          </Button>
          : <Button
            variant="contained"
            style={{float: 'right'}}
            onClick={() => this.props.history.push(`/games/${this.game_id}/fast/1`)}>
            Previous Round
          </Button>}
        <h1>Fast Money: Round {this.round_num}</h1>
        <p>Click Tab to go to next input.</p>
        <Timer
          {...this.props}
          round_num={this.round_num}
          count={this.round_num === 1 ? 200 : 250}/>

        <br/>
        <br/>

        <Grid container>
          <Grid item xs={6}>
            {round_one}
          </Grid>
          <Grid item xs={6}>
            {round_two}
          </Grid>
        </Grid>
        <FastResults
          round_num={this.round_num}
          round_two={this.round_num === 2 ? this.state[2].fast_money : []}
          round_one={this.state[1].fast_money}
          {...this.props}/>
      </Paper>
    )
  }
}

export default withRouter(withAudio(FastMoney));