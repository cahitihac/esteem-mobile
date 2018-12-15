import React, { Component } from 'react';
import { withNavigation } from 'react-navigation';

import { getComments } from '../../../providers/steem/dsteem';

// Services and Actions

// Middleware

// Constants
import { default as ROUTES } from '../../../constants/routeNames';

// Utilities

// Component
import { CommentsView } from '..';

/*
 *            Props Name        Description                                     Value
 *@props -->  props name here   description here                                Value Type Here
 *
 */

class CommentsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
    };
  }

  // Component Life Cycle Functions

  componentDidMount() {
    this.__getComments();
  }

  componentWillReceiveProps(nextProps) {
    console.log('nextProps :', nextProps);
  }
  // Component Functions

  _getComments = () => {
    const { author, permlink } = this.props;

    getComments(author, permlink)
      .then((comments) => {
        this.setState({
          comments,
        });
      })
      .catch((error) => {
        // alert(error);
      });
  };

  _handleOnReplyPress = (item) => {
    const { navigation } = this.props;

    navigation.navigate({
      routeName: ROUTES.SCREENS.EDITOR,
      params: {
        isReply: true,
        post: item,
      },
    });
  };

  render() {
    const { comments } = this.state;

    return (
      <CommentsView
        handleOnReplyPress={this._handleOnReplyPress}
        comments={comments}
        {...this.props}
      />
    );
  }
}

export default withNavigation(CommentsContainer);
