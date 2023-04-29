import { StatusBar } from 'react-native';
import React, { useState, useEffect } from 'react';
import { getAuth,  signOut} from "firebase/auth";
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import PostScreen from './screens/PostScreen';
import PostScreen2 from './screens/Postscreen2';
import UserUpdate from './screens/UserUpdate';
import UserUpdate1 from './screens/UserUpdate1';
import FooterNav from './components/FooterNav';
import Discovers from './screens/Discover';
import Search from './screens/Search';
import Recentpost from './screens/Recentpost';
import { useSelector } from "react-redux";
import {selectLoggedIn} from './components/authSlice';

const StartStack = createNativeStackNavigator();
const EndStack = createNativeStackNavigator();
const auth = getAuth();
const Tab = createBottomTabNavigator();



function HomeStackScreen({}) {
  
  return (
    <StartStack.Navigator>
      <StartStack.Screen options={({ navigation }) => ({headerStyle: { backgroundColor: '#420C58'},headerShown: true,
         headerTintColor: 'white',})} name="Home" component={HomeScreen} />
        <StartStack.Screen options={({ navigation }) => ({headerTitle:"Create Post", headerStyle: { backgroundColor: '#420C58'},headerShown: true,
         headerTintColor: 'white', headerTitleAlign: 'center',headerTitleStyle: { fontSize: 24 },})} name="Post" component={PostScreen} />
        <StartStack.Screen options={({ navigation }) => ({headerTitle:"Post" ,headerStyle: { backgroundColor: '#420C58'},headerShown: true,
         headerTintColor: 'white', headerTitleAlign: 'center',headerTitleStyle: { fontSize: 24 },})} name="Post2" component={PostScreen2} />
        <StartStack.Screen options={({ navigation }) => ({headerTitle:"Profile", headerStyle: { backgroundColor: '#420C58'},headerShown: true,
         headerTintColor: 'white', headerTitleAlign: 'center',headerTitleStyle: { fontSize: 24 },})} name="Uupdate" component={UserUpdate} />
        <StartStack.Screen options={({ navigation }) => ({headerTitle:" Edit Profile " ,headerStyle: { backgroundColor: '#420C58'},headerShown: true,
         headerTintColor: 'white', headerTitleAlign: 'center',})} name="Uupdate1" component={UserUpdate1} />
           <StartStack.Screen options={({ navigation }) => ({headerTitle:"  " ,headerStyle: { backgroundColor: '#420C58'},headerShown: true,
         headerTintColor: 'white', headerTitleAlign: 'center',})} name="recent" component={Recentpost} />
        <StartStack.Screen options={{headerShown: false}} name="Search" component={Search} />
        <StartStack.Screen options={{headerShown: false}} name="Discover" component={Discovers} />
    </StartStack.Navigator>
  );
}

export default function App() {
     
  const isLoggedIn = useSelector(selectLoggedIn);

  return (
 
      <NavigationContainer>
       <StatusBar translucent={true} backgroundColor="transparent" barStyle="light-content" />
        {isLoggedIn ? (
          <Tab.Navigator tabBar={(props) => <FooterNav {...props} />}>
         <Tab.Screen name="Home" options={{headerShown: false}} component={() => <HomeStackScreen />} />
          </Tab.Navigator>
        ) : (
          <StartStack.Navigator>
          <StartStack.Screen options={{headerShown: false}} name="Login" component={LoginScreen} />
            <StartStack.Screen options={{headerShown: false }} s name="RegisterScreen" component={RegisterScreen}/>
          </StartStack.Navigator>
        )}
      </NavigationContainer>
 
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
