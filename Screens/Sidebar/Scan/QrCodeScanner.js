import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QRCodeScannerComp = ({navigation}) => {
  const [currentId, setCurrentId] = useState('');
  const [scannedData, setScannedData] = useState('');
  const [scanning, setScanning] = useState(false);
  const [uniQueTableData, setUniqueTableData] = useState([]);

  const storeData = async newData => {
    try {
      console.log('cslling mee');
      // Fetch the previous data from AsyncStorage
      const previousDataString = await AsyncStorage.getItem('AssestData');
      let previousData = previousDataString
        ? JSON.parse(previousDataString)
        : [];

      // Append the new data to the previous data
      previousData = [...previousData, ...newData];

      // Convert the combined array to a JSON string
      const updatedDataString = JSON.stringify(previousData);

      // Save the updated data back to AsyncStorage
      await AsyncStorage.setItem('AssestData', updatedDataString);
      // Alert.alert('QR Code Added Successfully', [
      //   {
      //     text: 'OK',
      //     onPress: () => {
      //       setScanning(true); // Set scanning to false once the user dismisses the alert
      //     },
      //   },
      // ]);
      console.log('Data stored successfully!');
    } catch (error) {
      console.error('Error storing data:', error);
    }
  };

  useEffect(() => {
    const uniQueData = new Set(scannedData);
    setUniqueTableData(Array.from(uniQueData));
  }, [scannedData]);

  const handleFinish = () => {
    console.log(uniQueTableData, 'storing the ');
    if (uniQueTableData.length > 0) {
      storeData(uniQueTableData);
    }
  };
  const handleScan = data => {
    console.log(data);
    setCurrentId(data?.data);
    setScannedData([...scannedData, data?.data]);

    Alert.alert('QR Code Scanned', `Fetched Asset Id ${data?.data}`, [
      {
        text: 'OK',
        onPress: () => {
          setScanning(false);
          // Set scanning to false once the user dismisses the alert
        },
      },
      {
        text: 'Cancel',
        onPress: () => {
          setScanning(false); // Set scanning to false once the user dismisses the alert
        },
      },
    ]);
  };

  const renderBottomContent = () => {
    if (scanning) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="black" />

          <Text style={styles.loadingText}>Scanning...</Text>
        </View>
      );
    }
    const handleGoToPost = () => {
      handleFinish();
      navigation.navigate('Scan');
    };
    return (
      <>
        <View style={{display: 'flex', width: 'auto'}}>
          <TouchableOpacity onPress={handleGoToPost}>
            <Text
              style={{
                textAlign: 'center',
                backgroundColor: '#052d6e',
                color: 'white',
                fontWeight: 'bold',
                padding: 10,
                borderRadius: 10,

                marginTop: '3%',
                marginLeft: '3%',
              }}>
              Save Asset {currentId}
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  useEffect(() => {
    if (scanning) {
      console.log('hhyhyy');
      const scanningTimeout = setTimeout(() => {
        setScanning(false);
      }, 1000); // You can adjust the timeout duration (in milliseconds)
      return () => clearTimeout(scanningTimeout);
    }
  }, [scanning]);

  return (
    <QRCodeScanner
      onRead={data => {
        setScanning(true);
        handleScan(data);
      }}
      reactivate={true}
      reactivateTimeout={1000}
      showMarker={true}
      bottomContent={renderBottomContent()}
      markerStyle={styles.marker}
    />
  );
};

const styles = StyleSheet.create({
  scannedText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: 'black',
  },
  marker: {
    borderColor: 'red', // Add a border color for visibility
    borderWidth: 2,
    height: 100, // Adjust the height of the marker
    width: 350, // Adjust the width of the marker
  },
});

export default QRCodeScannerComp;
