import React from 'react';
import {withTracker} from "meteor/react-meteor-data";
import {Games} from '../../api/links';
import { Link } from 'react-router-dom'
import Grid from "@material-ui/core/Grid/index";
import Button from "@material-ui/core/Button/index";
import {withRouter} from "react-router";


class Home extends React.Component {
  renderGames = () => {
    return this.props.games.map((game, i) => {
      return (
        <Grid item sm={6} key={i}>
          <Button onClick={() => this.props.history.push(`/games/${game._id}/regular/0`)}>{game.title}</Button>
        </Grid>
      )
    })
  };

  render() {
    const games = this.renderGames();
    return (
      <div>
        {games.length > 0 ? <Grid container>{games}</Grid> : <h3>You havent created any games.</h3>}
        <Grid container>
          <Grid item xs={12}>
            <Link to={'/games/new'}>New Game</Link>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withRouter(withTracker(() => {
  return {
    games: Games.find({user_id: Meteor.userId()}).fetch()
  }
})(Home));