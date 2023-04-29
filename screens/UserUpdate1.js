import {  StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth, updateEmail,updatePassword, updateProfile} from "firebase/auth";
import { useRoute } from '@react-navigation/native';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import { useSelector } from 'react-redux';
import { selectUid } from '../components/authSlice';
import { db, } from '../firebase';
import { collection, query, where, getDocs,  setDoc } from 'firebase/firestore';


// Define UserUpdate component
const UserUpdate = ({navigation}) => {
  
   // Get params from route
  const route = useRoute();
  const { item1, item2 , item4 } = route.params;

  // Define state variables
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(item1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [password,  setPassword] = useState("");
  const [username, setUsername] = useState(item2);
  const [photo, setPhoto] = useState('');
  const [hoto, setHoto] = useState(item4);
  const [picture, setPicture] = useState(item4);
  const [downloadURL, setDownloadURL] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prog, setProg] = useState(false);

  // Get user ID from Redux store
  const uid = useSelector(selectUid)

  
// Get Firebase auth and storage instances
  const auth = getAuth();
  const storage = getStorage();

// Define function to pick an image from device's gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [2, 2],
      quality: 1,
    });
   
    if (!result.cancelled) {
      setPhoto(result.uri);
      setSuccess(null);
    }
  };

  // Upload image to Firebase storage when `photo` state changes
  useEffect(()=>{
    const uploadFile = async() =>{
      const date = new Date();
      const name =  photo;
      const storageRef = ref(storage, "images/" + date.toLocaleString() + name.slice(137,260));
      const response = await fetch(photo);
      const blob = await response.blob();
      const uploadTask = uploadBytesResumable(storageRef, blob);
      
      // Update progress bar
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress +'% done');
          setProg(progress);
          setFile('Upload is ' + progress +'% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
            default:
              break;
          }
        }, 
        (error) => {
          console.log(error);
        }, 
        () => {
          // Get download URL of uploaded image
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            setDownloadURL(downloadURL);
            setHoto(downloadURL);
          });
        }
      );
    }
    if (photo) {
      uploadFile();
    }
  },[photo] )

// function to update user's email, password, displayName and photoURL in Firebase Authentication
const updateEmailAndPassword = async (uid, newEmail, newPassword, displayName, photoURL) => {
  try {
    const user = await auth.currentUser;
    
    // check if uid is provided
    if (uid) {
   
      // update email and password
      await updateEmail(user, newEmail);
      await updatePassword(user, newPassword);
      console.log('Email and password updated successfully');
       
      // update display name and photo URL
      await updateProfile(user, { displayName, photoURL})  
      console.log("photo"+ photoURL)
      setSuccess(null);
    }
  } catch (error) {
    console.log('Error updating email and password:', error);
  }
};

// function to update user's data in Firestore
const handleData = async (e) => { 
  const q = await query(collection(db, "cities"), where("id", "==", uid));
  const querySnapshot = await getDocs(q);

  // loop through all documents returned by the query and update their data
  for (const doc of querySnapshot.docs) {
    const newData = {
      ...doc.data(),
      hoto,
      username,
    };
    await setDoc(doc.ref, newData);
  }
};

// set initial state for isSuccess to false
const [isSuccess, setIsSuccess] = useState(false);

// function to handle form submit and update user's email, password, displayName and photoURL in Firebase Authentication and Firestore
const handleSave = async () => {
  // check if image upload is not yet 100% and hoto is null
  if (prog !== 100 && hoto == null) {
    setError("wait for image upload to be 100%");
    setSuccess(null)
  }
  setLoading(true);
  setIsLoading(true);
    
  try {
    // update email, password, displayName and photoURL in Firebase Authentication
    await updateEmailAndPassword(uid, email, password, username, downloadURL);
    
    // update user's data in Firestore
    await handleData();

    // handle success
  } catch (error) {
    // handle error
  } finally {
    setIsSuccess(true);
    setIsLoading(false);
    setLoading(false);
    setError(null)
    setSuccess("Succesfully updated")
  }
};

   return (
         <LinearGradient colors={['#420C58',  '#211134', '#594677']} 

         style={styles.container} behaviour="padding">
         
     
      <View style={styles.contain}>
    <View style={styles.profilePictureContainer}>
         <Text style={styles.upoad}>{file}</Text>
      <TouchableOpacity  style={styles.profiile} onPress={pickImage}>
    {photo ? (
     <Image source={{ uri: photo }} style={styles.profilePicture} />
    ) : picture ? (
    <Image source={{ uri: picture }} style={styles.profilePicture} />
    ) : (
   <Image source={{ uri: 'https://i.imgur.com/SYVJvjA.png' }} style={styles.profilePicture} />
    )}
      {/*---------------------------*/}
      </TouchableOpacity>
       {/*<Ionicons style={styles.imageIcon} name="image-outline" size={32} color="white" onPress={pickImage}/>*/}
     </View>


       <View>
        <TextInput placeholder='Username' 
        placeholderTextColor="white"
        value={username} 
        onChangeText={text => setUsername(text)} 
        style={styles.input}
         
        />
       </View>
      <View>
        <TextInput placeholder='Username/Email' 
        placeholderTextColor="white"
        value={email} 
        onChangeText={text => setEmail(text)} 
        style={styles.input}
        
        />
       </View>

       <View>
       <TextInput placeholder='Password' 
        placeholderTextColor="white"
        value={password} 
        onChangeText={text => setPassword(text)} 
        style={styles.input}
        secureTextEntry
        />
        </View>
        <Text style={styles.upload}>{error} </Text>
         {isLoading ? (
        <Text style={styles.buttonText}>Saving, please wait</Text>
      ) : isSuccess ? (
        <Text style={styles.buttonText}>Saved successfully!</Text>
      ):(
        <></>
        )}
       
      <View>
        <TouchableOpacity  style={styles.button} onPress={handleSave} disabled={loading} >
        <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity> 
       </View>
      </View>
     </LinearGradient>
  )
}

export default UserUpdate

const styles = StyleSheet.create({
container:{
  display:"flex",
  flexDirection:"column",
    flex:1,
    justifyContent: 'center',
    padding:20,
   
     height: '50%',   
},
contain:{
  marginTop: -100
},
input:{
   color:"white",
    margin: 12,
    //borderWidth: 1,
    borderBottomWidth:1,
    borderColor:"white",
    fontWeight: "500",
  fontSize: 20,
paddingBottom:20,
},
upload:{
   color:"red",
    //borderWidth: 1,
    borderColor:"white",
    fontWeight: "500",
  fontSize: 20,
},
upoad:{
   color:"blue",
    //borderWidth: 1,
    borderColor:"white",
    fontWeight: "500",
  fontSize: 20,
},
button:{
  marginTop:60,
  backgroundColor: '#594677',
  width:"100%",
  padding: 15,
  borderRadius:10,
  alignItems:"center",
},
buttonText:{
  color: "#D1D0D0",
  fontWeight: "700",
  fontSize: 26,
  
},
  profilePictureContainer: {
    position: 'relative',
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 50,
    alignSelf:"center",
    marginBottom: 0
  },
  imageIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,ackgroundColor: 'transparent',
    zIndex: 1,
  },


})