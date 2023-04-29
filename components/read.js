import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import * as Location from 'expo-location';
import { GOOGLE_MAPS_API_KEY } from '@env';

const MyComponent = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    if (location) {
      (async () => {
        try {
          let response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.coords.latitude},${location.coords.longitude}&key=${GOOGLE_MAPS_API_KEY}`
          );
          let data = await response.json();
          setAddress(data.results[0].formatted_address);
        } catch (error) {
          console.log('Error getting address', error);
        }
      })();
    }
  }, [location]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {errorMsg ? (
        <Text>{errorMsg}</Text>
      ) : location ? (
        <>
          <Text>Latitude: {location.coords.latitude}</Text>
          <Text>Longitude: {location.coords.longitude}</Text>
          {address && <Text>Address: {address}</Text>}
        </>
      ) : (
        <Text>Loading location...</Text>
      )}
    </View>
  );
};
