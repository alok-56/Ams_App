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
import {BaseUrl} from '../../../../Api/BaseUrl';

const SerialNo = ({route, navigation}) => {
  const [refreshData, setRefreshData] = useState(false);
  const {
    handleIdLoc,
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
    poNumber,
    poDate,
    invoiceNumber,
    invoiceDate,
    grnNumber,
    grnDate,
    dcNumber,
    dcDate,
    vendor,
    operatingSystem,
    diskSpace,
    ram,
    osServiceType,
    selectedModelId,
    idAssetdiv,
    idSAssetdiv,
    typAsst,
    leaseStartDate,
    leaseEndDate,
    selectedLocationId,
    selectedDepartmentId,
    locationId,
    subLocationId,
    buildingId,
    Idempuser,
  } = route.params;
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
  const [uploadInv, setUploadInv] = useState(null);
  useEffect(() => {
    const retrieveUploadInv = async () => {
      try {
        const storedUploadInv = await AsyncStorage.getItem('upload_inv');
        setUploadInv(storedUploadInv);
      } catch (error) {
        console.error('Error retrieving upload_inv from AsyncStorage:', error);
      }
    };

    retrieveUploadInv();
  }, []);

  const getData = async () => {
    try {
      const Idempuser = await AsyncStorage.getItem('userId');
      const changeFormat = JSON.parse(Idempuser);
      return changeFormat;
    } catch (error) {
      return null;
    }
  };
  const clearImage = async () => {
    try {
      await AsyncStorage.removeItem('upload_inv');
      setUploadInv('');
    } catch (error) {
      console.error('Error removing upload_inv from AsyncStorage:', error);
    }
  };
  // const validSerialNo = async () => {
  //   try {
  //     const Idempuser = await getData();
  //     const apiUrl =
  //       'https://ezatlas.co.in/AMS-SVVG-ANDROID/webapi/Add_To_Store/CheckExitsVal ';
  //     const username = 'SVVG';
  //     const password = 'Pass@123';
  //     const headers = new Headers();
  //     headers.set(
  //       'Authorization',
  //       `Basic ${encode(`${username}:${password}`)}`,
  //     );
  //     headers.set('Content-Type', 'application/json');

  //     const requestData = {
  //       data: [
  //         {
  //           SerialVal: serialVal,
  //           sapno: serialVal,
  //         },
  //       ],
  //     };
  //     console.log('Request Payload:', JSON.stringify(requestData));
  //     const response = await fetch(apiUrl, {
  //       method: 'POST',
  //       headers: headers,
  //       body: JSON.stringify(requestData),
  //     });

  //     const responseText = await response.text();
  //     console.log('Server Response:', responseText);
  //     const match = responseText.match(/\(([^)]+)\)/);

  //     if (match && match[1]) {
  //       const errorText = match[1];
  //       Alert.alert(
  //         'Error',
  //         'Serial Number Already Exist. Please use different One',
  //       );
  //       // Use the errorText for validation or other purposes
  //       return false;
  //     } else {
  //       return true;
  //     }
  //   } catch (error) {
  //     console.log(error, 'error response');
  //   }
  // };

  const handleSaveData = async () => {
    try {
      // const isDuplicateVal = await validSerialNo();
      // if (!isDuplicateVal) {
      //   return;
      // }
      const Idempuser = await getData();
      const apiUrl =
        'https://ezatlas.co.in/AMS-SVVG-ANDROID/webapi/Add_To_Store/SavingData';
      const username = 'SVVG';
      const password = 'Pass@123';
      const headers = new Headers();
      headers.set(
        'Authorization',
        `Basic ${encode(`${username}:${password}`)}`,
      );
      headers.set('Content-Type', 'application/json');
      // const isSerialNumbersEmpty = serialNumbers.some(
      //   sn => sn.serialNo.trim() === '' || sn.assetRef.trim() === '',
      // );

      // if (isSerialNumbersEmpty) {
      //   Alert.alert(
      //     'Validation Error',
      //     'Please fill in all Serial Numbers and Asset Reference Numbers.',
      //   );
      //   return;
      // }

      const requestData = {
        data: [
          {
            nm_model: modalName,
            id_model: selectedModelId,
            id_assetdiv: idAssetdiv,
            id_s_assetdiv: idSAssetdiv,
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
            id_dept: selectedDepartmentId,
            id_cc: costCenter,
            item_description: itemDescription,
            rmk_asst: '',
            no_po: poNumber,
            dt_po: poDate,
            no_inv: invoiceNumber,
            dt_inv: invoiceDate,
            no_grn: grnNumber,
            dt_grn: grnDate,
            no_dc: dcNumber,
            dt_dc: dcDate,
            id_ven: vendor,
            storeage_typ: diskSpace,
            ram_typ: ram,
            process_typ: operatingSystem,
            st_config: osServiceType,
            id_loc: locationId,
            id_subl: subLocationId,
            id_building: buildingId,
            ds_pro: modalName,
            ds_asst: modalName,
            id_inv_m: '',
            id_inv: '',
            no_model: modalName,
            cst_asst: '',
            tt_un_prc: '',
            invoice_file: uploadInv !== null ? uploadInv : '',
            SerialVal: serialVal,
            sapno: serialVal,
          },
        ],
      };
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestData),
      });
      const responseText = await response.text();
      if (responseText) {
        await clearImage();
      }
      Alert.alert('Response', responseText, [
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

            navigation.navigate('Dashboard');
          },
        },
      ]);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      if (responseData.status === 'Record has been inserted successfully') {
        console.log('Record has been inserted successfully');
        setSerialNumbers(
          Array.from({length: quantity}, (_, index) => ({
            serialNo: '',
            assetRef: '',
            id: index + 1,
          })),
        );
        setSerialVal('');
        setSapno('');
      } else {
        console.error('Error:', responseData.message);
        Alert.alert('Error', responseData.message);
      }
    } catch (error) {
      console.log('error');
    }
  };
  const handleDontSerial = async () => {
    try {
      setFetchSerialNumbers(true);
      const apiUrl = `${BaseUrl}/asset/generateSerialNumbers?quantity=${quantity}`;
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
      console.log(responseData);

      // const currentSerialNumber = parseInt(responseData.data[0].slNo);
      // const currentMaxValue = parseInt(responseData.data[0].maxvalue);

      // const generatedSerialNumbers = Array.from(
      //   {length: quantity},
      //   (_, index) => ({
      //     serialNo: `NA${responseData + index}${
      //       currentMaxValue + index
      //     }`,
      //     assetRef: `NA${responseData + index}${
      //       currentMaxValue + index
      //     }`,
      //     id: index + 1,
      //   }),
      // );

      const newobj = responseData.map((response, index) => {
        return {
          value: response,
          id: index + 1,
        };
      });
      setSerialVal(newobj);

      // setSerialNumbers(generatedSerialNumbers);

      // // Update SerialVal and sapno
      const serialValStr = responseData.map(sn => sn).join(',');
      console.log(serialValStr);
      // setSerialVal(serialValStr);
      // setSapno(sapnoStr);
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
    if (refreshData) {
      getData();
      setRefreshData(false);
    }
  }, [refreshData]);

  const handleBackPress = () => {
    setRefreshData(true);
    navigation.navigate('AddToStore');
  };

  const handleSerialNumberChange = (value, index) => {
    if (!/\s/.test(value) || value === '') {
      // const updatedSerialNumbers = [...serialNumbers];
      // updatedSerialNumbers[index].serialNo = value;
      // console.log(updatedSerialNumbers, 'hello');
      // const serialValStr = updatedSerialNumbers
      //   .map(sn => sn.serialNo)
      //   .join(',,');
      // setSerialNumbers(updatedSerialNumbers);
      // setSerialVal(serialValStr);
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

        {serialVal.map((serialNumber, index) => (
          <View key={index} style={{flexDirection: 'row'}}>
            <View style={{marginTop: '5%'}}>
              <Text
                style={styles.headings}>{`Serial No ${serialNumber.id}`}</Text>
              <TextInput
                style={styles.textinputs}
                onChangeText={value =>
                  handleSerialNumberChange(value, serialNumber.id)
                }
                value={serialNumber.value}
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
                  handleInputChange(value, serialNumber.id, 'assetRef')
                }
                value={serialNumber.value}
                placeholder={`Enter Asset REF.NO${serialNumber.id}`}
                placeholderTextColor="gray"
              />
            </View>
          </View>
        ))}

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

export default SerialNo;
