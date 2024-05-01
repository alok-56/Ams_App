import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Text,
  Alert,
} from 'react-native';
import {encode} from 'base-64';
import {encode as base64Encode} from 'base-64';

const Login = ({navigation}) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const fetchEmployeeDropdownData = async id => {
    const Username = 'SVVG'; // Replace with your actual username
    const Password = 'Pass@123'; // Replace with your actual password
    const basicAuth = 'Basic ' + base64Encode(Username + ':' + Password);

    try {
      const response = await fetch(
        'https://ezatlas.co.in/AMS-SVVG-ANDROID/webapi/install/emp_dropdown',
        {
          method: 'GET',
          headers: {
            Authorization: basicAuth,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data && Array.isArray(data.data)) {
        await AsyncStorage.setItem('userDetails', JSON.stringify(data.data));
        await AsyncStorage.setItem('userId', JSON.stringify(id));
        console.log(data);
      }
    } catch (error) {
      console.error('Error fetching employee dropdown data:', error);
    }
  };
  const storeData = async newData => {
    try {
      await AsyncStorage.setItem('userId', newData);

      console.log('Data stored successfully!');
    } catch (error) {
      console.error('Error storing data:', error);
    }
  };
  const handleLogin = async () => {
    try {
      console.log('hello');
      const basicAuthCredentials = 'SVVG:Pass@123';
      const base64Credentials = encode(basicAuthCredentials);

      const loginApiCredentials = `${name}:${password}`;
      const base64LoginApiCredentials = encode(loginApiCredentials);

      const response = await fetch(
        `http://13.235.186.102/SVVG-API/webapi/Login/UsersLogin?username=${name}&password=${password}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Basic ${base64Credentials}`,
          },
          body: JSON.stringify({
            username: name,
            password: password,
          }),
        },
      );

      const responseText = await response.text();
      console.log('Response Text:', responseText);

      const responseMatch = responseText.match(/\{.*\}/);

      if (responseMatch) {
        const jsonResponse = JSON.parse(responseMatch[0]);

        console.log('Response JSON:', jsonResponse);
        await AsyncStorage.setItem('userAccess', JSON.stringify(jsonResponse));
        if (jsonResponse.data && jsonResponse.data.length > 0) {
          const user = jsonResponse.data[0];

          const userType = user.type_user;
          const userIdType = user.id_usertype;
          const userId = user.id_emp_user;
          fetchEmployeeDropdownData(userId);
          storeData(userId);
          console.log('User Type:', userType);
          console.log('User ID Type:', userIdType);
          console.log('User ID:', userId);

          Alert.alert('Login', 'Login successful');

          navigation.navigate('Dashboard', {userId});
          return;
        } else {
          Alert.alert('Login Failed', 'Invalid username or password');
        }
      } else {
        console.log('Could not find JSON in the response.');
      }

      if (!response.ok) {
        console.error('Failed to log in:', response.status);
        Alert.alert(
          'Login Failed',
          `Failed to log in. Status: ${response.status}`,
        );
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Error', 'An error occurred during login.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/login.jpeg')} style={styles.logo} />
      <View style={styles.inputContainer}>
        <View style={styles.iconContainer}>
          <Icon name="user" size={24} color="gray" style={styles.icon} />
        </View>
        <TextInput
          placeholder="Enter User name"
          placeholderTextColor="gray"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.iconContainer}>
          <Icon name="lock" size={24} color="gray" style={styles.icon} />
        </View>
        <TextInput
          placeholder="Enter Password"
          placeholderTextColor="gray"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={togglePasswordVisibility}>
          <Icon
            name={showPassword ? 'eye' : 'eye-slash'}
            size={20}
            color="black"
          />
        </TouchableOpacity>
      </View>
      {/* <TouchableOpacity
        style={styles.resetbutton}
        onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.resetbuttonText}>Forgot password?</Text>
      </TouchableOpacity> */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: '60%',
    height: '25%',
    resizeMode: 'contain',
    alignSelf: 'center',
    marginVertical: '7%',
    marginRight: '10%',
  },
  container: {
    height: '100%',
    width: '100%',
    justifyContent: 'flex-start',
    padding: 10,
    backgroundColor: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    width: '90%',
    marginLeft: '5%',
    backgroundColor: '#f0f0f0',
  },
  iconContainer: {
    padding: 10,
  },
  icon: {
    color: 'gray',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    color: 'black',
  },
  loginButton: {
    backgroundColor: '#ff8a3d',
    borderWidth: 1,
    borderColor: '#ff8a3d',
    padding: 12,
    alignItems: 'center',
    marginHorizontal: '30%',
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 10,
    marginTop: '15%',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resetbutton: {
    alignItems: 'flex-end',
    marginRight: '10%',
    marginBottom: '15%',
  },
  resetbuttonText: {
    color: '#6bbcfa',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: '2%',
  },
  eyeIcon: {
    position: 'absolute',
    top: '30%',
    right: '4%',
  },
});

export default Login;
