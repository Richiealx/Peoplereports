import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth,  signInWithEmailAndPassword, } from "firebase/auth";
import { useDispatch } from 'react-redux';
import { setUid, setAmail } from '../components/authSlice';
import { setLoggedIn } from '../components/authSlice';

const LoginScreen = ({ navigation }) => {
  // State to store email and password entered by user
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const dispatch = useDispatch();

  // Function to handle user login
  const handleLogin = () => {
    // Get authentication object from Firebase
    const auth = getAuth();

    // Call signInWithEmailAndPassword method to authenticate user
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(user.email);
        console.log(user.uid)

        // Dispatch actions to update Redux store with user information
        const uid = user.uid;
        dispatch(setUid({ uid, email }));
        dispatch(setAmail(user.email));
        dispatch(setLoggedIn(true));

        // Navigate to home screen
        navigation.navigate('Home');
      })
      .catch(error => alert(error.message))
  }

  // Function to navigate to sign-up screen
  const SignUp = () => {
    navigation.navigate("RegisterScreen")
  }

  return (
    // Apply linear gradient to background
    <LinearGradient colors={['#420C58',  '#211134', '#594677']} style={styles.container} behaviour="padding">
      <KeyboardAvoidingView>
        <View style={styles.contain}>
          <View style={styles.head}>
            <Text style={styles.header}>Sign into</Text>
            <Text style={styles.header}>your account</Text>
          </View>
          {/* Email input field */}
          <View>
            <TextInput placeholder='Email'
              placeholderTextColor="white"
              value={email}
              onChangeText={text => setEmail(text)}
              style={styles.input}
            />
          </View>
          {/* Password input field */}
          <View>
            <TextInput placeholder='Password'
              placeholderTextColor="white"
              value={password}
              onChangeText={text => setPassword(text)}
              style={styles.input}
              secureTextEntry
            />
          </View>
          {/* Login button */}
          <View>
            <TouchableOpacity onPress={handleLogin} style={styles.button}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
      {/* Sign-up link */}
      <View style={styles.sign}>
        <Text style={styles.signinfo}>Don't have an account?</Text>
        <Text style={styles.buttonTet} onPress={SignUp}>Sign Up</Text>
      </View>
    </LinearGradient>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    height: '50%',
  },
  contain: {
    marginTop: -100
  },
  header: {
    color: "#D1D0D0",
    fontWeight: "800",
    fontSize: 32,
  },
  head: {
    width: "52%",
    alignSelf: "flex-start",
    marginBottom: 60,
  },

input:{
   
    margin: 12,
    //borderWidth: 1,
    borderBottomWidth:1,
    borderColor:"#D1D0D0",
    fontWeight: "500",
  fontSize: 20,
paddingBottom:20,
color:"white",
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
  fontSize: 16,
  
},
sign:{
    position:'absolute',
    bottom:0,
    padding: 20,
    display:"flex",
    flexDirection:"row",
    gap:10
    
},
signinfo:{
  color:"#D1D0D0",
  fontSize: 22,
  fontWeight: 400,
},
buttonTet:{
  color:"#420C58",
  fontSize: 22,
  fontWeight: 400,
}
})



