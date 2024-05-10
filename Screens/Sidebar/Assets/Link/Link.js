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
import {BaseUrl} from '../../../../Api/BaseUrl';

const Link = ({navigation}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [linkType, setLinkType] = useState('');
  const [dateTo, setToDate] = useState('');
  const [showDropdownAndInput, setShowDropdownAndInput] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showToDatepicker, setShowToDatepicker] = useState(false);
  const [checkBoxChecked, setCheckBoxChecked] = useState(false); // State for the checkbox
  const [selectedAssetId, setSelectedAssetId] = useState(null);
  const [assetIdValue, setAssetIdValue] = useState('');
  const [accessoryIdFromLinkAssetList, setAccessoryIdFromLinkAssetList] =
    useState(null);
  const [assetIdFromDropdown, setAssetIdFromDropdown] = useState(null);
  const [loginType, setLoginType] = useState('');
  const [assetValue, setAssetValue] = useState('');
  const [linkAssetList, setLinkAssetList] = useState([]);
  const [additionalData, setAdditionalData] = useState([]);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [material, setMatetial] = useState([]);
  const [assest, setAssest] = useState([]);
  const [selectedAssestIds, setSelectedAssestIds] = useState('');
  const [selectedLink, setSelectedLink] = useState('');

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

  const [assetDropdownData, setAssetDropdownData] = useState([]);

  const fetchAssetDropdownData = async () => {
    const Username = 'SVVG';
    const Password = 'Pass@123';
    const basicAuth = 'Basic ' + base64Encode(Username + ':' + Password);
    try {
      const response = await fetch(`${BaseUrl}/asset/LinkAccessories`, {
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
      if (data && Array.isArray(data) && data.length > 0) {
        setAssetDropdownData(data);
      }
    } catch (error) {
      console.error('Error fetching asset dropdown data:', error);
    }
  };

  const GetAllMetials = async () => {
    try {
      const response = await fetch(
        `${BaseUrl}/master/MasterGetAll?mastername=Material&requireString=s`,
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
      if (data && Array.isArray(data) && data.length > 0) {
        setMatetial(data);
      }
    } catch (error) {
      console.error('Error fetching asset dropdown data:', error);
    }
  };

  useEffect(() => {
    fetchAssetDropdownData();
    GetAllMetials();
  }, []);

  const handleLinkAccessories = async () => {
    if (!selectedAssetId) {
      Alert.alert('Please select an asset');
      return;
    }
    let assestDetails = assetDropdownData.find(
      item => item.idwh === Number(selectedAssetId),
    );
    setAssetIdValue(assestDetails.idwhdyn);
    setAssetValue(assestDetails.idinv.idmodel.nmmodel);
    setShowDropdownAndInput(true);
  };

  const handleLinkChange = async id => {
    setSelectedLink(id);
    try {
      const response = await fetch(
        `${BaseUrl}/asset/GetAssetBYItemName?loginID=1&MaterialID=${id}`,
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
      console.log(data);
      if (data && Array.isArray(data) && data.length > 0) {
        setAssest(data);
      }
    } catch (error) {
      console.error('Error fetching asset dropdown data:', error);
    }
  };

  const handlePostLinkAccessories = async () => {
    try {
      setIsLoading(true);
      if (!dateTo) {
        Alert.alert('Validation Error', 'Please fill in all required fields.', [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
        return;
      }
      let allassest = await fetch(`${BaseUrl}/asset/allassets`);
      allassest = await allassest.json();
      let id = allassest.filter(res => res.idwhdyn === selectedAssestIds);
      if (id) {
        const apiUrl = `${BaseUrl}/asset/LinkChildMaterialUpdate?parentIdwh=${id[0].idwh}&loginID=1`;
        const response = await fetch(apiUrl, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([
            {
              idwhList: selectedAssetId,
              linkedDate: dateTo,
            },
          ]),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        } else {
          setShowDropdownAndInput(false);
          setToDate('');
          setSelectedLink('');
          setSelectedAssestIds('');
          fetchAssetDropdownData();
        }

        const responseText = await response.text();

        Alert.alert('Success', responseText, [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
      }
    } catch (error) {
      console.error('Error posting data:', error);
    } finally {
      setIsLoading(false);
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
                  <Text style={styles.value}>{assetIdValue}</Text>
                </View>
                <View style={styles.labelContainer}>
                  <Text style={{...styles.label, color: '#ff8a3d'}}>
                    Asset Name :
                  </Text>
                  <Text style={styles.value}>{assetValue}</Text>
                </View>
              </Card.Content>
            </Card>
            <Text style={{fontSize: 16, fontWeight: 'bold', color: '#000'}}>
              Link To
            </Text>
            <View style={{paddingTop: 10}}>
              <Picker
                selectedValue={selectedLink}
                onValueChange={itemValue => handleLinkChange(itemValue)}
                style={styles.picker}
                placeholder="Select Asset">
                <Picker.Item key="" label="Select Material" value="" />
                {material &&
                  material.map(item => (
                    <Picker.Item
                      key={item.idmodel}
                      label={item.nmmodel}
                      value={item.idmodel}
                    />
                  ))}
              </Picker>
            </View>
            <Text style={{fontSize: 16, fontWeight: 'bold', color: '#000'}}>
              Asset Id
            </Text>
            <View style={{paddingTop: 10}}>
              <Picker
                selectedValue={selectedAssestIds}
                onValueChange={itemValue => setSelectedAssestIds(itemValue)}
                style={styles.picker}
                placeholder="Select Asset">
                <Picker.Item key="" label="Select assest Id" value="" />
                {assest &&
                  assest.map(item => (
                    <Picker.Item key={item} label={item} value={item} />
                  ))}
              </Picker>
            </View>

            <View style={styles.dateContainer}>
              <Text style={{color: 'black'}}>Link Date</Text>
              <TextInput
                style={styles.dateInput}
                placeholder="Link Date"
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
            </View>

            <TouchableOpacity onPress={handlePostLinkAccessories}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Link</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{flex: 1, marginBottom: '100%'}}>
            <View style={{paddingTop: 20}}>
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
                selectedValue={selectedAssetId}
                onValueChange={itemValue => setSelectedAssetId(itemValue)}
                style={styles.picker}
                placeholder="Select Asset">
                <Picker.Item key="" label="Select Assest" value="" />
                {assetDropdownData.map(item => (
                  <Picker.Item
                    key={item.idwh}
                    label={item.idwhdyn}
                    value={item.idwh}
                    onValueChange={e => setAssetIdFromDropdown(e)}
                  />
                ))}
              </Picker>
            </View>
            <TouchableOpacity onPress={handleLinkAccessories}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Link</Text>
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
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    margin: 10,
    alignSelf: 'center',
    height: 60,
    borderRadius: 5,
  },
  dateInput: {
    color: 'black',
  },
  card: {
    marginBottom: '5%',
    backgroundColor: '#ccc',
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
  additionlabel: {
    fontWeight: 'bold',
    color: 'white',
  },
  value: {
    color: 'green',
    width: '65%',
    fontWeight: 'bold',
  },
  additionvalue: {
    color: 'green',
    width: '65%',
    marginLeft: '65%',
    fontWeight: 'bold',
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

  remarks: {
    borderWidth: 1,
    borderColor: 'gray',
    color: 'black',
    width: '100%',
    padding: 10,
    minHeight: 100,
    textAlignVertical: 'top',
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

export default Link;
