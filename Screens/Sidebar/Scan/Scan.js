import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView,
  Modal,
  TouchableHighlight,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Sidebar from '../Sidebar';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import DocumentPicker from 'react-native-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {encode as base64Encode} from 'base-64';
import {Table, Row} from 'react-native-table-component';

const Scan = ({navigation}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [idData, setIdData] = useState([]);
  const [currentUserData, setCurrentUserData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [floorData, setFloorData] = useState([]);
  const [idBodyData, setIdBodyData] = useState([]);

  useEffect(() => {
    retrieveUserData();
  }, []);
  const showModal = () => {
    setModalVisible(true);
    retrieveData();
    retrieveUserData();
  };
  const retrieveUserData = async () => {
    try {
      const getData = await AsyncStorage.getItem('userDetails');
      const storedDataArray = JSON.parse(getData);
      const getDataUserId = await AsyncStorage.getItem('userId');
      const storedDataArrayUserID = JSON.parse(getDataUserId);
      const filterData = storedDataArray.filter(
        i => i.id_emp_user === storedDataArrayUserID,
      );
      setCurrentUserData(filterData[0]);
      if (filterData) {
        await getFloorDetails(filterData[0].id_building);
        await getLocationDetails(filterData[0].id_emp_user);
      }
    } catch (error) {
      console.log(error, 'err');
    }
  };
  const getFloorDetails = async id => {
    const Username = 'SVVG'; // Replace with your actual username
    const Password = 'Pass@123'; // Replace with your actual password
    const basicAuth = 'Basic ' + base64Encode(Username + ':' + Password);

    try {
      const response = await fetch(
        `https://ezatlas.co.in/AMS-SVVG-ANDROID/webapi/ScanFileUpload/FloorDropdown?searchword=${encodeURIComponent(
          id,
        )}`,
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
        setFloorData(data.data);
      }
    } catch (error) {
      console.error('Error fetching asset dropdown data:', error);
      // Handle error, e.g., show an error message
    }
  };
  const getLocationDetails = async userId => {
    const Username = 'SVVG'; // Replace with your actual username
    const Password = 'Pass@123'; // Replace with your actual password
    const basicAuth = 'Basic ' + base64Encode(Username + ':' + Password);

    try {
      const response = await fetch(
        `https://ezatlas.co.in/AMS-SVVG-ANDROID/webapi/ScanFileUpload/EMPLocation?id_emp_user=${encodeURIComponent(
          userId,
        )}`,
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
        setLocationData(data.data);
      }
    } catch (error) {
      console.error('Error fetching location dropdown data:', error);
      // Handle error, e.g., show an error message
    }
  };
  const retrieveData = async () => {
    try {
      const storedDataString = await AsyncStorage.getItem('AssestData');
      if (storedDataString !== null) {
        const storedDataArray = JSON.parse(storedDataString);
        const uniQueData = new Set(storedDataArray);
        const transformedArray = Array.from(uniQueData);
        setIdData(transformedArray.map((I, index) => [index, I]));
        const bodayDataTransfer = transformedArray.map(i => ({id_wh_dyn: i}));
        setIdBodyData(bodayDataTransfer);
        console.log('Data retrieved successfully:', storedDataArray);
      } else {
        console.log('No data found in AsyncStorage.');
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };
  const hideModal = () => {
    navigation.navigate('QrCodeScanner');
    setModalVisible(false);
  };
  const saveMessage = () => {
    // Handle the saved message logic here
    console.log('Saved message:', message);
    setModalVisible(false);
  };
  useEffect(() => {
    setModalVisible(true);
    retrieveData();
  }, [navigation]);
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleMenuIconPress}
          style={{position: 'absolute', top: '30%', left: '65%', zIndex: 1}}>
          <Icon name="menu" color="white" size={25} />
        </TouchableOpacity>
      ),
    });
  }, []);
  const handleMenuIconPress = () => {
    setSidebarOpen(prevState => !prevState);
  };
  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={handleBackPress}
          style={{position: 'absolute', top: '30%', left: '20%', zIndex: 1}}>
          <Icon name="arrow-back" color="white" size={25} />
        </TouchableOpacity>
      ),
    });
  });
  const handleBackPress = () => {
    navigation.navigate('Dashboard');
  };
  const [location, setLocation] = useState('');
  const [subLocation, setSubLocation] = useState('');
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const [year, setYear] = useState('');
  const [separateYear, setSeparateYear] = useState('');
  const [showYearpicker, setShowYearpicker] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const handleYearChange = (event, selectedDate) => {
    setShowYearpicker(false);
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      setYear(year.toString());
    }
  };
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      setSelectedDocument(result);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        console.error('Error picking document:', err);
      }
    }
  };

  const scaAsset = async () => {
    navigation.navigate('QrCodeScanner');
  };
  const saveDetails = async () => {
    try {
      if (idBodyData.length <= 0) {
        return Alert.alert(
          'Error',
          'Scan Atleast One Asset to save the Details',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('QrCodeScanner'),
            },
          ],
        );
      }
      // Define Basic Authentication headers
      const Username = 'SVVG'; // Replace with your actual username
      const Password = 'Pass@123'; // Replace with your actual password
      const basicAuth = 'Basic ' + base64Encode(Username + ':' + Password);

      // Construct the API URL
      const apiUrl = `https://ezatlas.co.in/AMS-SVVG-ANDROID/webapi/ScanFileUpload/UploadScan?id_loc=${location}&id_sloc=${subLocation}&id_flr=${floor}&id_emp_user=${currentUserData?.id_emp_user}&year=${year}&period=${separateYear}`;

      const requestBody = {
        data: idBodyData,
      };

      {
        console.log(
          showYearpicker,
          separateYear,
          year,
          floor,
          building,
          subLocation,
          location,
          '---llllllllll',
        );
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: basicAuth,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseText = await response.text();
      console.log('POST Response:', responseText);
      Alert.alert('Saved Successfully', JSON.stringify(responseText), [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Dashboard'),
        },
      ]);
      clearAsyncStorage();
      setIdBodyData([]);
      setIdData([]);
    } catch (error) {
      console.log(error, 'error in save');
    }
  };

  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.removeItem('AssestData');

      console.log('Data CLeared');
    } catch (err) {
      console.log('error', err);
    }
  };

  const MyTable = ({data, headings}) => {
    const cellWidths = [50, 200, 60];

    const handleAddToStorePress = (rowData, rowIndex) => {
      const filtered = idData.filter(i => i[0] !== rowIndex);
      setIdData(prev => (prev = filtered));
      const bodayDataTransfer = filtered.map(i => ({id_wh_dyn: i[1]}));
      setIdBodyData(pre => (pre = bodayDataTransfer));
      handleFilterDataFromAsync(rowData);
    };
    const handleFilterDataFromAsync = async removeId => {
      try {
        console.log(removeId, 'id to be removed');
        const getAsyncValue = await AsyncStorage.getItem('AssestData');
        let format = JSON.parse(getAsyncValue);
        let removeIdValue = format.filter(i => i !== removeId[1]);
        console.log(removeIdValue, 'rmd id value');

        await AsyncStorage.setItem('AssestData', JSON.stringify(removeIdValue));
      } catch (error) {
        console.log(error, 'error');
      }
    };
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {console.log(idData, 'id data')}
        {console.log(idBodyData, 'post body')}
        <View style={{marginTop: '10%', marginBottom: '10%'}}>
          <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
            <Row
              data={headings}
              style={{
                height: 40,
                backgroundColor: '#ff8a3d',
                width: '100%',
              }}
              textStyle={{
                color: 'white',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
              widthArr={cellWidths}
            />
            {idData.length <= 0 ? (
              <Row
                data={[`Please Scan to display the ID's`]}
                style={{
                  height: 35,
                  justifyContent: 'space-evenly',
                  color: 'gray',
                }}
                textStyle={{
                  textAlign: 'center',
                  color: 'gray',
                }}
              />
            ) : (
              data &&
              data.map((rowData, rowIndex) => (
                <Row
                  key={rowIndex}
                  data={[
                    ...rowData, // Columns before "Add to Store"
                    <TouchableOpacity
                      onPress={() => handleAddToStorePress(rowData, rowIndex)} // Pass both id_inv_m and id_inv
                      key={`plusIcon_${rowIndex}`}
                      style={{alignItems: 'center'}}>
                      <Icon name="delete" size={30} color="#ff8a3d" />
                    </TouchableOpacity>,
                  ]}
                  style={{
                    height: 35,
                    justifyContent: 'space-evenly',
                    color: 'black',
                  }}
                  textStyle={{
                    textAlign: 'center',
                    color: 'black',
                  }}
                  widthArr={[...cellWidths]}
                />
              ))
            )}
          </Table>
        </View>
      </ScrollView>
    );
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Modal
          style={styles.containerModal}
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Scanned Assets Ids:</Text>
              {/* <Text
                style={{
                  color: 'black',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: 16,
                  marginBottom: '5%',
                }}>
                AssetID
              </Text> */}

              {/* <TextInput
                style={styles.textInput}
                multiline
                value={idData}
                onChangeText={text => (
                  setIdData(...idData, text), setMessage(text)
                )}
              /> */}
              <MyTable data={idData} headings={['S.NO', 'Asset ID']} />

              <TouchableHighlight
                style={styles.modalButton}
                onPress={saveMessage}>
                <Text style={{color: 'white', fontSize: 16}}>Save</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={styles.modalButton}
                onPress={hideModal}>
                <Text style={{color: 'white', fontSize: 16}}>Scan More...</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>

        <View style={{marginTop: '3%'}}>
          <Text style={styles.headings}>Location</Text>
          <View
            style={{
              borderWidth: 1,
              width: '95%',
              justifyContent: 'center',
              alignSelf: 'center',
              height: 58,
              borderRadius: 5,
            }}>
            <Picker
              selectedValue={location}
              onValueChange={itemValue => setLocation(itemValue)}
              style={styles.picker}
              placeholder="Select Asset">
              <Picker.Item
                label="Select an option"
                value=""
                style={{color: 'gray'}}
              />
              {locationData.map(i => (
                <Picker.Item label={i?.nmloc} value={i?.location} />
              ))}
            </Picker>
          </View>
        </View>
        <View style={{marginTop: '3%'}}>
          <Text style={styles.headings}>Sub Location</Text>
          <View
            style={{
              borderWidth: 1,
              width: '95%',
              justifyContent: 'center',
              alignSelf: 'center',
              height: 58,
              borderRadius: 5,
            }}>
            <Picker
              selectedValue={subLocation}
              onValueChange={itemValue => setSubLocation(itemValue)}
              style={styles.picker}
              placeholder="Select Asset">
              <Picker.Item
                label="Select an option"
                value=""
                style={{color: 'gray'}}
              />
              {locationData.map(i => (
                <Picker.Item label={i?.nmsubloc} value={i?.sublocation} />
              ))}
            </Picker>
          </View>
        </View>
        <View style={{marginTop: '3%'}}>
          <Text style={styles.headings}>Building</Text>
          <View
            style={{
              borderWidth: 1,
              width: '95%',
              justifyContent: 'center',
              alignSelf: 'center',
              height: 58,
              borderRadius: 5,
            }}>
            <Picker
              selectedValue={building}
              onValueChange={itemValue => setBuilding(itemValue)}
              style={styles.picker}
              placeholder="Select Asset">
              <Picker.Item
                label="Select an option"
                value=""
                style={{color: 'gray'}}
              />
              {locationData.map(i => (
                <Picker.Item label={i?.nmbuilding} value={i?.building} />
              ))}
            </Picker>
          </View>
        </View>
        <View style={{marginTop: '3%'}}>
          <Text style={styles.headings}>Floor</Text>
          <View
            style={{
              borderWidth: 1,
              width: '95%',
              justifyContent: 'center',
              alignSelf: 'center',
              height: 58,
              borderRadius: 5,
            }}>
            <Picker
              selectedValue={floor}
              onValueChange={itemValue => setFloor(itemValue)}
              style={styles.picker}
              placeholder="Select Asset">
              {floorData.map(i => (
                <Picker.Item label={i?.nm_flr} value={i?.id_flr} />
              ))}
            </Picker>
          </View>
        </View>
        <View style={{marginTop: '3%'}}>
          <Text style={styles.headings}>Year</Text>
          <TextInput
            style={styles.textinputs}
            placeholder="Start Date"
            placeholderTextColor="gray"
            value={year}
            onFocus={() => setShowYearpicker(true)}
            allowClear
            onChange={handleYearChange}
          />
          {showYearpicker && (
            <DateTimePicker
              value={year ? new Date(year) : new Date()}
              mode="year"
              display="spinner"
              onChange={handleYearChange}
              dateFormat="YYYY"
              allowClear={true}
            />
          )}
        </View>
        <View
          style={{
            borderWidth: 1,
            width: '95%',
            justifyContent: 'center',
            alignSelf: 'center',
            height: 58,
            borderRadius: 5,
            marginTop: '3%',
          }}>
          <Picker
            selectedValue={separateYear}
            onValueChange={itemValue => setSeparateYear(itemValue)}
            style={styles.picker}
            placeholder="Select Asset">
            <Picker.Item
              label="Select an option"
              value=""
              style={{color: 'gray'}}
            />
            <Picker.Item label="First Half" value="FH" />
            <Picker.Item label="Second Half" value="SH" />
          </Picker>
        </View>
        <View
          style={{
            marginTop: '3%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}>
          <Text style={styles.headings}>Assets</Text>
          <TouchableOpacity onPress={scaAsset}>
            <Text
              style={{
                textAlign: 'center',
                backgroundColor: '#052d6e',
                color: 'white',
                fontWeight: 'bold',
                padding: 10,
                borderRadius: 10,

                marginTop: '27%',
                marginLeft: '3%',
              }}>
              Scan Assets
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={showModal}>
            <Text
              style={{
                textAlign: 'center',
                backgroundColor: '#052d6e',
                color: 'white',
                fontWeight: 'bold',
                padding: 10,
                borderRadius: 10,

                marginTop: '18%',
                marginLeft: '3%',
              }}>
              View Scanned Assets
            </Text>
          </TouchableOpacity>

          {selectedDocument && (
            <View>
              {/* <Text style={{textAlign:'center',backgroundColor:'#052d6e',color:'white',fontWeight:'bold',padding:10,borderRadius:10,width:'45%',marginTop:'3%',marginLeft:'3%'}}>{selectedDocument.name}</Text>
          <Text style={{textAlign:'center',backgroundColor:'#052d6e',color:'white',fontWeight:'bold',padding:10,borderRadius:10,width:'45%',marginTop:'3%',marginLeft:'3%'}}>{selectedDocument.type}</Text> */}
            </View>
          )}
        </View>

        {sidebarOpen && (
          <View style={styles.sidebar}>
            <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
          </View>
        )}
      </View>
      {separateYear.length > 0 &&
        year.length > 0 &&
        floor.length > 0 &&
        building.length > 0 &&
        subLocation.length > 0 &&
        location.length > 0 && (
          <TouchableOpacity onPress={saveDetails}>
            <Text
              style={{
                textAlign: 'center',
                backgroundColor: 'green',
                color: 'white',
                fontWeight: 'bold',
                padding: 10,
                borderRadius: 10,

                marginTop: '5%',
                marginRight: '2%',
                marginLeft: '3%',
              }}>
              Save Details
            </Text>
          </TouchableOpacity>
        )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  card: {
    marginBottom: '5%',
    backgroundColor: '#cccfff',
  },
  back: {
    position: 'absolute',
    marginLeft: '5%',
    marginTop: '3%',
  },
  cardicon: {
    position: 'absolute',
    marginLeft: '80%',
    marginTop: '7%',
    backgroundColor: '#ccc',
    borderRadius: 10,
    height: '100%',
    width: '25%',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: '#ccc',
    padding: '5%',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
  headings: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: '3%',
    marginBottom: '1%',
  },
  picker: {
    width: '99%',
    color: 'black',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  textinputs: {
    borderWidth: 1,
    borderColor: 'black',
    color: 'black',
    width: '95%',
    padding: 10,

    borderRadius: 5,
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  containerModal: {},
  modalContainer: {},
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textInput: {
    width: '100%',
    height: 300,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 20,
    padding: 10,
    color: 'black',
  },

  modalButton: {
    padding: 10,
    backgroundColor: '#ff8a3d',
    margin: 5,
    width: '50%',
    borderRadius: 8,
    fontSize: 10,
  },
  button: {
    padding: 10,
    backgroundColor: '#ff8a3d',
  },
});
export default Scan;
