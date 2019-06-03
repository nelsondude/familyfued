import React from 'react';
import Button from "@material-ui/core/Button";

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: props.count,
      counting: false
    }
  }


  startTimer = () => {
    this.setState({counting: true})
  };

  resetTimer = () => {
    this.pauseTimer();
    this.interval = this.setupInterval();
    this.setState({count: this.props.count})
  };

  pauseTimer = () => {
    this.setState({counting: false})
  };

  setupInterval = () => (
    setInterval(() => {
      this.setState(prevState => {
        if (prevState.count === 0) {
          clearInterval(this.interval);
        } else if (this.state.counting) {
          return {
            count: prevState.count - 1
          }
        }
      })
    }, 100)
  );

  componentDidMount() {
    this.interval = this.setupInterval();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        <h3>Count: {(this.state.count / 10).toFixed(1)}</h3>
        <Button disabled={this.state.counting} onClick={this.startTimer}>Start</Button>
        <Button disabled={!this.state.counting} onClick={this.pauseTimer}>Pause</Button>
        <Button onClick={this.resetTimer}>Reset</Button>
      </div>
    );
  }
}

export default Timer;