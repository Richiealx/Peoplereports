// This is the Home screen component.
// It displays a list of posts and allows users to filter them based on their events.
// It also retrieves data from Firebase and updates the state with new data using useEffect and onSnapshot.
import {  TouchableOpacity,KeyboardAvoidingView, StyleSheet, Text, View, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import FooterNav from '../components/FooterNav'
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import { selectUid, selectAmail, selectLoggedIn } from '../components/authSlice';
import { doc, getDoc } from "firebase/firestore";
import { getFirestore, collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from '../firebase';
import { formatDistanceToNow } from 'date-fns';


const HomeScreen = ({ navigation }) => {

  // Set up state variables using the useState hook
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState('All')

  // Access user data from the Redux store using the useSelector hook
  const uid = useSelector(selectUid);
  const email = useSelector(selectAmail);

  // Output the user ID to the console for debugging purposes
  console.log(uid);

  // Use the useEffect hook to fetch data from Firestore when the component mounts
  useEffect(() => {
    // Define a query to retrieve all cities from the Firestore "cities" collection,
    // sorted by the "timeStamp" field in descending order
    const citiesRef = query(collection(db, "cities"), orderBy("timeStamp", "desc"));

    // Set up a snapshot listener on the query to receive realtime updates
    const unsubscribe = onSnapshot(citiesRef, (snapshot) => {
      // Create a new array to hold the retrieved cities, with their ID and time elapsed since creation
      const newCities = [];
      snapshot.forEach(async (doc) => {
        const city = doc.data();
        const id = doc.id;
        // Calculate the time elapsed since the post was created using the date-fns library
        const timeElapsed = formatDistanceToNow(city.timeStamp.toDate(), { addSuffix: true });
        newCities.push({ ...city, id, timeElapsed });
      });
      // Update the component state with the new array of cities and mark loading as complete
      setCities(newCities);
      setLoading(false);
    });

    // Return a function to unsubscribe from the snapshot listener when the component unmounts
    return unsubscribe;
  }, []);

  // Define a function to handle selection of the "All" or "Favorites" options in the dropdown menu
  const handleEventSelection = (option) => {
    setSelectedOption(option);
  };

 const renderItem = ({ item }) => {
    
    if (selectedOption === 'All' || item.selectedOption === selectedOption) {
      return (
        <View key={item.id} style={{ flex: 0 }}>
        <View>
        <View style={styles.topgrid}>
        <View style={styles.brofile}>
         
         {item.username ?
        <>
          <Image source={{ uri: item.hoto }} style={styles.profilePicture} />
            <Text style={styles.title}>{item.username}</Text>
            </>
         :
         <>
           <Text style={styles.title}>{item.email}</Text>
           
           </>
         }
          
          </View>
          <Text style={styles.title}>{item.selectedOption}</Text>
          </View>
           <View style={styles.location} >
           {item.locationData.region&& item.locationData.subregion ?
          (<Text style={styles.title}>{item.locationData.region},{item.locationData.subregion}</Text>)
          :
          (<Text style={styles.title}>{item.locationData}</Text>)
          }
          </View>
          </View>
          <Image source={{ uri: item.photo }} style={{ width: 450, height: 480 , }} />
          <Text style={styles.time}>{item.timeElapsed}</Text>
          <View style={styles.info}>
            <Text style={styles.title1}>{item.topic}</Text>
            <Text style={styles.description}>{item.describe}</Text> 
          </View>
        </View>
      );
    } else {
      return null;
    }
  };

  return (
   <LinearGradient colors={['#420C58',  '#211134', '#594677']}  style={styles.container} behaviour="padding">
      <KeyboardAvoidingView >
        <View style={styles.event}>
       
        <TouchableOpacity style={[styles.events ,selectedOption==="All" && styles.selectedOption]} onPress={() => handleEventSelection('All')}>
            <Text style={styles.eventid}>All</Text>
          </TouchableOpacity>
          <View style={styles.evens}></View>
          <TouchableOpacity style={[ styles.events,selectedOption==="Accident" && styles.selectedOption]} onPress={() => handleEventSelection('Accident')}>
         <Text style={styles.eventid}>Accident</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.events,selectedOption==="Riot" && styles.selectedOption]} onPress={() => handleEventSelection('Riot')}>
          <Text style={styles.eventid} >Riot</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.events, selectedOption==="Fighting" && styles.selectedOption]} onPress={() => handleEventSelection('Fighting')}>
          <Text style={styles.eventid} >Fighting</Text>
         </TouchableOpacity>
     
      </View>
     
        {loading ? (
          
          <Text>Loading data...</Text>
        ) : (   
          <FlatList
            data={cities}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        )}

      
      </KeyboardAvoidingView>
      
    </LinearGradient>
  )
}

export default HomeScreen



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  safeAreaView:{
    
   },
  event:{
    display:"flex",
    flexDirection:"row",
    justifyContent:"space-evenly",
    borderBottomWidth:3,
    borderColor:"#D1D0D0",
    
  },
  events:{
    marginBottom:10,
     padding:10,
     borderWidth: 2,
     borderColor:"#D1D0D0",
  },
  evens:{
    borderRightWidth: 6,
    marginBottom:10,
    borderColor:"#D1D0D0",
  },
  eventid:{
    fontSize:25,
    color:"#D1D0D0",
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
    color: "#7B61FF"
  },
    title1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
    
    color: "#D1D0D0"
  },
  description: {
    fontSize: 24,
    marginBottom: 40,
    color:"white",
  },
  userId: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 2,
  },
  email: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 10,
  },
  info:{
    marginTop:-10,
    marginBottom:10,
  },
  selectedOption:{
     backgroundColor:  '#7B61FF',
     borderColor:"#7B61FF",
     borderRadius:10
   
  },
    profilePicture: {
    width: 30,
    height: 30,
    borderRadius: 50,
  
  },
  brofile:{
    display:"flex",
    flexDirection:"row",
    gap: 10,
    alignitems: 'center',
  },
  location:{
    alignItems:'flex-end'
  },
  topgrid:{
    marginBottom:-30
  },
  time:{
    color: "#D1D0D0",
    fontWeight:"bold",
    alignSelf:"flex-end"
  },
});
