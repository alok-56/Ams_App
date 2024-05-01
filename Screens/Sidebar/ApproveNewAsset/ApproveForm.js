import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,ActivityIndicator
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {encode} from 'base-64';
import {useNavigation} from '@react-navigation/native';

const ApproveForm = ({route}) => {
  const navigation = useNavigation();

  const [apiData, setApiData] = useState([]);
  const [poNumber, setPoNumber] = useState('');
  const [poDate, setPoDate] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [grnNumber, setGrnNumber] = useState('');
  const [grnDate, setGrnDate] = useState('');
  const [dcNumber, setDcNumber] = useState('');
  const [dcDate, setDcDate] = useState('');
  const [vendor, setVendor] = useState('');
  const [modalName, setModalName] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [assetType, setAssetType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [location, setLocation] = useState('');
  const [department, setDepartment] = useState('');
  const [center, setCenter] = useState('');
  const [description, setDescription] = useState('');
  const [remarks, setRemarks] = useState('');
  const [idInv, setIdInv] = useState(0);
  const [idInvM, setIdInvM] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const id_inv_m = route.params?.id_inv_m;
    const id_inv = route.params?.id_inv;
    setIdInvM(id_inv_m);
    setIdInv(id_inv);
    fetchData(id_inv_m, id_inv);
  }, [route.params?.id_inv_m, route.params?.id_inv]);

  const fetchData = async (id_inv_m, id_inv) => {
    console.log(id_inv_m, id_inv, 'oooooooo');
    setLoading(true);
    try {
      const Username = 'SVVG';
      const Password = 'Pass@123';
      const credentials = encode(`${Username}:${Password}`);
      const response = await fetch(
        `https://ezatlas.co.in/AMS-SVVG-ANDROID/webapi/Store_Approver/SelectedItemDetails?id_inv_m=${id_inv_m}&id_inv=${id_inv}`,
        {
          headers: {
            Authorization: `Basic ${credentials}`,
          },
        },
      );

      const responseData = await response.json();
      console.log(responseData, 'resdtssss');
      if (Array.isArray(responseData.data) && responseData.data.length > 0) {
        const itemDetails = responseData.data[0];
        setApiData(itemDetails);
        // Populate form fields
        setPoNumber(itemDetails.PONumber);
        setPoDate(itemDetails.PODate);
        setInvoiceNumber(itemDetails.InvoiceNO);
        setInvoiceDate(itemDetails.InvoiceDate);
        setGrnNumber(itemDetails.GRN);
        setGrnDate(itemDetails.GRNdate);
        setDcNumber(itemDetails.DCNum);
        setDcDate(itemDetails.DCDate);
        setVendor(itemDetails.Vendor);
        setModalName(itemDetails.Item);
        setCategory(itemDetails.Category);
        setSubCategory(itemDetails.SubCategory);
        setAssetType(itemDetails.AssetType);
        setQuantity(itemDetails.Quantity);
        setUnitPrice(itemDetails.Price);
        setLocation(itemDetails.Location);
        setDepartment(itemDetails.Department);
        setCenter(itemDetails.CostCenter);
        setDescription(itemDetails.ItemDescription);
        setRemarks(itemDetails.Remarks || '');
      } else {
        console.error('Error fetching data: Data is not an array or is empty');
        setApiData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setApiData([]);
    }finally {
      // Hide the activity indicator when fetching data is complete
      setLoading(false);
    }
  };

  const handleAcceptReject = async status => {
    if (!remarks.trim()) {
      Alert.alert('Alert', 'Please enter all the details');
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0];

    // Input date in the format dd/mm/yyyy
    var inputDate = apiData.InvoiceDate;

    // Split the input date into day, month, and year
    var dateComponents = inputDate.split('/');
    var day = parseInt(dateComponents[0], 10);
    var month = parseInt(dateComponents[1], 10);
    var year = parseInt(dateComponents[2], 10);
    console.log(day, 'jkikk');
    // Create a new Date object using the components
    var formattedDate =
      year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2);
    console.log(formattedDate, 'fgtt');

    // Convert the Date object to a string in the format yyyy-mm-dd

    const postData = {
      data: [
        {
          id_emp_user: '1',
          id_inv: idInv,
          id_inv_m: idInvM,
          dt_approv: currentDate,
          dt_inv: formattedDate,
          id_loc: apiData.IDLocation,
          id_sgrp: apiData.IDSubCategory,
          id_grp: apiData.IDCategory,
          status: status,
          rmk_asst: remarks,
        },
      ],
    };

    console.log('postData-->', postData);

    try {
      const Username = 'SVVG';
      const Password = 'Pass@123';
      const credentials = encode(`${Username}:${Password}`);
      const response = await fetch(
        'https://ezatlas.co.in/AMS-SVVG-ANDROID/webapi/Store_Approver/UpdateStatusApprove',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${credentials}`,
          },
          body: JSON.stringify(postData),
        },
      );

      // Check if the response is successful (status 2xx)
      if (response.ok) {
        console.log(response, 'datatatat');
        const responseData = await response.text(); // Get the raw response as text
        console.log(responseData, 'respppp');
        // Display different alerts based on status
        if (status === 'Accepted') {
          Alert.alert(
            'Accepted',
            'Record has been Accepted successfully\n\nIt may take some time to Reflect in the Table',
            [
              {
                text: 'OK',
                onPress: () => navigation.navigate('ApproveNewAsset'),
              },
            ],
          );
        } else if (status === 'Rejected') {
          Alert.alert(
            'Rejected',
            'Record has been Rejected successfully\n\nIt may take some time to Reflect in the Table',
            [
              {
                text: 'OK',
                onPress: () => navigation.navigate('ApproveNewAsset'),
              },
            ],
            {message: 'It may take some time to reflect in the table'},
          );
        } else {
          // Handle other status cases if needed
          Alert.alert('Success', responseData);
        }

        // You might want to navigate back or perform other actions here
      } else {
        // Handle error case
        console.error('Error in API response:', response.status);
        Alert.alert('Error', 'Failed to communicate with the server');
      }
    } catch (error) {
      console.error('Error in API call:', error);
      Alert.alert('Error', 'Failed to communicate with the server');
    }
  };

  const styles = StyleSheet.create({
    headings: {
      fontSize: 15,
      fontWeight: 'bold',
      color: 'black',
      marginLeft: '3%',
      marginBottom: '1%',
    },
    textinputs: {
      borderWidth: 1,
      borderColor: 'black',
      color: 'black',
      width: '95%',
      padding: 10,
      justifyContent: 'center',
      alignSelf: 'center',
      borderRadius: 5,
    },
    button: {
      backgroundColor: '#ff8a3d',
      padding: 10,
      alignItems: 'center',
      borderRadius: 5,
      width: '100%',
      alignSelf: 'center',
      margin: '5%',
      marginTop: '30%',
      marginBottom: '10%',
    },
    buttonText: {
      color: 'white',
      fontSize: 18,
    },
  });
  return (
    <ScrollView>
    <View style={{flex:1}}>
    {loading && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',marginTop:'80%' }}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
        {!loading && (
      <View>
      
        <View style={{backgroundColor: '#ff8a3d'}}>
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: 18,
              padding: 10,
            }}>
            Item/Model Details
          </Text>
        </View>
        <View style={{marginTop: '5%'}}>
          <Text style={styles.headings}>Item/Model Name</Text>
          <TextInput
            style={styles.textinputs}
            onChangeText={value => setModalName(value)}
            value={modalName}
            placeholder="Search for item..."
            placeholderTextColor="gray"
            editable={false}
            multiline={true}
          />
        </View>
        <View style={{marginTop: '3%'}}>
          <Text style={styles.headings}>Category</Text>
          <TextInput
            style={styles.textinputs}
            onChangeText={value => setCategory(value)}
            value={category}
            editable={false}
            multiline={true}
          />
        </View>
        <View style={{marginTop: '3%'}}>
          <Text style={styles.headings}>Sub Category</Text>
          <TextInput
            style={styles.textinputs}
            onChangeText={value => setSubCategory(value)}
            value={subCategory}
            editable={false}
            multiline={true}
          />
        </View>
        <View style={{marginTop: '3%'}}>
          <Text style={styles.headings}>Asset Type</Text>
          <TextInput
            style={styles.textinputs}
            onChangeText={value => setAssetType(value)}
            value={assetType}
            editable={false}
            multiline={true}
          />
        </View>
        <View style={{marginTop: '3%'}}>
          <Text style={styles.headings}>Quantity</Text>
          <TextInput
            style={styles.textinputs}
            onChangeText={value => setQuantity(value)}
            value={quantity}
            editable={false}
            multiline={true}
          />
        </View>
        <View style={{marginTop: '3%'}}>
          <Text style={styles.headings}>Unit Price</Text>
          <TextInput
            style={styles.textinputs}
            onChangeText={value => setUnitPrice(value)}
            value={unitPrice}
            editable={false}
            multiline={true}
          />
        </View>
        <View style={{marginTop: '3%'}}>
          <Text style={styles.headings}>Location</Text>
          <TextInput
            style={styles.textinputs}
            onChangeText={value => setLocation(value)}
            value={location}
            editable={false}
            multiline={true}
          />
        </View>
        <View style={{marginTop: '3%'}}>
          <Text style={styles.headings}>Department</Text>
          <TextInput
            style={styles.textinputs}
            onChangeText={value => setDepartment(value)}
            value={department}
            editable={false}
            multiline={true}
          />
        </View>
        <View style={{marginTop: '3%'}}>
          <Text style={styles.headings}>Cost Center/Project</Text>
          <TextInput
            style={styles.textinputs}
            onChangeText={value => setCenter(value)}
            value={center}
            editable={false}
            multiline={true}
          />
        </View>
        <View style={{marginTop: '3%'}}>
          <Text style={styles.headings}>Item Description</Text>
          <TextInput
            style={styles.textinputs}
            onChangeText={value => setDescription(value)}
            value={description}
            editable={false}
            multiline={true}
          />
        </View>
        <View style={{marginTop: '3%'}}>
          <Text style={styles.headings}>Remarks</Text>
          <TextInput
            style={styles.textinputs}
            onChangeText={value => setRemarks(value)}
            value={remarks}
            multiline={true}
          />
        </View>
        <View style={{backgroundColor: '#ff8a3d', marginTop: '3%'}}>
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: 18,
              padding: 10,
            }}>
            Invoice Details
          </Text>
        </View>
        <View style={{marginTop: '3%'}}>
          <Text style={styles.headings}>PO Number</Text>
          <TextInput
            style={styles.textinputs}
            onChangeText={value => setPoNumber(value)}
            value={poNumber}
            editable={false}
            multiline={true}
          />
        </View>
        <View style={{marginTop: '3%'}}>
          <Text style={styles.headings}>PO Date</Text>
          <TextInput
            style={styles.textinputs}
            onChangeText={value => setPoDate(value)}
            value={poDate}
            editable={false}
            multiline={true}
          />
        </View>
        <View style={{marginTop: '3%'}}>
          <Text style={styles.headings}>Invoice Number</Text>
          <TextInput
            style={styles.textinputs}
            onChangeText={value => setInvoiceNumber(value)}
            value={invoiceNumber}
            editable={false}
            multiline={true}
          />
        </View>
        <View style={{marginTop: '3%'}}>
          <Text style={styles.headings}>Invoice Date</Text>
          <TextInput
            style={styles.textinputs}
            onChangeText={value => setInvoiceDate(value)}
            value={invoiceDate}
            editable={false}
            multiline={true}
          />
        </View>
        <View style={{marginTop: '3%'}}>
          <Text style={styles.headings}>GRN Number</Text>
          <TextInput
            style={styles.textinputs}
            onChangeText={value => setGrnNumber(value)}
            value={grnNumber}
            editable={false}
            multiline={true}
          />
        </View>
        <View style={{marginTop: '3%'}}>
          <Text style={styles.headings}>GRN Date</Text>
          <TextInput
            style={styles.textinputs}
            onChangeText={value => setGrnDate(value)}
            value={grnDate}
            editable={false}
            multiline={true}
          />
        </View>
        <View style={{marginTop: '3%'}}>
          <Text style={styles.headings}>DC Number</Text>
          <TextInput
            style={styles.textinputs}
            onChangeText={value => setDcNumber(value)}
            value={dcNumber}
            editable={false}
            multiline={true}
          />
        </View>
        <View style={{marginTop: '3%'}}>
          <Text style={styles.headings}>DC Date</Text>
          <TextInput
            style={styles.textinputs}
            onChangeText={value => setDcDate(value)}
            value={dcDate}
            editable={false}
            multiline={true}
          />
        </View>
        <View style={{marginTop: '3%'}}>
          <Text style={styles.headings}>Vendor</Text>
          <TextInput
            style={styles.textinputs}
            onChangeText={value => setVendor(value)}
            value={vendor}
            editable={false}
            multiline={true}
          />
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
          <TouchableOpacity onPress={() => handleAcceptReject('Accepted')}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Accept</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleAcceptReject('Rejected')}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Reject</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ApproveForm;