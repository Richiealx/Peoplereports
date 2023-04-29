import React, { useState, useEffect, useRef } from 'react';
import {Dimensions , FlatList, StyleSheet, View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';

export default function PostScreen({navigation}) {
  const cameraRef = useRef(null); // Reference to the camera component
  const [hasCameraPermission, setHasCameraPermission] = useState(null); // State variable to store camera permission status
  const [camera, setCamera] = useState(null); // State variable to store camera object
  const [photo, setPhoto] = useState(null); // State variable to store the URI of the captured photo
  const [photos, setPhotos] = useState([]); // State variable to store recent photos from the device's media library
  const [selectedImage, setSelectedImage] = useState(null); // State variable to store the currently selected image from recent photos

  // Function to send the captured photo to the next screen
  const handlePicture = () => {
    navigation.navigate("Post2", photo);
  }

  // Function to get recent photos from the device's media library
  const getRecentPhotos = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync(); // Request permission to access media library
    if (status === 'granted') {
      const { assets } = await MediaLibrary.getAssetsAsync({ 
        sortBy: MediaLibrary.SortBy.creationTime, // Sort recent photos by creation time
        first: 40, // Set the maximum number of photos to retrieve
      });
      setPhotos(assets);
    } else {
      // Permissions not granted
    }
  };

  // Function to get camera permissions
  const getPermissionsAsync = async () => {
    if (Constants.platform.android) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA); // Request camera and camera roll permissions
      if (status !== 'granted') {
        alert('Sorry, we need camera roll and camera permissions to make this work!');
      }
    }
  };

  // Function to capture a photo with the camera
  const takePicture = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync(); // Capture a photo
      setPhoto(photo.uri); // Store the photo's URI in state
    }
  };

  // Function to pick an image from the device's media library
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Only select images
      allowsEditing: true, // Allow editing of the selected image
      quality: 1, // Set the image quality to maximum
    });

    if (!result.cancelled) {
      setPhoto(result.uri); // Store the selected image's URI in state
    }
  };

  // Function to render a single photo from the recent photos list
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => { if (item.uri === setPhoto) { setPhoto(null); } else { setPhoto(item.uri); } }} activeOpacity={0.8}>
      <Image style={[styles.photos, photo === item.uri && styles.selectedImage]} source={{ uri: item.uri }} />
    </TouchableOpacity>
  );

  // Hook to get recent photos on component mount
  useEffect(() => {
    getRecentPhotos();
  }, []);

  // Hook to get camera permissions on component mount
  useEffect(() => {
    getPermissionsAsync();
  }, []);

  return (
     <LinearGradient colors={['#420C58',  '#211134', '#594677']} style={styles.container} behaviour="padding" >
    <View >
    {/* Display selected photo */}
    
        {/*<Image style={styles.photo} source={{ uri: photo }} />*/}
            <TouchableOpacity style={styles.postButton} onPress={handlePicture} disabled={!photo}>
        <Text style={styles.postButtonText}>Next</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setPhoto(!photo)}>
      
      {photo ? (
        
           <Image source={{ uri: photo }} style={styles.selectedIage}></Image>
          
      ) : (
        <Camera style={styles.camera} type={Camera.Constants.Type.back} ref={(ref) => setCamera(ref)} />
      )}
      {/*---------------------------*/}
      </TouchableOpacity>
    
      {/*Buttons to select */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={takePicture}>
          <Ionicons name="camera" size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Ionicons name="image-outline" size={32} color="white" />
        </TouchableOpacity>
       
      </View>
      <Text style={styles.test}> Tap to remove image</Text>
      {/*------------------------------*/}

       {photo && <Image source={{ uri: photo }} style={styles.selectedImage} />}
       
      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
          renderItem={renderItem}
        numColumns={3}
      />

    </View>
    </LinearGradient>
  );
}

const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
      width: screenWidth,
  },
  camera: {
  width:     screenWidth/450,
    height:  screenWidth/600,
   marginTop: screenWidth/10
  },
  photo: {
   width: screenWidth/450,
    height: screenWidth/750,
    marginTop: 10
  },
  photos:{
     width: 120,
    height: 100,
    margin: 15,
    alignItems:"center"
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 10,
   // marginBottom: 30,
  },
  button: {
    marginHorizontal: 20,
  },
  postButton: {
    marginTop:10,
    opacity: 0.8,
    alignSelf:"flex-end"
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 26,
    textAlign: 'center',
    marginRight: screenWidth/10,
  },
   selectedImage: {
  
    resizeMode: 'contain',
    marginBottom: 10,
  },
    selectedIage: {
      width: screenWidth/450,
    height: screenWidth/600,
    marginTop:screenWidth/10
    
  },
  test:{
    color: "white",
    margin:13,
    fontSize:20
  }
});
