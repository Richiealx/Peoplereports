import { useState } from 'react';
import * as Location from 'expo-location';

const useLocation = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState(null);
const [manualLocation, setManualLocation] = useState('');

const handleGetLocation = async () => {
  if (isClicked) {
    setLocation(null);
    setAddress(null);
    setErrorMsg(null);
    setIsClicked(false);
  } else {
    if (manualLocation) {
      setLocation({ coords: { latitude: 0, longitude: 0 } });
      setAddress({ city: manualLocation });
      setIsClicked(true);
    } else {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      let geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setAddress(geocode[0]);
      setIsClicked(true);
    }
  }
};

  return {
    isClicked,
    location,
    errorMsg,
    address,
    handleGetLocation,
    manualLocation,
    setManualLocation
  };
};

export default useLocation;
