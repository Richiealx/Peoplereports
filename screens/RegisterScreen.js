import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth, createUserWithEmailAndPassword ,signInWithEmailAndPassword , onAuthStateChanged} from "firebase/auth";
import { useNavigation, useRoute } from '@react-navigation/native';

const RegisterScreen = ({navigation}) => {
 
  // State variables for email and password
  const [email, setEmail] = useState("")
  const [password,  setPassword] = useState("")

  // Function to handle sign up
  const handleSignUp = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // User registration successful
        const user = userCredential.user;
        console.log(user);
        alert("Registration successful!");
      })
      .catch((error) => {
        // If there's an error during registration, show the error message
        alert(error.message)
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };

  // Function to navigate to the Login screen
  const Login = () =>{
    navigation.navigate("Login")
  }
  

  
   return (
    
    
         <LinearGradient colors={['#420C58',  '#211134', '#594677']} 

         style={styles.container} behaviour="padding">
         <KeyboardAvoidingView>

      <View style={styles.contain}>
               <View style={styles.head}>
      <Text style={styles.header} >Create</Text>
      <Text style={styles.header} > your account</Text>
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

      {/*</View>*/}

      {/*<View style={styles.buttonContainer}>*/}
      <View>
        <TouchableOpacity onPress={handleSignUp} style={styles.button}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity> 
       </View>

  
      </View>

    
      </KeyboardAvoidingView>
                  <View style={styles.sign}>
        
        <Text style={styles.signinfo}>Don't have an account?</Text>
          <Text style={styles.buttonTet} onPress={Login}>Sign in</Text>
        
       </View>
     </LinearGradient>

     
    
  )
}

export default RegisterScreen

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
header:{
 
  color: "#D1D0D0",
  fontWeight: "800",
  fontSize: 32,
  //font: "Manrope"
},
head:{
  display:"flex",
  flexDirection:"column",
  marginBottom: 60,
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