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

  const handleSaveData = async () => {
    try {
      const Idempuser = await getData();
      const serialValStr = serialVal.map(sn => sn.value).join(',');

      console.log('ao', selectedLocationId);
      const apiUrl = `${BaseUrl}/asset/AddAsset`;
      const username = 'SVVG';
      const password = 'Pass@123';
      const headers = new Headers();
      headers.set(
        'Authorization',
        `Basic ${encode(`${username}:${password}`)}`,
      );
      headers.set('Content-Type', 'application/json');
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          idwh: 0,
          idinv: {
            idinv: 0,
            idinvm: {
              idinvm: 0,
              noinv: invoiceNumber,
              dtinv: invoiceDate,
              nopo: poNumber,
              dtpo: poDate,
              nodc: dcNumber,
              dtdc: dcDate,
              nogrn: grnNumber,
              dt_grn: grnDate,
              idflr: {
                idflr: Number(selectedLocationId),
                nmflr: '',
                idbuilding: {
                  idbuilding: 0,
                  nmbuilding: '',
                  idloc: {
                    idloc: 0,
                    nmLoc: '',
                    nmcountry: '',
                    nmstate: '',
                    nmcity: '',
                    identity: {
                      identity: 0,
                      nmentity: '',
                      cdentity: '',
                    },
                  },
                },
              },
              iddept: {
                iddept: Number(selectedDepartmentId),
                nmdept: 'string',
                cddept: 'string',
              },
              idcc: {
                idcc: Number(costCenter),
                nmcc: 'string',
              },
              idven: {
                idven: Number(vendor),
                nmven: 'string',
                cdven: 'string',
                add1: 'string',
                add2: 'string',
                country: 'string',
                state: 'string',
                city: 'string',
                pin: 'string',
                mobno: 'string',
                phone: 'string',
                pan: 'string',
                gst: 'string',
                msme: 'string',
                cin: 'string',
                tan: 'string',
                tin: 'string',
                service: 'string',
                procured: 'string',
                mailid: 'string',
              },
              addby: 0,
              statusapprove: 'waiting',
            },
            idmodel: {
              idmodel: Number(selectedModelId),
              nmmodel: '',
              typasst: '',
              itemdesc: '',
              mfr: '',
              idsgrp: {
                idsgrp: Number(idSAssetdiv),
                nmsgrp: 'string',
                cdsgrp: 'string',
                idgrp: {
                  idgrp: Number(idAssetdiv),
                  nmgrp: 'string',
                  cdgrp: 'string',
                },
              },
              iduom: {
                iduom: 0,
                nmuom: 'string',
                cduom: 'string',
              },
            },
            qty: Number(quantity),
            unprc: Number(unitPrice),
            tag: taggable,
            typeproc: typeOfProcurement,
            stlease: leaseStatus,
            endtlease: leaseStartDate,
            stdlease: leaseEndDate,
            warramc: warranty,
            dtamcstart: startDate,
            dtamcexp: endDate,
            processtyp: '',
            storeagetyp: uploadInv !== null ? uploadInv : '',
            ramtyp: '',
            stconfig: '',
          },
          idwhdyn: '',
          serialno: serialValStr,
          addby: 0,
          editby: 0,
        }),
      });
      if (response.ok) {
        await clearImage();
        Alert.alert(
          'Successfully Created New Asset',
          'Asset has been created successfully.',
          [
            {
              text: 'OK',
              onPress: () => {
                setSerialVal('');
                navigation.navigate('Dashboard');
              },
            },
          ],
        );
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.log('error');
    }
  };

  //----------------Dont have serial Number ---------------------------//
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
      const newobj = responseData.map((response, index) => {
        return {
          value: response,
          assest: response,
          id: index + 1,
        };
      });
      setSerialVal(newobj);
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

  //----------------Handling Serial Input Box--------------------------//
  const handleSerialNumberChange = (value, index) => {
    const updatedSerialVal = [...serialVal];
    updatedSerialVal[index].value = value;
    setSerialVal(updatedSerialVal);
    if (!/\s/.test(value) || value === '') {
      const updatedSerialVal = [...serialVal];
      updatedSerialVal[index].value = value;
      setSerialVal(updatedSerialVal);
    }
  };
  const handleInputChange = (value, index) => {
    if (!/\s/.test(value) || value === '') {
      const updatedSerialVal = [...serialVal];
      updatedSerialVal[index].assest = value;
      setSerialVal(updatedSerialVal);
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

        {serialVal &&
          serialVal?.map((serialNumber, index) => (
            <View key={index} style={{flexDirection: 'row'}}>
              <View style={{marginTop: '5%'}}>
                <Text
                  style={
                    styles.headings
                  }>{`Serial No ${serialNumber.id}`}</Text>
                <TextInput
                  style={styles.textinputs}
                  onChangeText={value => handleSerialNumberChange(value, index)}
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
                  onChangeText={value => handleInputChange(value, index)}
                  value={serialNumber.assest}
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
