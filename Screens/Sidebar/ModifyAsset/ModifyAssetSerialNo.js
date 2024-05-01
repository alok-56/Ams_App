import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {encode} from 'base-64';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UpdateRejectedSerialNo = ({route, navigation}) => {
  const [refreshData, setRefreshData] = useState(false);
  const {
    modalName,
    quantity,
    unitPrice,
    taggable,
    warranty,
    startDate,
    endDate,
    leaseStatus,
    typeOfProcurement,
    location,
    department,
    costCenter,
    itemDescription,
    description,
    poNumber,
    poDate,
    invoiceNumber,
    invoiceDate,
    grnNumber,
    grnDate,
    dcNumber,
    dcDate,
    vendor,
    diskSpace,
    ram,
    operatingSystem,
    osServiceType,
    selectedModelId,
    idAssetdiv,
    idSAssetdiv,
    typAsst,
    modalNm,
    leaseStartDate,
    leaseEndDate,
    selectedLocationId,
    selectedDepartmentId,
    locationId,
    subLocationId,
    buildingId,
    idDept,
    idVendor,
    idCostCenter,
  } = route.params;
  console.log(route.params, 'uiio');
  const [serialNumbers, setSerialNumbers] = useState(
    Array.from({length: quantity}, (_, index) => ({
      serialNo: '',
      assetRef: '',
      id: index + 1,
    })),
  );

  const [fetchSerialNumbers, setFetchSerialNumbers] = useState(false);
  const [serialVal, setSerialVal] = useState('');
  const [sapno, setSapno] = useState('');
  const [uploadInv, setUploadInv] = useState('');
  const [idInv, setIdInv] = useState(0);
  const [idInvM, setIdInvM] = useState(0);
  useEffect(() => {
    const retrieveUploadInv = async () => {
      try {
        // Retrieve upload_inv from AsyncStorage
        const storedUploadInv = await AsyncStorage.getItem('modifStore');
        if (storedUploadInv !== null) {
          setUploadInv(storedUploadInv);
        }
      } catch (error) {
        console.error('Error retrieving upload_inv from AsyncStorage:', error);
      }
    };

    retrieveUploadInv();
  }, []);
  const clearImage = async () => {
    try {
      // Retrieve upload_inv from AsyncStorage
      await AsyncStorage.removeItem('modifStore');
    } catch (error) {
      console.error('Error removing upload_inv from AsyncStorage:', error);
    }
  };

  useEffect(() => {
    const id_inv_m = route.params?.idInvM;
    const id_inv = route.params?.idInv;
    console.log('id_inv_m', id_inv_m);
    console.log('id_inv', id_inv);

    setIdInvM(id_inv_m);
    setIdInv(id_inv);
  }, [route.params?.idInv, route.params?.idInvM]);
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

  const handleSaveData = async () => {
    try {
      const Idempuser = await getData();
      const apiUrl =
        'https://ezatlas.co.in/AMS-SVVG-ANDROID/webapi/Store_Rejectlist/UpdateAddToStore';
      const username = 'SVVG';
      const password = 'Pass@123';
      const headers = new Headers();
      headers.set(
        'Authorization',
        `Basic ${encode(`${username}:${password}`)}`,
      );
      headers.set('Content-Type', 'application/json');
      const isSerialNumbersEmpty = serialNumbers.some(
        sn => sn.serialNo.trim() === '' || sn.assetRef.trim() === '',
      );

      if (isSerialNumbersEmpty) {
        Alert.alert(
          'Validation Error',
          'Please fill in all Serial Numbers and Asset Reference Numbers.',
        );
        return;
      }

      const convertDate = dateString => {
        const dateParts = dateString.split('/');
        if (dateParts.length === 3) {
          const [day, month, year] = dateParts;
          return `${year}-${month}-${day}`;
        } else {
          return dateString;
        }
      };

      const convertDatesInObject = obj => {
        console.log(obj, 'kol');
        const newObj = {};

        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            const value = obj[key];

            // Check if the value is a string and matches the date pattern
            if (
              typeof value === 'string' &&
              /\d{2}\/\d{2}\/\d{4}/.test(value)
            ) {
              console.log('jjjjjjelo');
              newObj[key] = convertDate(value);
            } else {
              newObj[key] = value;
            }
          }
        }

        const bodaydata = {
          data: [newObj],
        };
        return bodaydata;
      };

      const requestData = {
        data: [
          {
            nm_model: modalName,
            id_model: selectedModelId,
            id_grp: idAssetdiv,
            id_sgrp: idSAssetdiv,
            typ_asst: typAsst,
            qty_asst: quantity,
            id_emp_user: Idempuser,
            val_asst: unitPrice,
            tag: taggable,
            warr_amc: warranty,
            dt_amc_start: startDate,
            dt_amc_exp: endDate,
            st_lease: leaseStatus,
            typ_proc: typeOfProcurement,
            std_lease: leaseStartDate,
            endt_lease: leaseEndDate,
            id_flr: selectedLocationId,
            id_dept: idDept,
            id_cc: idCostCenter,
            item_description: description,
            rmk_asst: '',
            no_po: poNumber,
            dt_po: poDate,
            no_inv: invoiceNumber,
            dt_inv: invoiceDate,
            no_grn: grnNumber,
            dt_grn: grnDate,
            no_dc: dcNumber,
            dt_dc: dcDate,
            id_ven: idVendor,
            storeage_typ: diskSpace,
            ram_typ: ram,
            process_typ: operatingSystem,
            st_config: osServiceType,
            id_loc: locationId,
            id_subl: subLocationId,
            id_building: buildingId,
            ds_pro: modalName,
            ds_asst: modalName,
            id_inv_m: `${idInvM}`,
            id_inv: `${idInv}`,
            no_model: modalName,
            cst_asst: '',
            tt_un_prc: '',
            invoice_file: uploadInv,
            SerialVal: serialVal,
            sapno: serialVal,
          },
        ],
      };
      const convertedData = convertDatesInObject(requestData.data[0]);

      console.log('Request Payload:', JSON.stringify(convertedData));

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(convertedData),
      });

      const responseText = await response.text();
      console.log('Server Response:', responseText);
      if (responseText) {
        await clearImage();
      }
      Alert.alert('Success', 'Update Successfully', [
        {
          text: 'OK',
          onPress: () => {
            setSerialNumbers(
              Array.from({length: quantity}, (_, index) => ({
                serialNo: '',
                assetRef: '',
                id: index + 1,
              })),
            );
            setSerialVal('');
            setSapno('');
            navigation.navigate('ModifyAsset');
            setUploadInv('');
          },
        },
      ]);

      //   if (!response.ok) {
      //     throw new Error(`HTTP error! Status: ${response.status}`);
      //   }

      //   const responseData = await response.json();
      //   if (responseData.status === 'Record has been inserted successfully') {
      //     console.log('Record has been inserted successfully');

      // Reset the state values
      //     setSerialNumbers(
      //       Array.from({length: quantity}, (_, index) => ({
      //         serialNo: '',
      //         assetRef: '',
      //         id: index + 1,
      //       })),
      //     );
      //     setSerialVal('');
      //     setSapno('');
      //   } else {
      //     console.error('Error:', responseData.message);
      //     Alert.alert('Error', responseData.message);
      //   }
    } catch (error) {
      console.log('error', error);
      Alert.alert('Error', error.message);
    }
  };
  const handleDontSerial = async () => {
    try {
      setFetchSerialNumbers(true);
      const apiUrl =
        'https://ezatlas.co.in/AMS-SVVG-ANDROID/webapi/Add_To_Store/Serial_No';
      const username = 'SVVG';
      const password = 'Pass@123';

      const headers = new Headers();
      headers.set(
        'Authorization',
        `Basic ${encode(`${username}:${password}`)}`,
      );
      headers.set('Content-Type', 'application/json');

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();

      const currentSerialNumber = parseInt(responseData.data[0].slNo);
      const currentMaxValue = parseInt(responseData.data[0].maxvalue);

      const generatedSerialNumbers = Array.from(
        {length: quantity},
        (_, index) => ({
          serialNo: `NA${currentSerialNumber + index}${
            currentMaxValue + index
          }`,
          assetRef: `NA${currentSerialNumber + index}${
            currentMaxValue + index
          }`,
          id: index + 1,
        }),
      );

      setSerialNumbers(generatedSerialNumbers);

      // Update SerialVal and sapno
      const serialValStr = generatedSerialNumbers
        .map(sn => sn.serialNo)
        .join(',,');
      const sapnoStr = generatedSerialNumbers.map(sn => sn.assetRef).join(',,');
      setSerialVal(serialValStr);
      setSapno(sapnoStr);
    } catch (error) {
      console.error('Error fetching serial numbers:', error);
    } finally {
      setFetchSerialNumbers(false);
    }
  };

  useEffect(() => {
    getData();
    if (fetchSerialNumbers) {
      handleDontSerial();
    }
  }, [fetchSerialNumbers]);
  useEffect(() => {
    // Check if the refreshData state has changed
    if (refreshData) {
      // Fetch data again or trigger the necessary update
      getData(); // Assuming getData is your fetch function

      // Reset the refreshData state to false
      setRefreshData(false);
    }
  }, [refreshData]);
  const handleBackPress = () => {
    setRefreshData(true);
    navigation.navigate('ModifyAssetForm', {idInvM, idInv});
  };

  const handleSerialNumberChange = (value, index) => {
    if (!/\s/.test(value) || value === '') {
      const updatedSerialNumbers = [...serialNumbers];
      updatedSerialNumbers[index].serialNo = value;
      setSerialNumbers(updatedSerialNumbers);
    }
  };
  const handleInputChange = (value, index, field) => {
    if (!/\s/.test(value) || value === '') {
      const updatedSerialNumbers = [...serialNumbers];
      updatedSerialNumbers[index][field] = value;
      setSerialNumbers(updatedSerialNumbers);
    }
  };

  return (
    <ScrollView>
      <View>
        <TouchableOpacity onPress={() => setFetchSerialNumbers(true)}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Do Not Have Serial No</Text>
          </View>
        </TouchableOpacity>

        {serialNumbers.map((serialNumber, index) => (
          <View key={index} style={{flexDirection: 'row'}}>
            <View style={{marginTop: '5%'}}>
              <Text
                style={styles.headings}>{`Serial No ${serialNumber.id}`}</Text>
              <TextInput
                style={styles.textinputs}
                onChangeText={value => handleSerialNumberChange(value, index)}
                value={serialNumber.serialNo}
                placeholder={`Enter Serial No ${serialNumber.id}`}
                placeholderTextColor="gray"
              />
            </View>
            <View style={{marginTop: '5%'}}>
              <Text
                style={
                  styles.headings
                }>{`Asset REF.NO${serialNumber.id}`}</Text>
              <TextInput
                style={styles.textinputs}
                onChangeText={value =>
                  handleInputChange(value, index, 'assetRef')
                }
                value={serialNumber.assetRef}
                placeholder={`Enter Asset REF.NO${serialNumber.id}`}
                placeholderTextColor="gray"
              />
            </View>
          </View>
        ))}
        {/* <View >
      <Text style={{color:'black'}}>Values to be posted:</Text>
      <Text style={{color:'black'}}>Modal Name: {modalName}</Text>
      <Text style={{color:'black'}}>ID Model: {selectedModelId}</Text>
      <Text style={{color:'black'}}>Quantity: {quantity}</Text>
      <Text style={{color:'black'}}>Unit Price: {unitPrice}</Text>
      <Text style={{color:'black'}}>Taggable: {taggable}</Text>
      <Text style={{color:'black'}}>Warranty: {warranty}</Text>
      <Text style={{color:'black'}}>leaseStatus: {leaseStatus}</Text>
      <Text style={{color:'black'}}>Start Date: {startDate}</Text>
      <Text style={{color:'black'}}>end Date: {endDate}</Text>
      <Text style={{color:'black'}}>Typ of proc: {typeOfProcurement}</Text>
      <Text style={{color:'black'}}>Locations: {location}</Text>
      <Text style={{color:'black'}}>department: {department}</Text>
      <Text style={{color:'black'}}>cost center: {costCenter}</Text>
      <Text style={{color:'black'}}>itemDescription: {itemDescription}</Text>
      <Text style={{color:'black'}}>poNumber: {poNumber}</Text>
      <Text style={{color:'black'}}>poDate: {poDate}</Text>
      <Text style={{color:'black'}}>invoiceNumber: {invoiceNumber}</Text>
      <Text style={{color:'black'}}>invoiceDate: {invoiceDate}</Text>
      <Text style={{color:'black'}}>grnNumber: {grnNumber}</Text>
      <Text style={{color:'black'}}>grnDate: {grnDate}</Text>
      <Text style={{color:'black'}}>dcNumber: {dcNumber}</Text>
      <Text style={{color:'black'}}>dcDate: {dcDate}</Text>
      <Text style={{color:'black'}}>vendor: {vendor}</Text>
      <Text style={{color:'black'}}>operatingSystem: {operatingSystem}</Text>
      <Text style={{color:'black'}}>ram: {ram}</Text>
      <Text style={{color:'black'}}>diskSpace: {diskSpace}</Text>
      <Text style={{color:'black'}}>osServiceType: {osServiceType}</Text>
      <Text style={{color:'black'}}>selectedModelId: {selectedModelId}</Text>
      <Text style={{color:'black'}}>idAssetdiv: {idAssetdiv}</Text>
      <Text style={{color:'black'}}>idSAssetdiv: {idSAssetdiv}</Text>
      <Text style={{color:'black'}}>typAsst: {typAsst}</Text>
<Text style={{color:'black'}}>modalNm: {serialVal}</Text>
<Text style={{color:'black'}}>Received upload_inv: {uploadInv}</Text>
<Text style={{color:'black'}}>locationId: {locationId}</Text>
    <Text style={{color:'black'}}>subLocationId: {subLocationId}</Text>
    <Text style={{color:'black'}}>buildingId: {buildingId}</Text>
    <Text style={{color:'black'}}>Id: {Idempuser}</Text>
    </View> */}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginTop: '8%',
          }}>
          <TouchableOpacity onPress={handleSaveData}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Save</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleBackPress}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Back</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  textinputs: {
    borderWidth: 1,
    borderColor: 'black',
    color: 'black',
    width: '95%',
    padding: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 5,
    marginLeft: '10%',
  },
  headings: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: '10%',
    marginBottom: '1%',
  },
  button: {
    backgroundColor: '#ff8a3d',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    width: '80%',
    alignSelf: 'center',
    margin: '5%',
    marginTop: '10%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default UpdateRejectedSerialNo;
