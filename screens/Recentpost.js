import { KeyboardAvoidingView, FlatList,  StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { getFirestore, collection, onSnapshot, query, where, orderBy, deleteDoc, doc } from "firebase/firestore";
import { db } from '../firebase';
import { formatDistanceToNow } from 'date-fns';
import { Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { selectUid} from '../components/authSlice';

export default function Recentpost() {
 const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState('All')
  const  [id, setID] = useState("")

  const uid = useSelector(selectUid);

  const windowWidth = Dimensions.get('window').width;
  const numColumns = 3;
  const itemWidth = windowWidth / numColumns;
    
  useEffect(() => {
    const citiesRef = query(collection(db, "cities"), where("id", "==", uid));
    const unsubscribe = onSnapshot(citiesRef, (snapshot) => {
      const newCities = [];
      snapshot.forEach(async (doc) => {
        const city = doc.data();
        const id = doc.id;
        setID(id);
        // Calculate the time elapsed since the post was created
        const timeElapsed = formatDistanceToNow(city.timeStamp.toDate(), { addSuffix: true });
        newCities.push({ ...city, id, timeElapsed });
      });
      setCities(newCities);
      setLoading(false);
    });
    return unsubscribe;
  }, []);


  const [selectedItems, setSelectedItems] = useState([]);

  const selectItem = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const deleteSelectedItems = async () => {
    try {
      const deletePromises = selectedItems.map((id) => deleteDoc(doc(collection(db, "cities"), id)));
      await Promise.all(deletePromises);
      console.log("Documents successfully deleted!");
      const updatedCities = cities.filter((city) => !selectedItems.includes(city.id));
      setCities(updatedCities);
      setSelectedItems([]);
    } catch (error) {
      console.error("Error deleting documents: ", error);
    }
  };

  const renderDeleteButton = () => {
    if (selectedItems.length > 0) {
      return (
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteSelectedItems()}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  };

const renderItem = ({ item }) => {
  const isSelected = selectedItems.includes(item.id);

  if (selectedOption === 'All' || item.selectedOption === selectedOption) {
    return (
      <TouchableOpacity
        key={item.id}
        style={{ flex: 0 }}
        onPress={() => selectItem(item.id)}
        onLongPress={() => setSelectedItems([item.id])}
      >
        <View>
          <View style={styles.topgrid}>
            <Text style={styles.title}>{item.selectedOption}</Text>
          </View>
          <View style={styles.location}>
            {item.locationData.region && item.locationData.subregion ? (
              <Text style={styles.title}>
                {item.locationData.region},{item.locationData.subregion}
              </Text>
            ) : (
              <Text style={styles.title}>{item.locationData}</Text>
            )}
          </View>
        </View>
        <Image source={{ uri: item.photo }} style={{ width: 150, height: 180 }} />
        <Text style={styles.time}>{item.timeElapsed}</Text>
        <View style={styles.info}>
          <Text style={styles.title1}>{item.topic}</Text>
          <Text style={styles.description}>{item.describe}</Text>
        </View>
       {isSelected && selectedItems.length > 0 && (
         <TouchableOpacity style={styles.deleteButton} onPress={() => deleteSelectedItems()}>
         <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
           )}

      </TouchableOpacity>
    );
  } else {
    return null;
  }
};

  return (
    
         <LinearGradient colors={['#420C58',  '#211134', '#594677']} style={styles.container} >
           {loading ? (
          
          <Text>Loading data...</Text>
        ) : (   
            <>
         <FlatList
          data={cities}
          renderItem={renderItem}
           keyExtractor={(item) => item.id}
           numColumns={numColumns}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
           style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 2 }}
              getItemLayout={(data, index) => ({ length: itemWidth, offset: itemWidth * index, index })}/>
              {selectedItems.length > 0 && (
      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteSelectedItems()}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    )}
    </>
        )}
        
      </LinearGradient>   

  )
}

const styles = StyleSheet.create({
container:{
  display:"flex",
  flexDirection:"column",
    flex:1,
    justifyContent: 'center',
   alignItems:"center" 
},
deleteButton: {
  backgroundColor: 'red',
  padding: 10,
  alignItems: 'center',
  marginTop: 5,
},
deleteText: {
  color: 'white',
  fontWeight: 'bold',
},
title:{
    color:'white'
}

})