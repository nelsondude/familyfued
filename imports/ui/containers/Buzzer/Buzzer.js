import React from 'react';
import Button from "@material-ui/core/Button";
import {Meteor} from "meteor/meteor";
import {withRouter} from "react-router";
import ButtonGroup from '@material-ui/core/ButtonGroup';

class Buzzer extends React.Component {
  hitBuzzer = (side) => {
    Meteor.call('buzzer', this.game_id, side)
  };

  get game_id() {
    return this.props.match.params.game_id;
  }

  render() {
    return (
      <div>
          <Button fullWidth variant={'contained'} color={'secondary'} onClick={this.hitBuzzer.bind(this, 'red')}>Red</Button>
          <Button fullWidth variant={'contained'} color={'primary'} onClick={this.hitBuzzer.bind(this, 'blue')}>Blue</Button>
      </div>
    );
  }
}

export default withRouter(Buzzer);