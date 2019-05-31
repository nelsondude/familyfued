import React from 'react';
import {withTracker} from "meteor/react-meteor-data";
import {Games} from '../api/links';
import { Link } from 'react-router-dom'
import Grid from "@material-ui/core/Grid";


class GamesComponent extends React.Component {
  renderGames = () => {
    return this.props.games.map((game, i) => {
      return (
        <Grid item sm={6}>
          <h1>{game.title}</h1>
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

export default withTracker(() => {
  return {
    games: Games.find({user_id: Meteor.userId()}).fetch()
  }
})(GamesComponent);