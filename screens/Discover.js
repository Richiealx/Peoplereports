import React, { useState, useRef } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';

export default function Discover() {
  const camera = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [recording, setRecording] = useState(false);

  const handleRecord = async () => {
    if (camera.current && !recording) {
      try {
        setRecording(true);

        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
          alert('Permission to access camera roll is required!');
          setRecording(false);
          return;
        }

        const options = { quality: 'low' };
        const video = await camera.current.recordAsync(options);
        const source = video.uri;

        const asset = await MediaLibrary.createAssetAsync(source);
        const assetInfo = await MediaLibrary.getAssetInfoAsync(asset);
        const assetSizeMB = assetInfo.size / 1000000;

        if (assetSizeMB > 1) {
          alert('Video file is too large. Please record a shorter video.');
          await camera.current.stopRecording();
          setRecording(false);
          await MediaLibrary.deleteAssetsAsync([asset]);
          return;
        }

        alert('Video saved to camera roll!');

      } catch (error) {
        console.error(error);
        alert('Failed to save video.');
      } finally {
        setRecording(false);
      }
    } else if (camera.current && recording) {
      camera.current.stopRecording();
    }
  };

  const handleCameraType = () => {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const handleCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    setHasPermission(status === 'granted');
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={camera} />
      <View style={styles.controls}>
        <Button
          title={recording ? 'Stop' : 'Record'}
          onPress={handleRecord}
          disabled={!hasPermission}
        />
        <Button
          title="Flip"
          onPress={handleCameraType}
          disabled={!hasPermission}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 10,
  },
});
