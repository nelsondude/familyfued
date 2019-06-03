import React, {Fragment} from 'react';
import TransferList from '../components/TransferList/TransferList';
import Button from "@material-ui/core/Button/index";
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import NewQuestion from './NewQuestion/NewQuestion';
import * as _ from 'lodash';
import {Games} from "../../api/links";
import { withRouter } from 'react-router-dom'
import {Prompt} from "react-router";


class NewGame extends React.Component {
  state = {
    title: "",
    regular_questions: [],
    fast_money_questions: [],
    showErrors: false,
    validation_errors: {}
  };

  handleChange = event => {
    this.setState({title: event.target.value})
  };

  formIsEmpty = () => {
    const {title, regular_questions, fast_money_questions} = this.state;
    return (!title && regular_questions.length === 0 && fast_money_questions.length === 0);
  };


  formIsComplete = () => {
    const {title, regular_questions, fast_money_questions} = this.state;
    return (title && regular_questions.length === 10 && fast_money_questions.length === 5);
  }

  validateForm = () => {
    this.setState({validation_errors: {}}, () => {
        let errors = {};
        if (this.state.regular_questions.length !== 10) {
          errors.regular = "You need 10 questions for this field";
        }
        if (this.state.fast_money_questions.length !== 5) {
          errors.fast = "You need 5 questions for this field"
        }
        this.setState({
          validation_errors: {
            ...this.state.validation_errors,
            ...errors
          }
        })
      }
    )
  };

  handleSubmit = (event) => {
    if (event) event.preventDefault();
    this.validateForm();
    this.setState({showErrors: true});
    if (Object.keys(this.state.validation_errors).length > 0) return null;
    // continue submitting the form
    Games.insert({
      user_id: Meteor.userId(),
      title: this.state.title,
      regular_questions: _.map(this.state.regular_questions, '_id'),
      fast_money_questions: _.map(this.state.fast_money_questions, '_id')
    }, () => {
      this.props.history.push('/');
    })
  };

  handleRegularChange = selected => {
    this.setState({regular_questions: selected})
  };

  handleFastChange = selected => {
    this.setState({fast_money_questions: selected})
  };

  render() {
    return (
      <Fragment>
        <Prompt
          when={!this.formIsEmpty() && !this.formIsComplete()}
          message={location =>
            `You have started a game. Are you sure you want to leave?`
          }
        />
        <NewQuestion/>
        <ValidatorForm
          ref="form"
          onSubmit={this.handleSubmit}
          onError={errors => console.log(errors)}
        >
          <TextValidator
            label="Title"
            onChange={this.handleChange}
            name="title"
            value={this.state.title}
            validators={['required']}
            errorMessages={['this field is required']}
          />
          <h4>Regular Questions</h4>
          <TransferList setSelected={this.handleRegularChange.bind(this)}/>
          {this.state.showErrors ? <p className={"warning"}>{this.state.validation_errors.regular || ""}</p> : null}
          <br/>

          <h4>Fast Money Questions (must be 5)</h4>
          <TransferList setSelected={this.handleFastChange.bind(this)}/>
          {this.state.showErrors ? <p className={"warning"}>{this.state.validation_errors.fast || ""}</p> : null}
          <br/>
          <Button type={"submit"}>Create Game</Button>
        </ValidatorForm>
      </Fragment>
    )
  }
}

export default withRouter(NewGame);