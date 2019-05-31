import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import {withTracker} from "meteor/react-meteor-data";
import {Questions} from "../api/links";
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';

// const useStyles = makeStyles(theme => ({
//   root: {
//     margin: 'auto',
//   },
//   paper: {
//     width: 200,
//     overflow: 'auto',
//   },
//   button: {
//     margin: theme.spacing(0.5, 0),
//   },
// }));

function not(a, b) {
  return a.filter(value => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter(value => b.indexOf(value) !== -1);
}

const SortableItem = SortableElement(({value}) =>
  <ListItem key={value} role={undefined} button onClick={() => this.handleToggle(value)}>
    <ListItemIcon>
      <Checkbox checked={false} tabIndex={-1} disableRipple/>
    </ListItemIcon>
    <ListItemText primary={value.text}/>
  </ListItem>);

const SortableList = SortableContainer(({items}) => {
  return (
    <List dense>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}
    </List>
  );
});

class TransferList extends React.Component {
  state = {
    left: [0, 1, 2, 3, 4, 5],
    right: [],
    checked: []
  };

  componentDidMount() {
    this.setState({left: this.props.questions})
  }

  handleToggle = value => {
    const {checked} = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    this.setState({checked: newChecked});
  };

  handleAllRight = () => {
    const {left, right} = this.state;
    this.setState({
      right: right.concat(left),
      left: []
    })
  };

  handleCheckedRight = () => {
    const {left, right, checked} = this.state;
    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);
    this.setState({
      right: right.concat(leftChecked),
      left: not(left, leftChecked),
      checked: not(checked, leftChecked)
    })
  };

  handleCheckedLeft = () => {
    const {left, right, checked} = this.state;
    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    this.setState({
      left: left.concat(rightChecked),
      right: not(right, rightChecked),
      checked: not(checked, rightChecked)
    })
  };

  handleAllLeft = () => {
    const {left, right} = this.state;
    this.setState({
      left: left.concat(right),
      right: []
    })
  };

  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState(({items}) => ({
      right: arrayMove(items, oldIndex, newIndex),
    }));
  };

  customList = (items, title="") => (
    <Paper style={{width: '200px'}}>
      <h1>{title}</h1>
      {/*<SortableList items={items} onSortEnd={this.onSortEnd} />*/}
      <List dense>
        {items.map(value => (
          <ListItem key={value} role={undefined}>
            <ListItemIcon>
              <Checkbox checked={this.state.checked.indexOf(value) !== -1} tabIndex={-1} disableRipple onClick={()=>this.handleToggle(value)}/>
            </ListItemIcon>
            <ListItemText primary={value.text} />
          </ListItem>
        ))}
        <ListItem />
      </List>
    </Paper>
  );

  render() {
    // const classes = useStyles();
    const {checked, left, right} = this.state;
    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    return (
      <Grid container spacing={2} justify="center" alignItems="center" className={'TransferList'}>
        <Grid item>{this.customList(left, 'My Questions')}</Grid>
        <Grid item>
          <Grid container direction="column" alignItems="center">
            <Button
              variant="outlined"
              size="small"
              onClick={this.handleAllRight}
              disabled={left.length === 0}
              aria-label="move all right"
            >
              ≫
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={this.handleCheckedRight}
              disabled={leftChecked.length === 0}
              aria-label="move selected right"
            >
              &gt;
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={this.handleCheckedLeft}
              disabled={rightChecked.length === 0}
              aria-label="move selected left"
            >
              &lt;
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={this.handleAllLeft}
              disabled={right.length === 0}
              aria-label="move all left"
            >
              ≪
            </Button>
          </Grid>
        </Grid>
        <Grid item>{this.customList(right, "Questions in Game")}</Grid>
      </Grid>
    )
  }
}

export default withTracker(() => {
  return {
    questions: Questions.find().fetch()
  }
})(TransferList);
