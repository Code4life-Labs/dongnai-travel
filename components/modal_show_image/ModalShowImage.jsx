import { Styles } from '@/styles';
import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableWithoutFeedback, View, Image, Button, TouchableOpacity, Dimensions } from 'react-native';
import { AntDesign } from 'react-native-vector-icons'

const ModalShowImage = ({ visible, imageUrl, onClose }) => {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const handleImageLayout = event => {
    const { width, height } = event.nativeEvent.layout;
    
    let newWidth = windowWidth * 1;
    let newHeight = newWidth * (height / width);
    
    if (newHeight > windowHeight * 0.8) {
      newHeight = windowHeight * 1.2;
      newWidth = newHeight * (width / height);
    }
    
    setImageSize({ width: newWidth, height: newHeight });
  };

  return (
    <Modal transparent visible={visible}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modal}>
          <Image
            source={{ uri: imageUrl }}
            style={[styles.fullLogo, imageSize]}
            resizeMode="contain"
            onLayout={handleImageLayout}
          />
          <TouchableOpacity 
            onPress={onClose} 
            style={{width: 40, height: 40, position: 'absolute', top: 45, right: 15}}
          >
            <AntDesign name="close" size={30} style={styles.btn_close}/>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 1)',
  },
  fullLogo: {
    // Size will be set dynamically
  },
  btn_close: {
    color: '#ffff',
  }
});

export default ModalShowImage;
