import React, { Component } from 'react';
import {
  CameraRoll, View, ScrollView, Image, Button,
} from 'react-native';

// Constants

// Components
import { Modal } from '../..';

// Styles
// import styles from './cameraRollModalStyles';

class CameraRollModalView extends Component {
  /* Props
    * ------------------------------------------------
    *   @prop { type }    name                - Description....
    */

  constructor(props) {
    super(props);
    this.state = {};
  }

  // Component Life Cycles

  // Component Functions
  _handleButtonPress = () => {
    CameraRoll.getPhotos({
      first: 20,
      assetType: 'Photos',
    })
      .then((r) => {
        this.setState({ photos: r.edges });
      })
      .catch((err) => {
        // Error Loading Images
      });
  };

  render() {
    const { isOpen } = this.props;
    return (
      <Modal isOpen={isOpen} isFullScreen swipeToClose backButtonClose isTransparent>
        <View>
          <Button title="Load Images" onPress={this._handleButtonPress} />
          <ScrollView>
            {this.state.photos.map((p, i) => (
              <Image
                key={i}
                style={{
                  width: 300,
                  height: 100,
                }}
                source={{ uri: p.node.image.uri }}
              />
            ))}
          </ScrollView>
        </View>
      </Modal>
    );
  }
}

export default CameraRollModalView;
