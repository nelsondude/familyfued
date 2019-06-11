import React, {Fragment} from 'react';
import Grid from "@material-ui/core/Grid/index";
import './FastResults.css';
import {Button} from "@material-ui/core";
import Modal from '@material-ui/core/Modal/index';
import Fab from "@material-ui/core/Fab";
import CloseIcon from '@material-ui/icons/Close';
import {withRouter} from "react-router";

const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;

const styles = {
  totalPoints: {
    float: 'right'
  }
};

class FastResults extends React.Component {
  state = {
    round_one: [],
    round_two: [],
    show_results: false,
    show_index: -1
  };

  renderRound = (round, is_round_two = false) => (
    round.map((response, i) => {
      const selected = parseInt(response.closest_answer);
      let points = selected === -1 ? 0 : response.answers[selected].responses;
      // const input = padSpaces(response.input, 15);
      const input_index = (i * 2) + (is_round_two ? 10 : 0);
      const points_index = input_index + 1;

      const show_input = input_index <= this.show_index;
      const show_points = points_index <= this.show_index;

      const classes = ["black-bar"];
      if (show_input) {
        // classes.push("collapse");
      }
      if (show_points) {
        classes.push("hide")
      }

      return (
        <div className='fast-row' key={response._id + i}>
          <div className='fast-response input-area' style={{color: show_input ? 'white' : 'black'}}>
            {response.input}
          </div>
          <div className='fast-points input-area' style={{color: show_points ? 'white' : 'black'}}>
            {points}
          </div>
          {show_input ? <div className="black-container">
            <div className={classes.join(" ")}>
            </div>
          </div> : null}
        </div>
      )
    })
  );

  get show_index() {
    return this.state.show_index;
  }

  get total_points() {
    const all_rounds = [...this.state.round_one, ...this.state.round_two];
    return all_rounds.reduce((prev,next, i) => {
      const selected = parseInt(next.closest_answer);
      // Display only visible points
      let points = (selected === -1 || (i * 2) >= this.state.show_index) ? 0 : next.answers[selected].responses;
      return prev + points;
    }, 0);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  playSoundEffect = () => {
    if (this.state.show_index % 2 === 0) {
      this.props.playFastMoneyReveal();
    } else {
      const arr = this.state.round_one.concat(this.state.round_two);
      if (arr[Math.floor(this.state.show_index / 2)].closest_answer === '-1') {
        this.props.playWrongShort();
      } else {
        this.props.playRight();
      }
    }
  };

  handleKeyPress = event => {
    if (!this.state.show_results) return;
    if (event.keyCode === LEFT_ARROW) {
      if (this.state.show_index > -1) {
        this.setState(state => ({show_index: state.show_index - 1}))
      }
    } else if (event.keyCode === RIGHT_ARROW) {
      if (this.state.show_index < 19) {
        this.setState(state => ({show_index: state.show_index + 1}), this.playSoundEffect)
      }
    }
  };

  componentWillReceiveProps(nextProps, nextContext) {
    const data = {
      round_one: nextProps.round_one || [],
      round_two: nextProps.round_two || []
    };
    if (this.props.round_num !== nextProps.round_num) {
      data.show_index = nextProps.round_num === 1 ? -1 : 9;
    }
    this.setState(data);
  }

  handleOpen = () => {
    this.setState({show_results: true})
  };

  handleClose = () => {
    this.setState({show_results: false})
  };

  get game_id() {
    return this.props.match.params.game_id;
  }

  get round_num() {
    return parseInt(this.props.match.params.round_num);
  }

  render() {
    //needs prop results
    return (
      <Fragment>
        <Button
          variant={'contained'}
          color={'primary'}
          fullWidth
          onClick={this.handleOpen}>Show Round {this.round_num} Results</Button>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.show_results}
          onClose={this.handleClose}
        >
          <div className={'FastResults'}>
            <div>
              <Fab color="primary" aria-label="Add" onClick={this.handleClose} style={{float: 'right'}}>
                <CloseIcon/>
              </Fab>
              {this.props.round_num === 1
                ?
                <Button
                  variant="contained" color="primary"
                  onClick={() => {
                    this.props.history.push(`/games/${this.game_id}/fast/2`);
                    this.handleClose();
                  }}>
                  Next Round
                </Button>
                : null}

              <h1>Fast Money Results</h1>
              <h3>Round #{this.props.round_num}</h3>
              <p>
                Hit Right and Left Arrow keys to reveal answers.
              </p>
            </div>
            <Grid container>
              <Grid item xs={6}>
                {this.renderRound(this.state.round_one)}
              </Grid>
              <Grid item xs={6}>
                {this.renderRound(this.state.round_two, true)}
              </Grid>
            </Grid>
            <br/>
            <Grid container>
              <Grid item xs={this.round_num === 1 ? 3 : 9}/>
              <Grid item xs={3}>
                <div className="fast-row">
                  <div className="input-area fast-response">
                    TOTAL <span style={styles.totalPoints}>{this.total_points}</span>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        </Modal>
      </Fragment>
    );
  }
}

export default withRouter(FastResults);