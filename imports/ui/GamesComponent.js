import React from 'react';
import Col from "react-bootstrap/Col";
import {withTracker} from "meteor/react-meteor-data";
import {Games} from '../api/links';
import { Link } from 'react-router-dom'
import Row from "react-bootstrap/Row";


class GamesComponent extends React.Component {
  renderGames = () => {
    return this.props.games.map((game, i) => {
      return (
        <Col sm={6}>
          <h1>{game.text}</h1>
        </Col>
      )
    })
  };

  render() {
    const games = this.renderGames();
    return (
      <div>
        {games.length > 0 ? games : <h3>You havent created any games.</h3>}
        <Row>
          <Col>
            <Link to={'/games/new'}>New Game</Link>
          </Col>
        </Row>
      </div>
    )
  }
}

export default withTracker(() => {
  return {
    games: Games.find({user_id: Meteor.userId()}).fetch()
  }
})(GamesComponent);