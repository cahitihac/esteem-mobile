import React, { Component } from 'react';
import { connect } from 'react-redux';

// Services and Actions

// Middleware

// Constants

// Utilities

// Component
import { CameraRollModalView } from '..';

/*
  *            Props Name        Description                                     Value
  *@props -->  props name here   description here                                Value Type Here
  *
  */

class CameraRollModalContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // Component Life Cycle Functions

  // Component Functions

  render() {
    return <CameraRollModalView />;
  }
}

const mapStateToProps = state => ({
  user: state.user.user,
});

export default connect(mapStateToProps)(CameraRollModalContainer);
