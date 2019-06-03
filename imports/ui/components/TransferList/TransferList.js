import React from 'react';
import Grid from '@material-ui/core/Grid/index';
import List from '@material-ui/core/List/index';
import ListItemIcon from '@material-ui/core/ListItemIcon/index';
import Checkbox from '@material-ui/core/Checkbox/index';
import Button from '@material-ui/core/Button/index';
import Paper from '@material-ui/core/Paper/index';
import {withTracker} from "meteor/react-meteor-data";
import {Questions} from "../../../api/links";
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move/index';
import './TransferList.css';
import * as _ from 'lodash';

function not(a, b) {
  b = _.map(b, '_id');
  return a.filter(value => b.indexOf(value._id) === -1);
}

function intersection(a, b) {
  b = _.map(b, '_id');
  return a.filter(value => b.indexOf(value._id) !== -1);
}

const SortableItem = SortableElement(({value, checked, toggle}) =>
  <li>
    <ListItemIcon>
      <Checkbox checked={checked.indexOf(value) !== -1} tabIndex={-1} disableRipple
                onClick={() => toggle(value)}/>
    </ListItemIcon>
    <span className={'itemtext'}>

    {value.text}
    </span>
  </li>
);

const SortableList = SortableContainer(({items, checked, toggle}) => {
  return (
    <List dense className={'scrolling-list'}>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} checked={checked} toggle={toggle}/>
      ))}
    </List>
  );
});

class TransferList extends React.Component {
  state = {
    left: [],
    right: [],
    checked: []
  };

  componentDidMount() {
    this.setState({left: this.props.questions})
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.questions.length !== this.state.left.length + this.state.right.length) {
      let new_questions = not(nextProps.questions, [...this.state.left, ...this.state.right]);
      this.setState({left: [...new_questions.reverse(), ...this.state.left, ]});
    }
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
    }, this.props.setSelected(right.concat(left)))
  };

  handleCheckedRight = () => {
    const {left, right, checked} = this.state;
    const leftChecked = intersection(checked, left);
    this.setState({
      right: right.concat(leftChecked),
      left: not(left, leftChecked),
      checked: not(checked, leftChecked)
    }, this.props.setSelected(right.concat(leftChecked)));
  };

  handleCheckedLeft = () => {
    const {left, right, checked} = this.state;
    const rightChecked = intersection(checked, right);

    this.setState({
      left: left.concat(rightChecked),
      right: not(right, rightChecked),
      checked: not(checked, rightChecked)
    }, this.props.setSelected(not(right, rightChecked)));
  };

  handleAllLeft = () => {
    const {left, right} = this.state;
    this.setState({
      left: left.concat(right),
      right: []
    }, this.props.setSelected([]));
  };

  leftList = (items) => {
    const {left, checked} = this.state;
    return (
      <Paper style={{padding: '10px'}}>
        <h1>My Questions ({this.state.left.length})</h1>
        <h4>Selected: {intersection(checked, left).length}</h4>
        <SortableList items={items} onSortEnd={({oldIndex, newIndex}) => {
          this.setState(({left}) => ({
            left: arrayMove(left, oldIndex, newIndex),
          }));
        }} checked={this.state.checked} toggle={this.handleToggle}/>
      </Paper>
    )
  };

  rightList = (items) => {
    const {right, checked} = this.state;
    return (
      <Paper style={{padding: '10px'}}>
        <h1>Questions in Game ({this.state.right.length})</h1>
        <h4>Selected: {intersection(checked, right).length}</h4>
        <SortableList items={items} onSortEnd={({oldIndex, newIndex}) => {
          this.setState(({right}) => ({
            right: arrayMove(right, oldIndex, newIndex),
          }));
        }} checked={this.state.checked} toggle={this.handleToggle}/>
      </Paper>
    )
  };

  render() {
    const {checked, left, right} = this.state;
    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    return (
      <Grid container spacing={2} justify="space-evenly" className={'TransferList'}>
        <Grid item style={{flexGrow: 1}}>{this.leftList(left)}</Grid>
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
        <Grid item style={{flexGrow: 1}}>{this.rightList(right)}</Grid>
      </Grid>
    )
  }
}

export default withTracker(() => {
  return {
    questions: Questions.find({}, {sort: {'updatedAt': -1}}).fetch()
  }
})(TransferList);
