import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Card, Title} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Sidebar from '../../Sidebar';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {ScrollView} from 'react-native-gesture-handler';
import {encode as base64Encode} from 'base-64';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BaseUrl} from '../../../../Api/BaseUrl';

const Allocate = ({navigation}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loginType, setLoginType] = useState('');
  const [assignType, setAssignType] = useState('');
  const [dateTo, setToDate] = useState('');
  const [showDropdownAndInput, setShowDropdownAndInput] = useState(false);
  const [textValue, setTextValue] = useState('');
  const [showToDatepicker, setShowToDatepicker] = useState(false);
  const [employeeDropdownData, setEmployeeDropdownData] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deviceStatus, setDeviceStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState({
    id_wh: '',
    nm_prod: '',
    serial_no: '',
    id_wh_dyn: '',
    device_status: '',
  });
  const fetchEmployeeDropdownData = async () => {
    const Username = 'SVVG';
    const Password = 'Pass@123';
    const basicAuth = 'Basic ' + base64Encode(Username + ':' + Password);
    try {
      const response = await fetch(
        `${BaseUrl}/master/MasterGetAll?mastername=Employee&requireString=s`,
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

      if (data && Array.isArray(data)) {
        setEmployeeDropdownData(data);
      }
    } catch (error) {
      console.error('Error fetching employee dropdown data:', error);
    }
  };
  const [assetDropdownData, setAssetDropdownData] = useState([]);

  const fetchAssetDropdownData = async () => {
    const Username = 'SVVG';
    const Password = 'Pass@123';

    const basicAuth = 'Basic ' + base64Encode(Username + ':' + Password);

    try {
      const response = await fetch(`${BaseUrl}/asset/allassets`, {
        method: 'GET',
        headers: {
          Authorization: basicAuth,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data && Array.isArray(data)) {
        let newdata = data.filter(item => item.devicestatus === 'instore');
        setAssetDropdownData(newdata);
      }
    } catch (error) {
      console.error('Error fetching asset dropdown data:', error);
    }
  };
  useEffect(() => {
    getData();
    fetchAssetDropdownData();
    fetchEmployeeDropdownData();
  }, []);
  const handleToDateChange = (event, selectedDate) => {
    setShowToDatepicker(false);
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = `${selectedDate.getMonth() + 1}`.padStart(2, '0'); // Adding 1 as months are zero-based
      const day = `${selectedDate.getDate()}`.padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      setToDate(formattedDate);
    }
  };
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
    if (showDropdownAndInput) {
      setShowDropdownAndInput(false);
    } else {
      navigation.navigate('Dashboard');
    }
  };
  const handleAllocate = () => {
    setShowDropdownAndInput(true);
  };
  const getData = async () => {
    try {
      const Idempuser = await AsyncStorage.getItem('userId');
      const changeFormat = JSON.parse(Idempuser);
      console.log(Idempuser, 'IdempUser My assets');
      return changeFormat;
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  };
  const handleAllocateAsset = async () => {
    if (
      selectedAsset.id_wh === '' ||
      assignType === '' ||
      dateTo === '' ||
      textValue === '' ||
      deviceStatus === '' ||
      deviceStatus === undefined
    ) {
      Alert.alert('Validation Error', 'Please fill in all required fields.', [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
      return;
    }
    try {
      setIsLoading(true);
      const Username = 'SVVG';
      const Password = 'Pass@123';
      const basicAuth = 'Basic ' + base64Encode(Username + ':' + Password);
      const Idempuser = await getData();

      const response = await fetch(`${BaseUrl}/asset/allocate/{id}`, {
        method: 'PATCH',
        headers: {
          Authorization: basicAuth,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          {
            idwhList: selectedAsset.id_wh,
            loginId: 1,
            asstStatus: deviceStatus,
            idemp: Number(assignType),
            allocationdate: dateTo,
            rmkasst: textValue,
          },
        ]),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        setShowDropdownAndInput(false);
      }
      const responseText = await response.text();
      Alert.alert('Response', responseText, [
        {
          text: 'OK',
          onPress: () => {
            fetchAssetDropdownData();
            fetchEmployeeDropdownData();
            setDeviceStatus('');
            setTextValue('');
            setToDate('');
            setAssignType('');
          },
        },
      ]);
    } catch (error) {
      console.error('Error allocating asset:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmployeeChange = itemValue => {
    const selectedEmp = employeeDropdownData.find(
      emp => emp.id_emp_user === itemValue,
    );
    setSelectedEmployee(selectedEmp);
    setAssignType(itemValue);
  };

  const handleAssetChange = itemValue => {
    const selectedAssetData = assetDropdownData.find(
      asset => asset.idwhdyn === itemValue,
    );

    setSelectedAsset({
      id_wh_dyn: selectedAssetData?.idwhdyn || '',
      nm_prod: selectedAssetData?.idinv?.idmodel?.nmmodel || '',
      serial_no: selectedAssetData?.serialno || '',
      id_wh: selectedAssetData?.idwh || '',
      device_status: selectedAssetData?.devicestatus || '',
    });
    setLoginType(itemValue);
  };

  return (
    <ScrollView style={styles.container}>
      {isLoading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#ff8a3d" />
        </View>
      )}
      <View style={styles.content}>
        {showDropdownAndInput ? (
          <View style={styles.dropdownContainer}>
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.labelValueContainer}>
                  <Text style={styles.label}>Asset ID</Text>
                  <Text style={styles.value}>{selectedAsset.id_wh_dyn}</Text>
                </View>
                <View style={styles.labelValueContainer}>
                  <Text style={styles.label}>Asset Name </Text>
                  <Text style={styles.value}>{selectedAsset.nm_prod}</Text>
                </View>
                <View style={styles.labelValueContainer}>
                  <Text style={styles.label}>Serial No</Text>
                  <Text style={styles.value}>{selectedAsset.serial_no}</Text>
                </View>
              </Card.Content>
            </Card>
            <View
              style={{
                backgroundColor: '#ff8a3d',
                alignItems: 'center',
                paddingVertical: '2%',
                borderRadius: 5,
                marginBottom: '4%',
              }}>
              <Text style={{fontWeight: 'bold', color: 'white'}}>
                Assign To{' '}
              </Text>
            </View>
            <Picker
              selectedValue={assignType}
              style={styles.picker}
              placeholder="Select Employee"
              onValueChange={handleEmployeeChange}>
              {employeeDropdownData.map(item => (
                <Picker.Item
                  key={item.idempuser}
                  label={item.nmemp}
                  value={item.idempuser}
                />
              ))}
            </Picker>
            <View style={styles.filterContainer}>
              <TextInput
                style={styles.dateInput}
                placeholder="Allocate Date"
                placeholderTextColor="gray"
                value={dateTo}
                onFocus={() => setShowToDatepicker(true)}
              />
              {showToDatepicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  display="default"
                  onChange={handleToDateChange}
                />
              )}
              <View style={{width: '50%'}}>
                <Picker
                  selectedValue={deviceStatus}
                  onValueChange={itemValue => setDeviceStatus(itemValue)}
                  style={styles.picker}
                  placeholder="Select Asset">
                  <Picker.Item label="Select Status" />
                  <Picker.Item label="Permanent" value="allct_to_emp" />
                  <Picker.Item label="Temporary" value="allct_to_emp_temp" />
                </Picker>
              </View>
            </View>
            <TextInput
              style={styles.remarks}
              onChangeText={value => setTextValue(value)}
              value={textValue}
              placeholder="Enter Remarks"
              placeholderTextColor="gray"
            />
            <View style={styles.button}>
              <TouchableOpacity onPress={handleAllocateAsset}>
                <Text style={styles.buttonText}>Allocate</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.content}>
            <View
              style={{
                display: 'flex',
                alignSelf: 'center',
                padding: 10,
                margin: 10,
              }}>
              <Icon name="add-shopping-cart" color="gray" size={60} />
            </View>
            <Picker
              selectedValue={loginType}
              style={styles.picker}
              placeholder="Select Asset"
              onValueChange={handleAssetChange}>
              <Picker.Item key="" label="Select Asset" value="" />
              {assetDropdownData.map(item => (
                <Picker.Item
                  key={item.idwhdyn}
                  label={item.idwhdyn}
                  value={item.idwhdyn}
                />
              ))}
            </Picker>
            <View style={styles.button}>
              <TouchableOpacity onPress={handleAllocate}>
                <Text style={styles.buttonText}>Allocate</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      {console.log(sidebarOpen, 'sideee')}
      {sidebarOpen && (
        <View style={styles.sidebar}>
          <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
        </View>
      )}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
  },
  filterContainer: {
    flexDirection: 'row',
    margin: 10,
    justifyContent: 'space-evenly',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: 'gray',
    color: 'black',
    width: '47%',
    height: '90%',
  },
  card: {
    marginBottom: '5%',
    backgroundColor: '#ff8a3d',
  },
  picker: {
    width: '100%',
    marginBottom: '4%',
    backgroundColor: '#ccc',
    borderRadius: 10,
    borderColor: 'black',
    padding: '10px',
    color: 'black',
  },
  labelValueContainer: {
    width: '100%',
    marginBottom: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  content: {
    flex: 1,
    padding: '5%',
    paddingTop: '5%',
    height: 700,
  },
  dropdownContainer: {
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#ff8a3d',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    width: '35%',
    alignSelf: 'center',
    margin: '5%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  label: {
    fontWeight: 'bold',
    color: 'white',
    width: '35%',
  },
  value: {
    color: 'white',
    width: '65%',
  },
  remarks: {
    borderWidth: 1,
    borderColor: 'gray',
    color: 'black',
    width: '100%',
    padding: 10,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#ccc',
    padding: '5%',
    width: '80%',
  },

  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default Allocate;
