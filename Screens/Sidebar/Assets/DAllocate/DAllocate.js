import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput,Alert } from 'react-native';
import { Card, Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Sidebar from '../../Sidebar';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ScrollView } from 'react-native-gesture-handler';
import { encode } from 'base-64';

const DAllocate = ({ navigation }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dAllocateType, setDAllocateType] = useState('');
  const [dateTo, setToDate] = useState('');
  const [showDropdownAndInput, setShowDropdownAndInput] = useState(false);
  const [textValue, setTextValue] = useState('');
  const [showToDatepicker, setShowToDatepicker] = useState(false);
  const [empDropdownData, setEmpDropdownData] = useState([]);
  const [assetID,setAssetID] = useState('');
  const [modelNo,setModelNo] = useState('');
  const [assetName,setAssetName] = useState('');
  const [serialNumber,setSerialNumber] = useState('');
  const [employeeName,setEmployeeName] = useState('');
  const [employeeCode,setEmployeeCode] = useState('');
  const [allocatedDate,setAllocatedDate] = useState('');
  const [assetStatus,SetAssetStatus] = useState('');
  

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
          style={{ position: 'absolute', top: '30%', left: '65%', zIndex: 1 }}>
          <Icon name="menu" color="white" size={25} />
        </TouchableOpacity>
      ),
    });
  }, []);
  const handleMenuIconPress = () => {
    setSidebarOpen((prevState) => !prevState);
  };
  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={handleBackPress}
          style={{ position: 'absolute', top: '30%', left: '20%', zIndex: 1 }}>
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
  const handleDAllocate = async () => {
    try {
      // Validate required fields before making the API call
      if (!dAllocateType || !dateTo || !textValue || !assetStatus) {
        Alert.alert('Validation Error', 'Please fill in all required fields.', [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]);
        return;
      }
  
      const Username = 'SVVG'; // Replace with your actual username
      const Password = 'Pass@123'; // Replace with your actual password
      const basicAuth = 'Basic ' + encode(`${Username}:${Password}`);
  
      // Assuming dAllocateType is the selected dropdown value
      const selectedData = empDropdownData.find((item) => item.id_wh_dyn === dAllocateType);
  
      const requestBody = {
        data: [
          {
            UnInstallAssetID: selectedData.id_wh,
            asset_status: assetStatus,
            uninstallRmk: textValue,
            asst_stat: '0',
            uninstallAssetDate: dateTo,
          },
        ],
      };
      console.log(requestBody,"deallocate")
  
      const response = await fetch('http://13.235.186.102/SVVG-API/webapi/uninstall/deallocate_emp', {
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
  
      // Handle success, e.g., show a success message or navigate to a different screen
      console.log('De-allocation successful!');
      Alert.alert('Success', 'Asset de-allocated successfully!', [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
  
    } catch (error) {
      console.error('Error de-allocating asset:', error);
      // Handle error, e.g., show an error message
      Alert.alert('Error', 'Failed to de-allocate asset. Please try again.', [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
    }
  };
 
  const fetchEmpDropdownData = async () => {
    try {
      const Username = 'SVVG'; // Replace with your actual username
      const Password = 'Pass@123'; // Replace with your actual password
  
      const credentials = encode(`${Username}:${Password}`);
      const response = await fetch('http://13.235.186.102/SVVG-API/webapi/uninstall/allocated_asset', {
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const responseData = await response.json();
      setEmpDropdownData(responseData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  
  useEffect(() => {
    fetchEmpDropdownData();
  }, []);
  const handleDAllocateAsset = () => {
    // Assuming dAllocateType is the selected dropdown value
    const selectedData = empDropdownData.find(item => item.id_wh_dyn === dAllocateType);

    // Update the state variables with the selected data
    setAssetID(selectedData.id_wh_dyn || '');
    setModelNo(selectedData.nm_model || '');
    setAssetName(selectedData.ds_asst || '');
    setSerialNumber(selectedData.serial_no || '');
    setEmployeeName(selectedData.nm_emp || '');
    setEmployeeCode(selectedData.cd_emp || '');
    setAllocatedDate(selectedData.dt_allocate || '');

    setShowDropdownAndInput(true);
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {showDropdownAndInput ? (
          <View style={styles.dropdownContainer}>
            <Card style={styles.card}>
              <Card.Content >
                <View style={styles.labelValueContainer}>
                  <Text style={styles.label}>Asset ID:</Text>
                  <Text style={styles.value}>{assetID}</Text>
                </View>
                <View style={styles.labelValueContainer}>
                  <Text style={styles.label}>Model No : </Text>
                  <Text style={styles.value}>{modelNo}</Text>
                </View>
                <View style={styles.labelValueContainer}>
                  <Text style={styles.label}>Asset Name : </Text>
                  <Text style={styles.value}>{assetName}</Text>
                </View>
                <View style={styles.labelValueContainer}>
                  <Text style={styles.label}>Serial Number :</Text>
                  <Text style={styles.value}>{serialNumber}</Text>
                </View>
                <View style={styles.labelValueContainer}>
                  <Text style={styles.label}>Employee Name :</Text>
                  <Text style={styles.value}>{employeeName}</Text>
                </View>
                <View style={styles.labelValueContainer}>
                  <Text style={styles.label}>Employee Code :</Text>
                  <Text style={styles.value}>{employeeCode}</Text>
                </View>
                <View style={styles.labelValueContainer}>
                  <Text style={styles.label}>Allocated Date :</Text>
                  <Text style={styles.value}>{allocatedDate}</Text>
                </View>
              </Card.Content>
            </Card>
            <View style={{ backgroundColor: '#052d6e', alignItems: 'center', paddingVertical: '2%', borderRadius: 5, marginBottom: '4%', }}>
              <Text style={{ fontWeight: 'bold', color: 'white' }}>Assign To </Text>
            </View>
            {/* <Picker
              selectedValue={Type}
              onValueChange={(itemValue) => setLoginType(itemValue)}
              style={styles.picker}
              placeholder='Select Asset'
            >
              <Picker.Item label="option 1" value="1" />
              <Picker.Item label="option 2" value="2" />
              <Picker.Item label="option 3" value="3" />
              <Picker.Item label="option 4" value="4" />
            </Picker> */}
            <View style={styles.filterContainer}>

              <TextInput style={styles.dateInput}
                placeholder="De - Allocate Date"
                placeholderTextColor="gray"
                value={dateTo}
                onFocus={() => setShowToDatepicker(true)}
              />
              {showToDatepicker && (
                <DateTimePicker value={new Date()}
                  mode="date"
                  display="default"
                  onChange={handleToDateChange}
                />
              )}
              <View style={{width:'50%'}}>
              <Picker
              selectedValue={assetStatus}
              onValueChange={(itemValue) => SetAssetStatus(itemValue)}
              style={styles.picker}
              placeholder='Select Asset'
            >
              <Picker.Item label="Working" value="working" />
              <Picker.Item label="Physical Damage Major" value="physical_dmg_mjr" />
              <Picker.Item label="Physical Damage Minor " value="physical_dmg_mnr" />
            </Picker>
            </View>

            </View>
            <TextInput style={styles.remarks}
              onChangeText={(value) => setTextValue(value)}
              value={textValue}
              placeholder="Enter Remarks"
              placeholderTextColor="gray"
            />
            <View style={styles.button}>
              <TouchableOpacity
                onPress={handleDAllocate}>
                <Text style={styles.buttonText}>De - Allocate</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.content}>
            <View style={styles.dropdownContainer}>
            <View 
            style={{display:'flex',alignSelf:'center',padding:10,margin:10}}>
            <Icon name="add-shopping-cart" color='gray' size={60}/>
            </View>
             
            <Picker
              selectedValue={dAllocateType}
              onValueChange={(itemValue) => setDAllocateType(itemValue)}
              style={styles.picker}
              placeholder='Select Asset'>
              {empDropdownData.map((item) => (
                <Picker.Item key={item.id_wh_dyn} label={item.id_wh_dyn} value={item.id_wh_dyn} />
              ))}
            </Picker>
            </View>
            <View style={styles.button}>
              <TouchableOpacity
                onPress={handleDAllocateAsset}>
                <Text style={styles.buttonText}>De - Allocate</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
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
    height:'100%'
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between'
  },
  dateInput: {
    borderWidth: 1,
    borderColor: 'gray',
    color: 'black',
    width: '47%',
    height:'90%',
  },
  card: {
    marginBottom: '5%',
    backgroundColor: '#052d6e',
  },
  picker: {
    width: '100%',
    marginBottom: '4%',
    backgroundColor: '#ccc',
    borderRadius: 10,
    borderColor: 'black',
    padding: '10px',
    color: 'black'
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
    height:'100%'
  },
  dropdownContainer: {
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#052d6e',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    width: '40%',
    alignSelf: 'center',
    margin: '5%'
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  label: {
    fontWeight: 'bold',
    color: 'white',
    width: '35%'
  },
  value: {
    color: 'white',
    width: '65%'
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
  remarks: {
    borderWidth: 1,
    borderColor: 'gray',
    color: 'black',
    width: '100%',
    padding: 10,
    minHeight: 100,
    textAlignVertical: 'top',
  }
});

export default DAllocate;


