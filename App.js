import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Clipboard, Linking } from 'react-native';
import { FontAwesome, FontAwesome5 } from 'react-native-vector-icons'; // Import the icons
import axios from 'axios'; // Import axios

const ipstackApiKey = '9ce8b397770fc47a4d764a3de74cd8c6';

const continentColors = {
  Asia: '#ffa500',
  Europe: '#D0A7A7',
  Africa: '#5733FF',
  NorthAmerica: '#48D1CC',
  SouthAmerica: '#33FF57',
  Oceania: '#5733FF',
  Antarctica: '#FFFF33',
};

const Clock = ({ location }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <TouchableOpacity style={styles.clockButton}>
      <FontAwesome name="clock-o" size={24} color="white" />
      <Text style={styles.clockButtonText}>
        {currentTime.toLocaleTimeString()} at {location.locationString}
      </Text>
    </TouchableOpacity>
  );
};

export default function App() {
  const [location, setLocation] = useState(null);
  const [imageUrl, setImageUrl] = useState(
    'https://www.strattic.com/wp-content/uploads/2021/05/ipstack.png'
  );

  const handleImageUrlChange = (url) => {
    setImageUrl(url);
  };

  const fetchLocation = async () => {
    try {
      const response = await axios.get(
        `http://api.ipstack.com/check?access_key=${ipstackApiKey}`
      );
      const { city, region_name, country_name, continent_name, latitude, longitude } = response.data;
      const locationString = `${city}, ${region_name}, ${country_name}`;
      const continentColor = continentColors[continent_name] || '#FFFFFF';
      setLocation({ locationString, continent_name, latitude, longitude, continentColor });
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  const getLocation = () => {
    fetchLocation();
  };

  const copyLocationToClipboard = () => {
    if (location) {
      const { locationString } = location;
      Clipboard.setString(locationString);
      alert('Location information copied to clipboard!');
    }
  };

  const openSocialMedia = (url) => {
    Linking.openURL(url).catch((err) => console.error('Error opening URL:', err));
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground source={{ uri: imageUrl }} style={styles.backgroundImage} blurRadius={3}>
        <Text style={styles.locationText}>Welcome to Ipstack Localization!!!</Text>

        <TouchableOpacity style={styles.getLocationButton} onPress={getLocation}>
          <Text style={styles.buttonText}>Get Location</Text>
        </TouchableOpacity>

        {location ? (
          <View style={[styles.infoContainer, { backgroundColor: location.continentColor }]}>
            <Text style={styles.locationText}>Your Location: {location.locationString}</Text>
            <Text style={styles.locationText}>Continent: {location.continent_name}</Text>
            <Text style={styles.locationText}>Latitude: {location.latitude}</Text>
            <Text style={styles.locationText}>Longitude: {location.longitude}</Text>

            {/* Display the clock */}
            <Clock location={location} />

            <TouchableOpacity style={styles.copyButton} onPress={copyLocationToClipboard}>
              <Text style={styles.copyButtonText}>Copy to Clipboard</Text>
            </TouchableOpacity>

            <View style={styles.socialMediaButtons}>
              <TouchableOpacity
                style={[styles.socialMediaButton, { backgroundColor: '#1877F2' }]}
                onPress={() => openSocialMedia('https://www.facebook.com/')}
              >
                <FontAwesome name="facebook" size={24} color="white" />
              </TouchableOpacity>
              <View style={styles.buttonSpacer} />
              <TouchableOpacity
                style={[styles.socialMediaButton, { backgroundColor: '#1DA1F2' }]}
                onPress={() => openSocialMedia('https://twitter.com/')}
              >
                <FontAwesome name="twitter" size={24} color="white" />
              </TouchableOpacity>
              <View style={styles.buttonSpacer} />
              <TouchableOpacity
                style={[styles.socialMediaButton, { backgroundColor: '#2867B2' }]}
                onPress={() => openSocialMedia('https://www.linkedin.com/')}
              >
                <FontAwesome5 name="linkedin" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </ImageBackground>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 20,
    borderRadius: 10,
    maxWidth: '80%',
    marginTop: 20,
  },
  locationText: {
    fontSize: 20,
    marginBottom: 10,
    color: 'black',
  },
  getLocationButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  copyButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginTop: 10,
  },
  copyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  socialMediaButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  socialMediaButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonSpacer: {
    width: 10, // Adjust the spacing as needed
  },
  clockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#5F027C',
    marginTop: 15,
  },
  clockButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
});
