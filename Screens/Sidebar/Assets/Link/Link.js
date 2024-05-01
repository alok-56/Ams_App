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
  const handleCheckboxSelect = itemId => {
    console.log('Checkbox selected:', itemId); // Add this line
    setSelectedCheckboxes(prevSelected => {
      // Toggle the checkbox selection
      const updatedSelected = {
        ...prevSelected,
        [itemId]: !prevSelected[item.id_wh],
      };

      // Log selected id_wh value to the console when checkbox is selected
      if (updatedSelected[itemId]) {
        console.log('Selected id_wh value:', itemId);
      }

      return updatedSelected;
    });
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
  // const handleLinkAccessories = () => {
  //   navigation.navigate('DLink')
  // }
  const [assetDropdownData, setAssetDropdownData] = useState([]);
  const fetchAssetDropdownData = async () => {
    const Username = 'SVVG'; // Replace with your actual username
    const Password = 'Pass@123'; // Replace with your actual password

    const basicAuth = 'Basic ' + base64Encode(Username + ':' + Password);

    try {
      const response = await fetch(
        'https://ezatlas.co.in/AMS-SVVG-ANDROID/webapi/LinkAccessoriesAPI/asset_dropdownlist',
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

      if (data && Array.isArray(data.data) && data.data.length > 0) {
        // Set the first asset ID initially
        setSelectedAssetId(data.data[0].id_wh);
        setAssetIdFromDropdown(data.data[0].id_wh);
        setAssetDropdownData(data.data);
      }
    } catch (error) {
      console.error('Error fetching asset dropdown data:', error);
    }
  };

  useEffect(() => {
    fetchAssetDropdownData();
  }, []);
  const handleLinkAccessories = async () => {
    // Check if an asset is selected
    if (!selectedAssetId) {
      Alert.alert('Please select an asset');
      return;
    }

    // Define Basic Authentication headers
    const Username = 'SVVG'; // Replace with your actual username
    const Password = 'Pass@123'; // Replace with your actual password
    const basicAuth = 'Basic ' + base64Encode(Username + ':' + Password);

    // Construct the API URL with the selectedAssetId
    const apiUrl = `https://ezatlas.co.in/AMS-SVVG-ANDROID/webapi/LinkAccessoriesAPI/Display_additional?searchword=${selectedAssetId}`;

    try {
      // Perform the API call with Basic Authentication headers
      const response = await fetch(apiUrl, {
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
      console.log('Second API Response:', data);

      // Check if the response contains data
      if (data && Array.isArray(data.data) && data.data.length > 0) {
        // Extract information from the first item in the response
        const assetInfo = data.data[0];

        // Update the state variables with the extracted information
        setAssetIdValue(assetInfo.AssetID);
        setAssetValue(assetInfo.Asset_Subcategry);
        setShowDropdownAndInput(true);
      } else {
        // Handle the case where the response is empty
        alert('No data found for the selected asset');
      }
    } catch (error) {
      console.error('Error fetching additional data:', error);
    }
  };
  const fetchLinkAssetList = async () => {
    // Define Basic Authentication headers
    const Username = 'SVVG'; // Replace with your actual username
    const Password = 'Pass@123'; // Replace with your actual password
    const basicAuth = 'Basic ' + base64Encode(Username + ':' + Password);

    // Construct the API URL with the selectedAssetId
    const apiUrl =
      'https://ezatlas.co.in/AMS-SVVG-ANDROID/webapi/LinkAccessoriesAPI/linkAssetlist?usertype&searchword';

    try {
      // Perform the API call with Basic Authentication headers
      const response = await fetch(apiUrl, {
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

      // Check if the response contains data
      if (data && Array.isArray(data.data) && data.data.length > 0) {
        // Update the state variables with the fetched data
        setAccessoryIdFromLinkAssetList(data.data[0].id_wh);
        setLinkAssetList(data.data);
        setShowDropdownAndInput(true);
      } else {
        // Handle the case where the response is empty
        alert('No data found for the selected asset');
      }
    } catch (error) {
      console.error('Error fetching additional data:', error);
    }
  };

  // Call this function when you want to fetch data from the specified URL
  const handleLinkAssetList = () => {
    fetchLinkAssetList();
  };
  const handleAdditionalData = async () => {
    try {
      // Define Basic Authentication headers
      const Username = 'SVVG'; // Replace with your actual username
      const Password = 'Pass@123'; // Replace with your actual password
      const basicAuth = 'Basic ' + base64Encode(Username + ':' + Password);

      // Construct the API URL
      const apiUrl =
        'https://ezatlas.co.in/AMS-SVVG-ANDROID/webapi/LinkAccessoriesAPI/linkAssetlist?usertype&searchword'; // Replace with your actual URL

      // Perform the API call with Basic Authentication headers
      const response = await fetch(apiUrl, {
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

      // Handle the fetched data as needed
      console.log('Additional Data:', data);
      setAdditionalData(data.data);
      // You can update state variables or perform other actions with the data here
    } catch (error) {
      console.error('Error fetching additional data:', error);
    }
  };
  useEffect(() => {
    handleAdditionalData();
  }, []);

  const handlePostLinkAccessories = async () => {
    try {
      setIsLoading(true);
      if (!dateTo) {
        Alert.alert('Validation Error', 'Please fill in all required fields.', [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
        return;
      }
      const isCheckboxSelected = Object.values(selectedCheckboxes).some(
        value => value,
      );
      if (!isCheckboxSelected) {
        Alert.alert(
          'Validation Error',
          'Please select at least one accessory.',
          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        );
        return;
      }
      // Define Basic Authentication headers
      const Username = 'SVVG'; // Replace with your actual username
      const Password = 'Pass@123'; // Replace with your actual password
      const basicAuth = 'Basic ' + base64Encode(Username + ':' + Password);

      // Construct the API URL
      const apiUrl =
        'https://ezatlas.co.in/AMS-SVVG-ANDROID/webapi/LinkAccessoriesAPI/SetlinkStatus';

      // Define the body for the POST request
      const selectedAccessories = Object.keys(selectedCheckboxes)
        .filter(id_wh => selectedCheckboxes[id_wh])
        .map(id_wh => ({
          to_assign: selectedAssetId,
          dt_allocate: dateTo,
          installRmk: 'remark',
          InstallAssetID: id_wh,
        }));

      // Define the body for the POST request
      const requestBody = {
        data: selectedAccessories,
      };
      console.log(requestBody, 'postLink');
      console.log(accessoryIdFromLinkAssetList, 'accccccc');

      // Perform the POST request with Basic Authentication headers and the body
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
      } else {
        setShowDropdownAndInput(false);
      }

      const responseText = await response.text();
      console.log('POST Response:', responseText);
      Alert.alert('Success', responseText, [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
    } catch (error) {
      console.error('Error posting data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSearchInputChange = text => {
    setSearchText(text);
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
            <View style={styles.searchBarContainer}>
              <TextInput
                style={styles.searchBar}
                placeholder="Search"
                placeholderTextColor="gray"
                value={searchText}
                onChangeText={handleSearchInputChange}
              />
            </View>
            <View style={styles.dateContainer}>
              <Text style={{color: 'black'}}>Link Date</Text>
              <TextInput
                style={styles.dateInput}
                placeholder="Link Date"
                placeholderTextColor="gray"
                value={dateTo} // Make sure it's bound to the state
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

            {additionalData
              .filter(item => item.asset_id.includes(searchText))
              .map(item => (
                <View key={item.id_wh}>
                  <Card style={{...styles.card, backgroundColor: '#052d6e'}}>
                    <Card.Content>
                      <View style={styles.labelContainer}>
                        <Text style={styles.additionlabel}>
                          {item.asset_id}
                        </Text>
                        <Checkbox
                          status={
                            selectedCheckboxes[item.id_wh]
                              ? 'checked'
                              : 'unchecked'
                          }
                          onPress={() => {
                            console.log('Checkbox pressed', item.id_wh);
                            const updatedCheckboxes = {...selectedCheckboxes};
                            updatedCheckboxes[item.id_wh] =
                              !updatedCheckboxes[item.id_wh];
                            setSelectedCheckboxes(updatedCheckboxes);
                          }}
                        />
                        <Text style={styles.additionvalue}>
                          Sr No : {item.serial_num}
                        </Text>
                      </View>
                    </Card.Content>
                  </Card>
                </View>
              ))}

            <TouchableOpacity onPress={handlePostLinkAccessories}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Link</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flex: 1, marginBottom:'100%' }}>
          <View style={{ paddingTop: 20 }}>
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
                {console.log(assetDropdownData,"add")}
              {assetDropdownData.map(item => (
                <Picker.Item
                  key={item.id_wh}
                  label={item.Asset_Name_serial}
                  value={item.id_wh}
                  onValueChange={(e)=>setAssetIdFromDropdown(e)}
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
    width: '60%',
    borderWidth: 1,
    borderColor: 'gray',
    margin: 10,
    alignSelf: 'center',
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
