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
import {Card, Checkbox} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Sidebar from '../../Sidebar';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {ScrollView} from 'react-native-gesture-handler';
import {encode as base64Encode} from 'base-64';
import {useFocusEffect} from '@react-navigation/native';
import {BaseUrl} from '../../../../Api/BaseUrl';

const DLink = ({navigation}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loginType, setLoginType] = useState('');
  const [dateTo, setToDate] = useState('');
  const [showDropdownAndInput, setShowDropdownAndInput] = useState(false);
  const [showToDatepicker, setShowToDatepicker] = useState(false);
  const [assetDropdownData, setAssetDropdownData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [remark, setRemark] = useState('');

  const handleDateInCheck = (event, selectedDate, asset) => {
    setShowToDatepicker(false);
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = `${selectedDate.getMonth() + 1}`.padStart(2, '0');
      const day = `${selectedDate.getDate()}`.padStart(2, '0');
      const formattedDate = `${year}/${month}/${day}`;
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

  const handleLink = () => {
    setShowDropdownAndInput(true);
  };

  const fetchAssetDropdownData = async () => {
    try {
      const response = await fetch(
        `${BaseUrl}/asset/GetAssetByStatus?devicestatus=linktoasset`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data && Array.isArray(data)) {
        setAssetDropdownData(data);
      }
    } catch (error) {
      console.error('Error fetching asset dropdown data:', error);
      Alert.alert(
        'Error',
        'Failed to fetch asset dropdown data. Please try again.',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      );
    }
  };

  useEffect(() => {
    fetchAssetDropdownData();
  }, []);

  const handleAssetChange = itemValue => {
    const selectedAssetData = assetDropdownData.find(
      asset => asset.idwh === itemValue,
    );
    setSelectedAsset({
      accessory_id: selectedAssetData?.idwh || '',
      serial_num: selectedAssetData?.serialno || '',
      nm_accessory: selectedAssetData?.idinv?.idmodel?.nmmodel || '',
      Link_date: selectedAssetData?.linkdate || '',
      asset_id: selectedAssetData?.idwhdyn || '',
      asset_nm: selectedAssetData?.idinv?.idmodel?.nmmodel || '',
      accessory_id_wh: selectedAssetData?.idwh || '',
      asset_cd: selectedAssetData?.idwhdyn || '',
    });
    setLoginType(itemValue);
  };

  const [selectedAsset, setSelectedAsset] = useState({
    accessory_id: '',
    serial_num: '',
    nm_accessory: '',
    Link_date: '',
    asset_id: '',
    asset_nm: '',
    accessory_id_wh: '',
    asset_cd: '',
  });

  const handlePostDLinkAccessories = async () => {
    console.log(selectedAsset);
    try {
      setIsLoading(true);
      const apiUrl = `${BaseUrl}/asset/DLinkChildMaterialUpdate?loginID=1`;
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          {
            idwhaAccesory: selectedAsset?.accessory_id_wh,
            acessoryStatus: status,
            asstrmks: remark,
            delinkedDate: dateTo,
          },
        ]),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        setShowDropdownAndInput(false);
        fetchAssetDropdownData();
        setRemark('');
        setStatus('');
        setToDate('');
      }
      const responseText = await response.text();
      Alert.alert('Response', responseText, [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
    } catch (error) {
      console.error('Error posting data:', error);
    } finally {
      setIsLoading(false); // Hide loader
    }
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
                <View style={styles.labelContainer}>
                  <Text style={{...styles.label, color: '#ff8a3d'}}>
                    Asset ID :
                  </Text>
                  <Text style={styles.cardvalue}>
                    {' '}
                    {selectedAsset.asset_cd}
                  </Text>
                </View>
                <View style={styles.labelContainer}>
                  <Text style={{...styles.label, color: '#ff8a3d'}}>
                    Asset Name :
                  </Text>
                  <Text style={styles.cardvalue}>
                    {' '}
                    {selectedAsset.asset_nm}
                  </Text>
                </View>
              </Card.Content>
            </Card>

            <View>
              <Card style={styles.card}>
                <Card.Content>
                  <View style={styles.labelContainer}>
                    <Text style={{...styles.label, color: '#ff8a3d'}}>
                      Accessories Id :
                    </Text>
                    <Text style={styles.cardvalue}>
                      {selectedAsset.accessory_id}
                    </Text>
                  </View>
                  <View style={styles.labelContainer}>
                    <Text style={{...styles.label, color: '#ff8a3d'}}>
                      Accessories Name :
                    </Text>
                    <Text style={styles.cardvalue}>
                      {selectedAsset.nm_accessory}
                    </Text>
                  </View>
                  <View style={styles.labelContainer}>
                    <Text style={{...styles.label, color: '#ff8a3d'}}>
                      Serial No:
                    </Text>
                    <Text style={styles.cardvalue}>
                      {selectedAsset.serial_num}
                    </Text>
                  </View>
                  <View style={styles.labelContainer}>
                    <Text style={{...styles.label, color: '#ff8a3d'}}>
                      Linked Date :
                    </Text>
                    <Text style={styles.value}>{selectedAsset.Link_date}</Text>
                  </View>

                  <View style={{paddingTop: 10}}>
                    <Picker
                      selectedValue={status}
                      onValueChange={e => setStatus(e)}
                      style={styles.picker}
                      placeholder="Select Asset">
                      <Picker.Item key="" label="Select Reason" value="" />
                      <Picker.Item
                        label="Working"
                        key="Working"
                        value="working"
                      />
                      <Picker.Item label="Permanent" value="allct_to_emp" />
                      <Picker.Item
                        label="Temporary"
                        value="allct_to_emp_temp"
                      />
                    </Picker>
                  </View>

                  <TextInput
                    style={styles.dateInput}
                    placeholder="Dlink Date"
                    placeholderTextColor="gray"
                    value={dateTo}
                    onFocus={() => setShowToDatepicker(true)}
                  />

                  {showToDatepicker && (
                    <DateTimePicker
                      value={new Date()}
                      mode="date"
                      display="default"
                      onChange={(e, selectedDate) =>
                        handleDateInCheck(e, selectedDate)
                      }
                    />
                  )}
                  <TextInput
                    style={styles.remarks}
                    onChangeText={value => setRemark(value)}
                    value={selectedAsset.textValue}
                    placeholder="Enter Remarks"
                    placeholderTextColor="gray"
                  />
                </Card.Content>
              </Card>
            </View>

            <View style={styles.button}>
              <TouchableOpacity onPress={handlePostDLinkAccessories}>
                <Text style={styles.buttonText}>DLink</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.dropIt}>
            <View>
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
                <Picker.Item key="" label="Select asset" value="" />
                {assetDropdownData &&
                  assetDropdownData.map(item => (
                    <Picker.Item
                      key={item.idwh}
                      label={item.idwhdyn}
                      value={item.idwh}
                    />
                  ))}
              </Picker>
            </View>
            <TouchableOpacity onPress={handleLink}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>DLink</Text>
              </View>
            </TouchableOpacity>
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
    height: '100%',
  },
  dateContainer: {
    padding: 5,
    justifyContent: 'space-between',
    width: '60%',
    borderWidth: 1,
    borderColor: 'gray',
    margin: 10,
    alignSelf: 'center',
  },
  dateInput: {
    color: 'black',
    borderWidth: 1,
    width: '100%',
    marginBottom: '2%',
    borderRadius: 10,
  },
  card: {
    marginBottom: '5%',
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
  labelContainer: {
    width: '100%',
    marginBottom: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  valueContainer: {
    width: '50%',
  },
  content: {
    flex: 1,
    padding: '5%',
    paddingTop: '5%',
  },
  dropIt: {
    marginBottom: 600,
  },
  dropdownContainer: {
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#ff8a3d',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    width: '40%',
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
    color: 'blue',
    width: '65%',
  },
  cardvalue: {
    color: 'red',
    width: '65%',
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
    color: 'black',
    width: '100%',
    padding: 10,
    minHeight: 100,
    textAlignVertical: 'top',
    borderRadius: 10,
  },
  searchBarContainer: {},
  searchBar: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    color: 'black',
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

export default DLink;
