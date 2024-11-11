import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import messaging from '@react-native-firebase/messaging';

const App = () => {
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    requestLocationPermission();
    configureNotifications();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "EVRS App needs access to your location to display the map.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Location permission denied");
      }
    }
  };

  const configureNotifications = () => {
    messaging().onMessage(async remoteMessage => {
      console.log('A new notification arrived!', remoteMessage);
      setNotification(remoteMessage.notification.body);
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification caused app to open from background state:', remoteMessage);
    });

    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        console.log('Notification caused app to open from quit state:', remoteMessage);
      }
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={(region) => setRegion(region)}
      >
        <Marker
          coordinate={{
            latitude: 37.78825,
            longitude: -122.4324,
          }}
          title="You are here"
          description="This is your current location"
        />
      </MapView>
      {notification && (
        <View style={styles.notification}>
          <Text style={styles.notificationText}>{notification}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  notification: {
    position: 'absolute',
    bottom: 50,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  notificationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default App;
