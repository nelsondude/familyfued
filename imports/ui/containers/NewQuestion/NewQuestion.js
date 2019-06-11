import React, {Fragment} from 'react';
import Modal from '@material-ui/core/Modal/index';
import Typography from '@material-ui/core/Typography/index';
import Button from "@material-ui/core/Button/index";
import './NewQuestion.css';
import {TextValidator, ValidatorForm} from "react-material-ui-form-validator";
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from "@material-ui/core/TextField";
import {Questions} from "../../../api/links";
import Grid from "@material-ui/core/Grid";


class NewQuestion extends React.Component {
  state = {
    open: false,
    question: "",
    responses: []
  };


  handleOpen = () => {
    this.setState({open: true})
  };

  handleClose = () => {
    this.setState({open: false})
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.responses.length === 0) {
      // Add validator message here
      return null;
    }
    if (this.state.responses.length > 8) {
      // Add validator message here
      return null;
    }
    Questions.insert({
      user_id: Meteor.userId(),
      text: this.state.question,
      answers: [...this.state.responses] }, () => {
      this.handleClose();
    });
  };

  addResponse = () => {
    this.setState({responses: [...this.state.responses, {answer: "Bananas", responses: 10}]})
  };

  removeResponse = (i) => {
    let responses = [...this.state.responses];
    this.setState({responses: responses.slice(0, i).concat(responses.slice(i + 1, responses.length))});
  };

  handleAnswerChange = (i, event) => {
    const responses = [...this.state.responses];
    responses[i].answer = event.target.value;
    this.setState({responses});
  };

  handleResponsesChange = (i, event) => {
    const responses = [...this.state.responses];
    responses[i].responses = parseInt(event.target.value);
    this.setState({responses});
  };

  handleQuestionChange = event => {
    this.setState({question: event.target.value})
  };

  render() {
    const {open} = this.state;

    return (
      <Fragment>
        <Button onClick={this.handleOpen} variant="contained" color="primary" className={'new-question'}>New Question</Button>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={open}
          onClose={this.handleClose}
        >
          <div id={"modal"}>
            <h1>New Question</h1>
            <ValidatorForm
              ref="form2"
              onSubmit={this.handleSubmit}
              onError={errors => console.log(errors)}
            >
              <TextValidator
                autoFocus
                label="Question"
                onChange={this.handleQuestionChange}
                name="question"
                value={this.state.question}
                validators={['required']}
                errorMessages={['this field is required']}
                fullWidth
              />
              <br/>
              <h3>Responses</h3>

              {this.state.responses.map((response, i) => (
                  <div className={'input-row'} key={i}>
                    <Grid container spacing={8}>
                      <Grid item xs>
                        <TextField
                          required
                          id="answer"
                          label="Required"
                          margin="normal"
                          value={response.answer}
                          fullWidth
                          onChange={this.handleAnswerChange.bind(this, i)}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          fullWidth
                          required
                          type="number"
                          id="num-responses"
                          label="Required"
                          margin="normal"
                          value={response.responses}
                          inputProps={{min: "1", max: "99", step: "1"}}
                          onChange={this.handleResponsesChange.bind(this, i)}
                        />
                      </Grid>
                      <Grid item>
                        <Fab className={'remove-icon'} color="secondary" aria-label="Delete"
                             onClick={this.removeResponse.bind(this, i)}>
                          <DeleteIcon/>
                        </Fab>
                      </Grid>
                    </Grid>
                  </div>
                )
              )}
              <Fab color="primary" aria-label="Add" onClick={this.addResponse}>
                <AddIcon />
              </Fab>
              <br/>
              <br/>
              <Button type={"submit"}>Create Question</Button>
            </ValidatorForm>
          </div>
        </Modal>
      </Fragment>

    )
  }
}
export default NewQuestion;