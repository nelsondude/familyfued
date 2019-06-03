import React from 'react';
import {withRouter} from "react-router";
import {Meteor} from "meteor/meteor";
import TextField from "@material-ui/core/TextField";
import * as _ from 'lodash';
import FormControl from "@material-ui/core/FormControl";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Timer from "../components/Timer";


class FastMoney extends React.Component {
  state = {
    fast_money: [],
    questions: [],
    title: "",
    _id: ""
  };

  get game_id() {
    return this.props.match.params.game_id;
  }

  get round_num() {
    return this.props.match.params.round_num;
  }

  getFastQuestion = () => {
    Meteor.call('join_questions', this.game_id, (error, result) => {
      if (error) console.log(error);
      else {
        let data = result[0]; // single element array
        data.fast_money = _.map(data.fast_money, q => (
          {...q, input: "", closest_answer: "-1"}
        )); // -1 is no close answer
        this.setState({...data});
      }
    });
  };

  componentDidMount() {
    this.getFastQuestion();
  }

  handleFormChange = i => event => {
    const fast_money = [...this.state.fast_money];
    fast_money[i].closest_answer = event.target.value;
    this.setState({fast_money});
  };

  renderQuestionInput = (q, index) => {
    return (
      <div key={index + q.text}>
        <h3>{q.text}</h3>
        <TextField
          label="Your Answer"
          value={q.input}
          onChange={this.handleInputChange(index)}
          margin="normal"
          autoFocus={index === 0}
        />

        <FormControl component="fieldset">
          <FormLabel component="legend">Answers</FormLabel>
          <RadioGroup
            aria-label="Gender"
            name="gender1"
            value={q.closest_answer}
            onChange={this.handleFormChange(index)}
          >
            {q.answers.map((answer, i) => {
                i = i.toString();
                return <FormControlLabel
                  key={i}
                  value={i}
                  control={<Radio/>}
                  label={`${answer.answer} | ${answer.responses}`}/>
              }
            )}
            <FormControlLabel
              value={"-1"}
              control={<Radio/>}
              label="INCORRECT ANSWER"
            />
          </RadioGroup>
        </FormControl>
      </div>
    )
  };

  handleInputChange = i => event => {
    const fast_money = [...this.state.fast_money];
    fast_money[i].input = event.target.value;
    this.setState({fast_money});
  };

  render() {
    const question_inputs = this.state.fast_money.map((q, i) => this.renderQuestionInput(q, i));
    return (
      <div>
        <h1>Fast Money</h1>
        <p>Click Tab to go to next input.</p>
        <Timer count={200}/>
        <br/>
        <br/>
        {question_inputs}
      </div>
    )
  }
}

export default withRouter(FastMoney);