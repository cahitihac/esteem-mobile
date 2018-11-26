import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AsyncStorage, Alert } from 'react-native';
import 'intl';
import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import tr from 'react-intl/locale-data/tr';
import firebase from 'react-native-firebase';

import { ApplicationScreen } from '..';

addLocaleData([...en, ...tr]);

/* eslint-disable */
// symbol polyfills
global.Symbol = require('core-js/es6/symbol');
require('core-js/fn/symbol/iterator');

// collection fn polyfills
require('core-js/fn/map');
require('core-js/fn/set');
require('core-js/fn/array/find');
/* eslint-enable */

class ApplicationContainer extends Component {
  constructor() {
    super();
    this.state = {
      isRenderRequire: true,
    };
  }

  async componentDidMount() {
    this.checkPermission();
    this.createNotificationListeners();
  }

  componentWillReceiveProps(nextProps) {
    const { isDarkTheme, selectedLanguage } = this.props;

    if (isDarkTheme !== nextProps.isDarkTheme || selectedLanguage !== nextProps.selectedLanguage) {
      this.setState({ isRenderRequire: false }, () => this.setState({ isRenderRequire: true }));
    }
  }

  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
  }

  getToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log('fcmToken :', fcmToken);
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      console.log('fcmToken2 :', fcmToken);
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  };

  checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  };

  requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  };

  createNotificationListeners = async () => {
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    this.notificationListener = firebase.notifications().onNotification((notification) => {
      const { title, body } = notification;
      this.showAlert(title, body);
    });

    /*
    * If your app is in background, you can listen for when
    * a notification is clicked / tapped / opened as follows:
    * */
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened((notificationOpen) => {
        const { title, body } = notificationOpen.notification;
        this.showAlert(title, body);
      });

    /*
    * If your app is closed, you can check if it was opened
    * by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      this.showAlert(title, body);
    }
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      // process data message
      console.log(JSON.stringify(message));
    });
  };

  showAlert = (title, body) => {
    Alert.alert(title, body, [{ text: 'OK', onPress: () => console.log('OK Pressed') }], {
      cancelable: false,
    });
  };

  render() {
    const { selectedLanguage } = this.props;
    const { isRenderRequire } = this.state;

    const locale = (navigator.languages && navigator.languages[0])
      || navigator.language
      || navigator.userLanguage
      || selectedLanguage;

    if (isRenderRequire) {
      return <ApplicationScreen locale={locale} {...this.props} />;
    }
    return null;
  }
}

const mapStateToProps = state => ({
  isDarkTheme: state.application.isDarkTheme,
  selectedLanguage: state.application.language,
});

export default connect(mapStateToProps)(ApplicationContainer);
