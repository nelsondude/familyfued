import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AccountsUIWrapper from "./AccountsUIWrapper";
import {Link} from "react-router-dom";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

export default function Navbar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <AccountsUIWrapper/> &nbsp;&nbsp;
          <Link to={'/'}>Home</Link>
        </Toolbar>
      </AppBar>
    </div>
  );
}