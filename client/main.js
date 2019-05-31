import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import App from '/imports/ui/App';
import '../imports/startup/accounts-config.js';

import {BrowserRouter as Router} from "react-router-dom";

const app = (
  <Router>
    <App/>
  </Router>
);

Meteor.startup(() => {
  render(app, document.getElementById('react-target'));
});
