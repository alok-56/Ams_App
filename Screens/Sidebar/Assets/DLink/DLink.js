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

const DLink = ({navigation}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loginType, setLoginType] = useState('');
  const [dateTo, setToDate] = useState('');
  const [showDropdownAndInput, setShowDropdownAndInput] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showToDatepicker, setShowToDatepicker] = useState(false);
  const [checkBoxChecked, setCheckBoxChecked] = useState(false);
  const [textValue, setTextValue] = useState('');
  const [assetDropdownData, setAssetDropdownData] = useState([]);
  const [selectedDropdownItem, setSelectedDropdownItem] = useState(null);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({});
  const [filteredAssetData, setFilteredAssetData] = useState([]);
  const [cardStates, setCardStates] = useState([]);
  const [overAllDatam, overAllData] = useState([]);
  const [selectedDataAsset, setSelectedDataAsset] = useState([]);
  const [checkedBoxes, setCheckedBoxes] = useState([]);
  const [showToDatepickerForIndex, setShowToDatepickerForIndex] =
    useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDateInCheck = (event, selectedDate, asset) => {
    setShowToDatepicker(false);
    console.log(event, selectedDate, asset, 'ggg');

    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = `${selectedDate.getMonth() + 1}`.padStart(2, '0');
      const day = `${selectedDate.getDate()}`.padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      setToDate(formattedDate);

      const filteredModified = filteredAssetData.map(i => {
        if (i.accessory_id_wh === asset.accessory_id_wh) {
          return {
            ...i,
            date: formattedDate,
          };
        } else {
          return i;
        }
      });

      setFilteredAssetData(filteredModified);
    }
  };
  const handleAssetRemark = (itemValue, asset) => {
    const filteredModified = filteredAssetData.map(i => {
      if (i.accessory_id_wh === asset.accessory_id_wh) {
        return {
          ...i,
          textValue: itemValue,
        };
      } else {
        return i;
      }
    });

    setFilteredAssetData(filteredModified);
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
    const Username = 'SVVG';
    const Password = 'Pass@123';
    const basicAuth = 'Basic ' + base64Encode(Username + ':' + Password);

    try {
      const response = await fetch(
        'https://ezatlas.co.in/AMS-SVVG-ANDROID/webapi/De_linkAPI/asset_dropdown?usertype&searchword',
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
        setAssetDropdownData(data.data);
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

  useEffect(() => {
    const initialCheckboxes = {};
    assetDropdownData.forEach(item => {
      initialCheckboxes[item.asset_id] = false;
    });
    setSelectedCheckboxes(initialCheckboxes);
  }, [assetDropdownData]);
  const handleAssetChange = itemValue => {
    const selectedAssetData = assetDropdownData.find(
      asset => asset.asset_id === itemValue,
    );
    setSelectedAsset({
      accessory_id: selectedAssetData?.accessory_id || '',
      serial_num: selectedAssetData?.serial_num || '',
      nm_accessory: selectedAssetData?.nm_accessory || '',
      Link_date: selectedAssetData?.Link_date || '',
      asset_id: selectedAssetData?.asset_id || '',
      asset_nm: selectedAssetData?.asset_nm || '',
      accessory_id_wh: selectedAssetData?.accessory_id_wh || '',
      asset_cd: selectedAssetData?.asset_cd || '',
    });
    const filteredData = assetDropdownData.filter(
      asset => asset.asset_id === itemValue,
    );
    const includeDatenText = filteredData.map(i => ({
      ...i,
      date: '',
      textValue: '',
      checked: false,
    }));
    console.log(includeDatenText, 'idc');
    setFilteredAssetData(includeDatenText);
    setLoginType(itemValue);

    // Initialize checkboxes state individually
    const initialCheckboxes = {};
    filteredData.forEach(asset => {
      initialCheckboxes[asset.asset_id] = false;
    });
    setSelectedCheckboxes(initialCheckboxes);
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
    try {
      setIsLoading(true);

      const isChecked = filteredAssetData.filter(i => i.checked);

      console.log(isChecked.length, 'icsc');

      if (isChecked.length === 0) {
        Alert.alert(
          'Validation Error',
          'Please select at least one accessory.',
          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        );
        return;
      }

      const missingValues = isChecked.filter(i => !i.date || !i.textValue);
      const postData = isChecked.filter(i => i.date || i.textValue);
      console.log(postData, 'pssss');
      if (missingValues.length > 0) {
        Alert.alert(
          'Validation Error',
          'Please fill in all required fields for the selected accessories.',
          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        );
        return;
      }
      const Username = 'SVVG';
      const Password = 'Pass@123';
      const basicAuth = 'Basic ' + base64Encode(Username + ':' + Password);

      const apiUrl =
        'https://ezatlas.co.in/AMS-SVVG-ANDROID/webapi/De_linkAPI/SetDlinkStatus';

      const requestBody = {
        data: postData.map(asset => ({
          uninstallAssetDate: asset.date,
          uninstallAssetID: asset.accessory_id_wh,
          uninstallRmk: asset.textValue,
        })),
      };
      console.log(requestBody, 'postLink');

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
        navigation.navigate('Dashboard');
      }

      const responseText = await response.text();
      console.log('POST Response:', responseText);
      Alert.alert('Response', responseText, [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
    } catch (error) {
      console.error('Error posting data:', error);
    } finally {
      setIsLoading(false); // Hide loader
    }
  };
  const handleSearchInputChange = text => {
    setSearchText(text);
  };
  const handleCheckboxChange = asset => {
    const filteredModified = filteredAssetData.map(i => {
      if (i.accessory_id_wh === asset.accessory_id_wh) {
        return {
          ...i,
          checked: !i.checked,
        };
      } else {
        return i;
      }
    });

    setFilteredAssetData(filteredModified);
  };
  const findValueByLabel = label => {
    const matchingItem = assetDropdownData.find(
      item => item.asset_cd === label,
    );
    return matchingItem ? matchingItem.asset_id : null;
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
              {filteredAssetData &&
                filteredAssetData
                  .filter(item => item.accessory_id.includes(searchText))
                  .map((asset, idx) => (
                    <Card key={idx} style={styles.card}>
                      {console.log(asset,"Asset")}
                      <Card.Content>
                        <Checkbox
                          status={asset.checked ? 'checked' : 'unchecked'}
                          onPress={() => handleCheckboxChange(asset)}
                        />

                        <View style={styles.labelContainer}>
                          <Text style={{...styles.label, color: '#ff8a3d'}}>
                            Accessories Id :
                          </Text>
                          <Text style={styles.cardvalue}>
                            {asset.accessory_id}
                          </Text>
                        </View>
                        <View style={styles.labelContainer}>
                          <Text style={{...styles.label, color: '#ff8a3d'}}>
                            Accessories Name :
                          </Text>
                          <Text style={styles.cardvalue}>
                            {asset.nm_accessory}
                          </Text>
                        </View>
                        <View style={styles.labelContainer}>
                          <Text style={{...styles.label, color: '#ff8a3d'}}>
                            Serial No:
                          </Text>
                          <Text style={styles.cardvalue}>
                            {asset.serial_num}
                          </Text>
                        </View>
                        <View style={styles.labelContainer}>
                          <Text style={{...styles.label, color: '#ff8a3d'}}>
                            Linked Date :
                          </Text>
                          <Text style={styles.value}>{asset.Link_date}</Text>
                        </View>
                       
                        <TextInput
                          style={styles.dateInput}
                          placeholder="Dlink Date"
                          placeholderTextColor="gray"
                          value={asset.date}
                          editable={asset.checked ? true : false}
                          onFocus={() => (
                            setShowToDatepickerForIndex(idx),
                            setShowToDatepicker(true)
                          )}
                        />
                        {showToDatepickerForIndex === idx &&
                          showToDatepicker && ( // Only show date picker for the selected index
                            <DateTimePicker
                              value={new Date()}
                              mode="date"
                              display="default"
                              onChange={(e, selectedDate) =>
                                handleDateInCheck(e, selectedDate, asset)
                              }
                            />
                          )}
                        <TextInput
                          style={styles.remarks}
                          onChangeText={value =>
                            handleAssetRemark(value, asset)
                          }
                          value={asset.textValue}
                          placeholder="Enter Remarks"
                          placeholderTextColor="gray"
                          editable={asset.checked ? true : false}
                        />
                      </Card.Content>
                    </Card>
                  ))}
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
                {[...new Set(assetDropdownData.map(item => item.asset_cd))].map(
                  uniqueLabel => {
                    const matchingItem = assetDropdownData.find(
                      item => item.asset_cd === uniqueLabel,
                    );
                    return (
                      <Picker.Item
                        key={uniqueLabel}
                        label={
                          matchingItem ? matchingItem.asset_cd : uniqueLabel
                        }
                        value={findValueByLabel(uniqueLabel)}
                      />
                    );
                  },
                )}
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
    
  }, dropIt: {
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
