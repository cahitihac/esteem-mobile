import React, { Component } from 'react';
// import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

// Services and Actions

// Middleware

// Constants
import { default as ROUTES } from '../../../constants/routeNames';

// Utilities

// Component
import { PostDisplayView } from '..';

/*
  *            Props Name        Description                                     Value
  *@props -->  props name here   description here                                Value Type Here
  *
  */

class PostDisplayContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // Component Life Cycle Functions

  // Component Functions
  _handleVotersPress = (activeVotes) => {
    const { navigation } = this.props;

    navigation.navigate({
      routeName: ROUTES.SCREENS.VOTERS,
      params: {
        activeVotes,
      },
    });
  };

  render() {
    const { post, currentUser } = this.props;

    return (
      <PostDisplayView
        handleVotersPress={this._handleVotersPress}
        currentUser={currentUser}
        post={post}
      />
    );
  }
}

export default withNavigation(PostDisplayContainer);