import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth} from "firebase/auth";
import { useFocusEffect} from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectUid } from '../components/authSlice';
import { db } from '../firebase';
import { getFirestore, collection, onSnapshot, doc, getDoc,query, where, getDocs, } from "firebase/firestore";
import { setLoggedIn } from  '../components/authSlice';
import { useDispatch } from 'react-redux';

// Define the UserUpdate component
const UserUpdate = ({navigation}) => {
  // Set up state variables for user data, email, username, and photo
    const [userData, setUserData] = useState(null);
   const [email, setEmail] = useState("")
  const [username, setUsername] = useState('');
  const [photo, setPhoto] = useState("");
    // Get the user ID using the Redux selector
    const uid = useSelector(selectUid);
    // Get the Redux dispatch function
     const dispatch = useDispatch();
    
       // Define the handleLogout function to log the user out
     const handleLogout = ({ss}) => {
  dispatch(setLoggedIn(false));
 }

  // Use the useEffect hook to get the user data from Firestore
useFocusEffect(
React.useCallback(() => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    setEmail(user.email);
    setUsername(user.displayName);
    setPhoto(user.photoURL);
    console.log(user.photoURL)
  }
}, [])
);



   return (
         <LinearGradient colors={['#420C58',  '#211134', '#594677']}  style={styles.container} >
      <View style={styles.contain}>
    <View style={styles.profilePictureContainer}>
    {photo ? (
           <Image source={{ uri: photo }} style={styles.profilePicture}></Image>
      ) : (
         <Image
          style={styles.profilePicture}
          source={{ uri: 'https://i.imgur.com/SYVJvjA.png' }}   
        />
      )}
     </View>
       <View>
        <Text style={styles.input}>Email: {email}</Text>
  
       </View>

       <View>
         <Text style={styles.input}>Username: {username}</Text>
       </View>
            <View>
        <TouchableOpacity  style={styles.button} onPress={() => navigation.navigate("recent")}>
          <Text style={styles.buttonText}>Recentpost</Text>
        </TouchableOpacity> 
       </View>
      <View>
        <TouchableOpacity  style={styles.button} onPress={() => navigation.navigate("Uupdate1", {item1: email, item2:username,  item4:photo})}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity> 
       </View>
      </View>
    <TouchableOpacity  style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>     
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
    borderColor:"white",
    fontWeight: "500",
  fontSize: 20,
paddingBottom:20,
},
button:{
  marginTop:20,
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
    marginBottom: 30
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