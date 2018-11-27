import React, { Component } from 'react';
import {
  CameraRoll,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
// Constants

// Components
import { Modal } from '../..';

// Styles
import styles from './cameraRollModalStyles';

const DEVICE_WIDTH = Dimensions.get('window').width;

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
  componentWillReceiveProps(nextProps) {
    const { isOpen } = this.props;

    if (nextProps.isOpen && nextProps.isOpen !== isOpen) {
      this._getPhotos();
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      }).then((image) => {
        console.log(image);
      });
    }
  }

  // Component Functions
  _getPhotos = () => {
    // CameraRoll.getPhotos({
    //   first: 1000000,
    //   assetType: 'Photos',
    // })
    //   .then((r) => {
    //     this.setState({ photos: r.edges });
    //   })
    //   .catch((err) => {
    //     // Error Loading Images
    //   });
  };

  _handleOnSelectImage = (item) => {
    console.log(item.node.image.uri);
    // item.node.image.uri;
  };

  render() {
    const { isOpen, handleOnClose } = this.props;
    const { photos } = this.state;

    return (
      <Modal
        title="Photos"
        animationType="slide"
        handleOnModalClose={handleOnClose}
        isOpen={isOpen}
        isFullScreen
        isCloseButton
      >
        {/* <View style={styles.wrapper}>
          <FlatList
            style={styles.flatList}
            numColumns={3}
            // horizontal
            // onEndReached={loadMore}
            data={photos}
            keyExtractor={index => index}
            renderItem={({ item, i }) => (
              <TouchableOpacity onPress={() => this._handleOnSelectImage(item)}>
                <Image
                  key={i}
                  style={[styles.image, { width: DEVICE_WIDTH / 3 }]}
                  source={{ uri: item.node.image.uri }}
                />
              </TouchableOpacity>
            )}
          />
        </View> */}
      </Modal>
    );
  }
}

export default CameraRollModalView;
