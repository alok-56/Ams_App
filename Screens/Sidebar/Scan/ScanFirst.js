import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Table, Row, Rows} from 'react-native-table-component';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RNFS from 'react-native-fs';
// import ReactNativeBlobUtil from 'react-native-blob-util';
// import RNFetchBlob from 'rn-fetch-blob';

const ScanFirst = ({navigation}) => {
  const [tableData, setTableData] = useState([]);
  const tableDataHeading = ['Asset Id'];

  const handlePhysical = () => {
    navigation.navigate('Scan');
  };
  useEffect(() => {
    retrieveData();
  }, []);

  const downloadTableData = async () => {
    try {
      const fileName = 'tableData.txt';
      const filePath = RNFS.DocumentDirectoryPath + '/' + fileName;

      // Convert tableData to a string
      const tableDataString = tableData.map(row => row[0]).join('\n');

      // Write the string to a file
      await RNFetchBlob.fs.writeFile(filePath, tableDataString, 'utf8');
      await openFile();
      console.log('File downloaded successfully:', filePath);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };
  const openFile = async () => {
    try {
      console.log('tk');
      const filePath = `${RNFetchBlob.fs.dirs.DownloadDir}/tableData.txt`;
      await RNFetchBlob.android.actionViewIntent(filePath, 'text/plain');
    } catch (error) {
      console.error('Error opening file:', error);
    }
  };

  const retrieveData = async () => {
    try {
      const storedDataString = await AsyncStorage.getItem('AssestData');
      if (storedDataString !== null) {
        const storedDataArray = JSON.parse(storedDataString);
        const uniQueData = new Set(storedDataArray);
        setTableData(Array.from(uniQueData));
        console.log('Data retrieved successfully:', storedDataArray);
      } else {
        console.log('No data found in AsyncStorage.');
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };
  const MyTable = ({data, headings}) => {
    const cellWidths = [400]; // Adjust the width as needed

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View
          style={{marginTop: '10%', marginBottom: '10%', alignItems: 'center'}}>
          <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
            <Row
              data={headings}
              style={{
                height: 40,
                backgroundColor: '#052d6e',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
              textStyle={{
                color: 'white',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
              widthArr={cellWidths}
            />
            {data.map((rowData, index) => (
              <Row
                key={index}
                data={[rowData]} // Display the entire row
                style={{
                  height: 35,
                  justifyContent: 'space-evenly',
                  color: 'black',
                  display: 'flex',
                  justifyContent: 'center',
                }}
                textStyle={{
                  textAlign: 'center',
                  color: 'black',
                }}
                widthArr={cellWidths}
              />
            ))}
          </Table>
        </View>
      </ScrollView>
    );
  };

  return (
    <ScrollView>
      <Text style={{textAlign: 'center', fontWeight: 'bold', color: 'black'}}>
        Asset id
      </Text>

      <View style={{backgroundColor: 'gray'}}>
        <ScrollView style={{height: 250}}>
          <MyTable data={tableData} headings={tableDataHeading} />
        </ScrollView>
      </View>

      <TouchableOpacity>
        <Text
          style={{
            color: 'black',
            margin: 20,
            backgroundColor: 'green',
            padding: 25,
            width: 82,
            borderRadius: 40,
            color: 'white',
            fontWeight: 'bold',
            marginLeft: '72%',
            marginTop: 250,
          }}
          onPress={() => navigation.navigate('QrCodeScanner')}>
          Scan
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handlePhysical}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Send for Physical verification</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ff8a3d',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    width: '90%',
    alignSelf: 'center',
    margin: '5%',
    marginTop: '5%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default ScanFirst;
