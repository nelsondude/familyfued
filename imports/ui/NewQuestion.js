import React, {Fragment} from 'react';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import Button from "@material-ui/core/Button";
import './NewQuestion.css';
import {TextValidator, ValidatorForm} from "react-material-ui-form-validator";
import {withStyles} from "@material-ui/core";
import InputBase from '@material-ui/core/InputBase';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from "@material-ui/core/TextField";
import {Questions} from "../api/links";

const BootstrapInput = withStyles(theme => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    width: 'auto',
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);

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
    console.log('submitting');
    Questions.insert({ text: this.state.question, answers: [...this.state.responses] });
  }

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
            <Typography variant="h6" id="modal-title">
              Create Question
            </Typography>
            <ValidatorForm
              ref="form2"
              onSubmit={this.handleSubmit}
              onError={errors => console.log(errors)}
            >
              <TextValidator
                label="Question"
                onChange={this.handleQuestionChange}
                name="question"
                value={this.state.question}
                validators={['required']}
                errorMessages={['this field is required']}
              />
              <br/>
              <h3>Responses</h3>

              {this.state.responses.map((response, i) => {
                return (
                  <div className={'input-row'} key={i}>
                    <TextField
                      required
                      id="answer"
                      label="Required"
                      defaultValue="Bananas"
                      margin="normal"
                      value={response.answer}
                      onChange={this.handleAnswerChange.bind(this, i)}
                    />
                    <TextField
                      required
                      type="number"
                      id="num-responses"
                      label="Required"
                      defaultValue="10"
                      margin="normal"
                      value={response.responses}
                      onChange={this.handleResponsesChange.bind(this, i)}
                    />
                    <Fab className={'remove-icon'} color="secondary" aria-label="Delete" onClick={this.removeResponse.bind(this, i)}>
                      <DeleteIcon />
                    </Fab>
                  </div>
                )
              })}
              <Fab color="primary" aria-label="Add" onClick={this.addResponse}>
                <AddIcon />
              </Fab>
              <Button type={"submit"}>Create Question</Button>
            </ValidatorForm>
          </div>
        </Modal>
      </Fragment>

    )
  }
}
export default NewQuestion;