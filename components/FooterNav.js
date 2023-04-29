import React, { useState }  from 'react';
import { Dimensions ,TouchableOpacity, StyleSheet, View, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const FooterNav = () => {

const navigation = useNavigation();
const [selected, setSelected] = useState(false);
const [activeTab, setActiveTab] = useState("");

  const handlePress = (tabName) => {   setActiveTab(tabName); navigation.navigate(tabName)};
  
   
  return (
    <View style={styles.container}>
    <View style={styles.nav}>
     <TouchableOpacity onPress={() => handlePress('Home')} style={[styles.nav]}  >
     <Image source={require('../images/Home.png')} style={[ activeTab==="Home" && styles.activeTab]} />
      <Text style={[styles.text, activeTab==="Home" && styles.activeTab]} >Home</Text>
      </TouchableOpacity>
     </View>

         <View style={styles.nav}>
     <TouchableOpacity onPress={() => handlePress('Discover')} style={[styles.nav]}  >
     <Image source={require('../images/Discover.png')} style={[ activeTab==="Discover" && styles.activeTab]}  />
      <Text style={[ styles.text,activeTab==="Discover" && styles.activeTab]}>Discover</Text>
      </TouchableOpacity>
     </View>

         <View style={styles.nav}>
     <TouchableOpacity onPress={() => handlePress('Post')} style={[styles.nav]}  >
     <Image source={require('../images/Create.png')} style={[ activeTab==="Post" && styles.activeTab]}  />
      <Text style={[ styles.text,activeTab==="Post" && styles.activeTab]}>Create</Text>
      </TouchableOpacity>
     </View>

         <View style={styles.nav}>
     <TouchableOpacity onPress={() => handlePress('Search')}style={[styles.nav]}  >
     <Image source={require('../images/Search.png')} style={[ activeTab==="Search" && styles.activeTab]} />
      <Text style={[ styles.text,activeTab==="Search" && styles.activeTab]}>Search</Text>
      </TouchableOpacity>
     </View>

         <View style={styles.nav}>
     <TouchableOpacity onPress={() => handlePress('Uupdate')} style={[styles.nav]}  >
     <Image source={require('../images/Profile.png')} style={[ activeTab==="Uupdate" && styles.activeTab]} />
      <Text style={[styles.text, activeTab==="Uupdate" && styles.activeTab]}>Profile</Text>
      </TouchableOpacity>
     </View>
    </View>
  );
};

export default FooterNav;
const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    backgroundColor:"#594677",
    justifyContent: 'space-between',
    alignItems: 'center',
    display:"flex",
    flexDirection:"row",
    paddingLeft:screenWidth / 25,
    paddingTop:screenWidth / 25,
    paddingRight:screenWidth / 25,
    
    bottom:0,
   width: screenWidth,
 
    
  },
  text: {
    fontWeight: 'bold',
    fontSize: screenWidth / 30,
    color: 'white',
  },
  nav:{
    display:"flex",
    alignItems:"center"
  },
  activeTab:{
    tintColor: '#7B61FF',
    color:'#7B61FF'
  },
  
 
});

