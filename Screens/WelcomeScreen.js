import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const WelcomeScreen = ({navigation}) => {
  const handleStart = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      {/* <LottieView
        style={StyleSheet.absoluteFillObject}
        source={require('../Lottie/sparkles-animation.json')}
        autoPlay
        loop
      /> */}

      {/* <LottieView
        style={{
          height: '20%',
          width: '75%',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        source={require('../Lottie/welcome.json')}
        autoPlay
        loop
      /> */}

      <Image source={require('../assets/logo.png')} style={styles.logo} />

      <TouchableOpacity style={styles.button} onPress={handleStart}>
        <Text style={styles.buttonText}>Let's Get Started ➡</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: '25%',
    width: '90%',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#052d6e',
    marginTop: '10%',
    height: '8%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '70%',
    borderRadius: 15,
    position: 'relative',
  },
  buttonText: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default WelcomeScreen;
