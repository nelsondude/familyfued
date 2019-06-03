import React from 'react';
import {withRouter} from "react-router";
import {Meteor} from "meteor/meteor";


class FastMoney extends React.Component {
  state = {
    fast_money: [],
    questions: [],
    title: "",
    _id: ""
  }

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
        const data = result[0]; // single element array
        this.setState({...data});
      }
    });
  };

  componentDidMount() {
    this.getFastQuestion();
  }

  render() {
    return (
      <div>
        <h1>Fast Money</h1>
      </div>
    )
  }
}

export default withRouter(FastMoney);