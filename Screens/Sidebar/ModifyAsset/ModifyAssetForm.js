import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {encode} from 'base-64';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import UploadFile from '../Assets/AddToStore/UploadFile';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Sidebar from '../Sidebar';
import {useFocusEffect} from '@react-navigation/native';
import {BaseUrl} from '../../../Api/BaseUrl';

const ModifyAssetForm = ({route, navigation}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modalNm, setModalNm] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [taggable, setTaggable] = useState('');
  const [warranty, setWarranty] = useState('');
  const [leaseStatus, setLeaseStatus] = useState('');
  const [typeOfProcurement, setTypeOfProcurement] = useState('');
  const [department, setDepartment] = useState('');
  const [costCenter, setCostCenter] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [poNumber, setPoNumber] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [grnNumber, setGrnNumber] = useState('');
  const [grnDate, setGrnDate] = useState('');
  const [dcNumber, setDcNumber] = useState('');
  const [dcDate, setDcDate] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [vendor, setVendor] = useState('');
  const [showStartDatepicker, setShowStartDatepicker] = useState(false);
  const [showEndDatepicker, setShowEndDatepicker] = useState(false);
  const [showLeaseStartDatepicker, setShowLeaseStartDatepicker] =
    useState(false);
  const [showLeaseEndDatepicker, setShowLeaseEndDatepicker] = useState(false);
  const [showPoDatepicker, setShowPoDatepicker] = useState(false);
  const [showInvoiceDatepicker, setShowInvoiceDatepicker] = useState(false);
  const [showGrnDatepicker, setShowGrnDatepicker] = useState(false);
  const [showDcDatepicker, setShowDcDatepicker] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [leaseStartDate, setLeaseStartDate] = useState('');
  const [leaseEndDate, setLeaseEndDate] = useState('');
  const [poDate, setPoDate] = useState('');
  const [showDateInputs, setShowDateInputs] = useState(false);
  const [showLeaseDateInputs, setShowLeaseDateInputs] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [centers, setCenters] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedModelId, setSelectedModelId] = useState('');
  const [idSAssetdiv, setIdSAssetdiv] = useState('');
  const [idAssetdiv, setIdAssetdiv] = useState('');
  const [typAsst, setTypAsst] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [diskSpace, setDiskSpace] = useState('');
  const [operatingSystem, setOperatingSystem] = useState('');
  const [osServiceType, setOsServiceType] = useState('');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
  const [ram, setRam] = useState('');
  const [refreshData, setRefreshData] = useState(false);
  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [selectedLocationDetails, setSelectedLocationDetails] = useState(null);
  const [locationId, setLocationId] = useState('');
  const [subLocationId, setSubLocationId] = useState('');
  const [buildingId, setBuildingId] = useState('');
  const [dsAsset, setDsAsset] = useState('');
  const [idInv, setIdInv] = useState(0);
  const [idInvM, setIdInvM] = useState(0);
  const [apiData, setApiData] = useState([]);
  const [center, setCenter] = useState('');
  const [description, setDescription] = useState('');
  const [remarks, setRemarks] = useState('');
  const [idDept, setIdDept] = useState('');
  const [idVendor, setIdvendor] = useState('');
  const [idCostCenter, setIdCostCenter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showConfig, setShowConfig] = useState(true);

  useEffect(() => {
    const id_inv_m = route.params?.id_inv_m;
    setIdInvM(id_inv_m);
    fetchData(id_inv_m);
  }, [route.params?.id_inv_m]);

  const fetchData = async id_inv_m => {
    setLoading(true);

    try {
      const Username = 'SVVG';
      const Password = 'Pass@123';
      const credentials = encode(`${Username}:${Password}`);
      const getIt = await fetchLocations();
      const getModalData = await fetchModels();
      const getDeparmentData = await fetchDepartments();
      const getVendorData = await fetchVendors();
      const getIdcc = await fetchCenters();
      if (id_inv_m === undefined) {
        return;
      }
      const response = await fetch(`${BaseUrl}/asset/Invoice/${id_inv_m}`, {
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      });

      const resData = await response.json();
      if (resData) {
        setApiData(resData);
        setPoNumber(resData?.idinvm?.nopo);
        setPoDate(resData?.idinvm?.dtpo);
        setInvoiceNumber(resData?.idinvm?.noinv);
        setInvoiceDate(resData?.idinvm?.dtinv);
        setGrnNumber(resData?.idinvm?.nogrn);
        setGrnDate(resData?.idinvm?.dt_grn);
        setDcNumber(resData?.idinvm?.nodc);
        setDcDate(resData?.idinvm?.dtdc);
        setVendor(resData?.idinvm?.idven?.nmven);
        setModalName(resData?.idmodel?.idmodel);
        setTaggable(resData?.tag);
        setQuantity(resData?.qty);
        setUnitPrice(resData?.unprc);
        setLocation(resData?.idinvm?.idflr?.idflr);
        setDepartment(resData?.idinvm.iddept.iddept);
        setCostCenter(resData?.idinvm.idcc.idcc);
        setDescription(resData?.idmodel?.itemdesc);
        setTypeOfProcurement(resData?.typeproc);
        setWarranty(resData?.warramc);
        setLeaseStatus(resData?.stlease);
        setStartDate(resData?.dtamcstart);
        setEndDate(resData?.dtamcexp);
        setLeaseStartDate(resData?.stdlease);
        setLeaseEndDate(resData?.endtlease);
      } else {
        setApiData([]);
      }
    } catch (error) {
      setApiData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };
  const handleBackPress = () => {
    navigation.navigate('Dashboard');
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

  const handleValidation = () => {
    const emptyFields = [];
    if (!modalName) emptyFields.push('Modal Name');
    if (!quantity) emptyFields.push('Quantity');
    if (!unitPrice) emptyFields.push('UnitPrice');
    if (!taggable) emptyFields.push('Taggable');
    if (!warranty) emptyFields.push('warranty');
    if (!leaseStatus) emptyFields.push('Lease Status');
    if (!department) emptyFields.push('Department');
    if (!typeOfProcurement) emptyFields.push('Type of Procurement');
    if (!location) emptyFields.push('Location');
    if (!costCenter) emptyFields.push('Cost Center');
    if (!poNumber) emptyFields.push('PO Number');
    if (!poDate) emptyFields.push('PO Date');
    if (!invoiceNumber) emptyFields.push('Invoice Number');
    if (!invoiceDate) emptyFields.push('Invoice Date');
    if (!vendor) emptyFields.push('Vendor');
    if (!grnDate) emptyFields.push('GRN Date');
    if (!dcDate) emptyFields.push('DC Date');
    if (emptyFields.length > 0) {
      const errorMessage = `Please fill in the following fields: ${emptyFields.join(
        ', ',
      )}.`;
      Alert.alert('Required Fields', errorMessage);
      return false;
    }

    return true;
  };

  const handleSerialNo = () => {
    if (handleValidation()) {
      navigation.navigate('updateAssetSerialNo', {
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
        idInv,
        idInvM,
      });
    }
  };
  const handleWarrantyChange = itemValue => {
    setWarranty(itemValue);
    setShowDateInputs(itemValue === 'A' || itemValue === 'W');
  };
  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatepicker(false);
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = `${selectedDate.getMonth() + 1}`.padStart(2, '0');
      const day = `${selectedDate.getDate()}`.padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      const endDate = new Date(selectedDate);
      endDate.setFullYear(year + 1);

      const endYear = endDate.getFullYear();
      const endMonth = `${endDate.getMonth() + 1}`.padStart(2, '0');
      const endDay = `${endDate.getDate()}`.padStart(2, '0');
      const formattedEndDate = `${endYear}-${endMonth}-${endDay}`;

      setStartDate(formattedDate);
      setEndDate(formattedEndDate);
    }
  };

  const handleLeaseStartDateChange = (event, selectedDate) => {
    setShowLeaseStartDatepicker(false);
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = `${selectedDate.getMonth() + 1}`.padStart(2, '0');
      const day = `${selectedDate.getDate()}`.padStart(2, '0');
      const formattedStartDate = `${year}-${month}-${day}`;

      // Calculate lease end date by setting the year to the current year
      const endDate = new Date(selectedDate);
      endDate.setFullYear(new Date().getFullYear() + 1);

      const endYear = endDate.getFullYear();
      const endMonth = `${endDate.getMonth() + 1}`.padStart(2, '0');
      const endDay = `${endDate.getDate()}`.padStart(2, '0');
      const formattedEndDate = `${endYear}-${endMonth}-${endDay}`;

      setLeaseStartDate(formattedStartDate);
      setLeaseEndDate(formattedEndDate);
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndDatepicker(false);
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = `${selectedDate.getMonth() + 1}`.padStart(2, '0');
      const day = `${selectedDate.getDate()}`.padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      setEndDate(formattedDate);
    }
  };
  const handleLeaseEndDateChange = (event, selectedDate) => {
    setShowLeaseEndDatepicker(false);
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = `${selectedDate.getMonth() + 1}`.padStart(2, '0');
      const day = `${selectedDate.getDate()}`.padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      setLeaseEndDate(formattedDate);
    }
  };
  const handlePODateChange = (event, selectedDate) => {
    setShowPoDatepicker(false);
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = `${selectedDate.getMonth() + 1}`.padStart(2, '0');
      const day = `${selectedDate.getDate()}`.padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      setPoDate(formattedDate);
    }
  };
  const handleInvoiceDateChange = (event, selectedDate) => {
    setShowInvoiceDatepicker(false);
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = `${selectedDate.getMonth() + 1}`.padStart(2, '0');
      const day = `${selectedDate.getDate()}`.padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      setInvoiceDate(formattedDate);
    }
  };
  const handleGrnDateChange = (event, selectedDate) => {
    setShowGrnDatepicker(false);
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = `${selectedDate.getMonth() + 1}`.padStart(2, '0');
      const day = `${selectedDate.getDate()}`.padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      setGrnDate(formattedDate);
    }
  };
  const handleDcDateChange = (event, selectedDate) => {
    setShowDcDatepicker(false);
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = `${selectedDate.getMonth() + 1}`.padStart(2, '0');
      const day = `${selectedDate.getDate()}`.padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      setDcDate(formattedDate);
    }
  };
  const fetchDepartments = async () => {
    try {
      const Username = 'SVVG';
      const Password = 'Pass@123';

      const credentials = encode(`${Username}:${Password}`);
      const response = await fetch(
        `${BaseUrl}/master/MasterGetAll?mastername=Dept&requireString=SelectAll`,
        {
          headers: {
            Authorization: `Basic ${credentials}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setDepartments(data);
      return data;
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };
  const fetchVendors = async () => {
    try {
      const Username = 'SVVG';
      const Password = 'Pass@123';

      const credentials = encode(`${Username}:${Password}`);
      const response = await fetch(
        `${BaseUrl}/master/MasterGetAll?mastername=Vendor&requireString=SelectAll`,
        {
          headers: {
            Authorization: `Basic ${credentials}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setVendors(data);
      return data;
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };
  const fetchCenters = async () => {
    try {
      const Username = 'SVVG';
      const Password = 'Pass@123';

      const credentials = encode(`${Username}:${Password}`);
      const response = await fetch(
        `${BaseUrl}/master/MasterGetAll?mastername=CC&requireString=SelectAll`,
        {
          headers: {
            Authorization: `Basic ${credentials}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setCenters(data);
      return data;
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };
  const fetchLocations = async () => {
    try {
      const Username = 'SVVG';
      const Password = 'Pass@123';

      const credentials = encode(`${Username}:${Password}`);
      const response = await fetch(
        `${BaseUrl}/master/MasterGetAll?mastername=Floor&requireString=SelectAll`,
        {
          headers: {
            Authorization: `Basic ${credentials}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setLocations(data);
      return data;
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };
  const handleLocationSelection = (itemValue, itemIndex) => {
    var selectedLocationDetails = [];
    if (itemIndex !== undefined) {
      selectedLocationDetails = itemIndex.filter(
        item => item.nmflr === itemValue,
      );
    }

    setSelectedLocationId(selectedLocationDetails[0]?.id_flr || '');
    setSelectedLocationDetails(selectedLocationDetails);

    setLocationId(selectedLocationDetails[0]?.id_loc);
    setSubLocationId(selectedLocationDetails[0]?.id_sloc);
    setBuildingId(selectedLocationDetails[0]?.id_building);
  };
  const fetchModels = async () => {
    try {
      const Username = 'SVVG';
      const Password = 'Pass@123';

      const credentials = encode(`${Username}:${Password}`);
      const response = await fetch(
        `${BaseUrl}/master/MasterGetAll?mastername=Material&requireString=SelectAll`,
        {
          headers: {
            Authorization: `Basic ${credentials}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const formatedData = data && data.filter(i => i?.nm_model !== '');

      setModels(formatedData);
      return data;
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };
  useEffect(() => {
    fetchDepartments();
    fetchVendors();
    fetchCenters();
    fetchLocations();
    fetchModels();
  }, []);

  const getModalDetails = (e, dataIndex) => {
    const selectedModel = dataIndex.find(item => item?.nm_model === e);

    if (selectedModel) {
      const {
        nm_model,
        id_model,
        id_s_assetdiv,
        id_assetdiv,
        typ_asst,
        ds_asst,
      } = selectedModel;

      setModalNm(nm_model);
      setSelectedModelId(id_model);
      setIdSAssetdiv(id_s_assetdiv);
      setIdAssetdiv(id_assetdiv);
      setTypAsst(typ_asst);
      setDsAsset(ds_asst);
      setItemDescription(ds_asst);
      if (typ_asst === 'NON-IT' || typ_asst === 'SOFTWARE') {
        setShowConfig(false);
      } else {
        setShowConfig(true);
      }
    }
  };
  const handleLeaseStatusChange = itemValue => {
    setLeaseStatus(itemValue);
    setLeaseStartDate('');
    setLeaseEndDate('');
    setShowLeaseDateInputs(itemValue === 'UL');
  };
  const handleQuantityNumber = value => {
    if (/^\d*\.?\d+$/.test(value) || value === '') {
      const numericValue = parseFloat(value);

      if (numericValue > 0 || value === '') {
        setQuantity(value);
      }
    }
  };
  const handleUnitPriceNumber = value => {
    if ((/^\d*\.?\d*$/.test(value) && parseFloat(value) > 0) || value === '') {
      setUnitPrice(value);
    }
  };
  const handlePoNumberChange = value => {
    if (!/\s/.test(value) || value === '') {
      setPoNumber(value);
    }
  };
  const handleInvoiceNumberChange = value => {
    if (!/\s/.test(value) || value === '') {
      setInvoiceNumber(value);
    }
  };
  const handleGrnNumberChange = value => {
    if (!/\s/.test(value) || value === '') {
      setGrnNumber(value);
    }
  };
  const handleDcNumberChange = value => {
    if (!/\s/.test(value) || value === '') {
      setDcNumber(value);
    }
  };
  const handleOsServiceTypeChange = value => {
    if (!/\s/.test(value) || value === '') {
      setOsServiceType(value);
    }
  };

  const handleIdDepSet = (itemValue, dataIndex) => {
    const filteredDep =
      dataIndex && dataIndex.filter(i => i?.nmdept === itemValue);

    setIdDept(filteredDep[0]?.iddept);
  };
  const handeIdVend = (itemValue, dataIndex) => {
    const filteredDep =
      dataIndex && dataIndex.filter(i => i?.nm_ven === itemValue);

    setIdvendor(filteredDep[0]?.id_ven);
  };
  const handleIdCc = (itemValue, dataIndex) => {
    const filteredDep =
      dataIndex && dataIndex.filter(i => i?.nm_cc === itemValue);

    setIdCostCenter(filteredDep[0]?.id_cc);
  };

  return (
    <ScrollView>
      <View style={{flex: 1}}>
        {loading && (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '80%',
            }}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}

        {!loading && (
          <View style={styles.container}>
            <View style={{backgroundColor: '#052d6e'}}>
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

            <View style={{marginTop: '3%'}}>
              <Text style={styles.headings}>Item/Model Name*</Text>
              <View
                style={{
                  borderWidth: 1,
                  width: '95%',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  height: 58,
                  borderRadius: 5,
                }}>
                <Picker
                  selectedValue={modalName}
                  onValueChange={(itemValue, itemIndex) => {
                    getModalDetails(itemValue, models), setModalName(itemValue);
                  }}
                  style={styles.picker}
                  placeholder="Select Asset">
                  <Picker.Item label="Select an option" value="" />
                  {models &&
                    models.map(dept => (
                      <Picker.Item
                        key={dept.nmmodel}
                        label={dept.nmmodel}
                        value={dept.idmodel}
                      />
                    ))}
                </Picker>
              </View>
            </View>
            <View style={{marginTop: '3%'}}>
              <Text style={styles.headings}>Quantity*</Text>
              <TextInput
                style={styles.textinputs}
                onChangeText={handleQuantityNumber}
                value={quantity.toString()}
                keyboardType="numeric"
              />
            </View>
            <View style={{marginTop: '3%'}}>
              <Text style={styles.headings}>Unit Price*</Text>
              <TextInput
                style={styles.textinputs}
                onChangeText={handleUnitPriceNumber}
                value={unitPrice.toString()}
                keyboardType="numeric"
              />
            </View>
            <View style={{marginTop: '3%'}}>
              <Text style={styles.headings}>Taggable*</Text>
              <View
                style={{
                  borderWidth: 1,
                  width: '95%',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  height: 58,
                  borderRadius: 5,
                }}>
                <Picker
                  selectedValue={taggable}
                  onValueChange={itemValue => setTaggable(itemValue)}
                  style={styles.picker}
                  placeholder="Select Asset">
                  <Picker.Item label="Select an option" value="" />
                  <Picker.Item label="Yes" value="Yes" />
                  <Picker.Item label="No" value="No" />
                </Picker>
              </View>
            </View>
            <View style={{marginTop: '3%'}}>
              <Text style={styles.headings}>AMC/Warranty*</Text>
              <View
                style={{
                  borderWidth: 1,
                  width: '95%',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  height: 58,
                  borderRadius: 5,
                }}>
                <Picker
                  selectedValue={warranty}
                  onValueChange={value => {
                    handleWarrantyChange(value);
                    setShowDateInputs(value === 'A' || value === 'W');
                  }}
                  style={styles.picker}
                  placeholder="Select Asset">
                  <Picker.Item label="Select an option" value="" />
                  <Picker.Item label="NO" value="O" />
                  <Picker.Item label="AMC" value="A" />
                  <Picker.Item label="Warranty" value="W" />
                </Picker>
              </View>
            </View>
            {showDateInputs && (
              <>
                <View style={{marginTop: '3%'}}>
                  <Text style={styles.headings}>Start Date*</Text>
                  <TextInput
                    style={styles.textinputs}
                    placeholder="Start Date"
                    placeholderTextColor="gray"
                    value={startDate}
                    onFocus={() => setShowStartDatepicker(true)}
                  />
                  {showStartDatepicker && (
                    <DateTimePicker
                      value={new Date()}
                      mode="date"
                      display="default"
                      onChange={handleStartDateChange}
                    />
                  )}
                </View>
                <View style={{marginTop: '3%'}}>
                  <Text style={styles.headings}>End Date*</Text>
                  <TextInput
                    style={styles.textinputs}
                    placeholder="End Date"
                    placeholderTextColor="gray"
                    value={endDate}
                    onFocus={() => setShowEndDatepicker(true)}
                  />
                  {showEndDatepicker && (
                    <DateTimePicker
                      value={new Date()}
                      mode="date"
                      display="default"
                      onChange={handleEndDateChange}
                    />
                  )}
                </View>
              </>
            )}
            <View style={{marginTop: '3%'}}>
              <Text style={styles.headings}>Lease Status*</Text>
              <View
                style={{
                  borderWidth: 1,
                  width: '95%',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  height: 58,
                  borderRadius: 5,
                }}>
                <Picker
                  selectedValue={leaseStatus}
                  onValueChange={value => {
                    handleLeaseStatusChange(value);
                    setShowLeaseDateInputs(value === 'UL');
                  }}
                  style={styles.picker}
                  placeholder="Select Asset">
                  <Picker.Item label="Select an option" value="" />
                  <Picker.Item label="Not Under Lease" value="NUL" />
                  <Picker.Item label="Under Lease" value="UL" />
                </Picker>
              </View>
            </View>
            {showLeaseDateInputs && (
              <>
                <View style={{marginTop: '3%'}}>
                  <Text style={styles.headings}>Start Date*</Text>
                  <TextInput
                    style={styles.textinputs}
                    placeholder="Start Date"
                    placeholderTextColor="gray"
                    value={leaseStartDate}
                    onFocus={() => setShowLeaseStartDatepicker(true)}
                  />
                  {showLeaseStartDatepicker && (
                    <DateTimePicker
                      value={new Date()}
                      mode="date"
                      display="default"
                      onChange={handleLeaseStartDateChange}
                    />
                  )}
                </View>
                <View style={{marginTop: '3%'}}>
                  <Text style={styles.headings}>End Date*</Text>
                  <TextInput
                    style={styles.textinputs}
                    placeholder="End Date"
                    placeholderTextColor="gray"
                    value={leaseEndDate}
                    onFocus={() => setShowLeaseEndDatepicker(true)}
                  />
                  {showLeaseEndDatepicker && (
                    <DateTimePicker
                      value={new Date()}
                      mode="date"
                      display="default"
                      onChange={handleLeaseEndDateChange}
                    />
                  )}
                </View>
              </>
            )}
            <View style={{marginTop: '3%'}}>
              <Text style={styles.headings}>Type of Procurement*</Text>
              <View
                style={{
                  borderWidth: 1,
                  width: '95%',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  height: 58,
                  borderRadius: 5,
                }}>
                <Picker
                  selectedValue={typeOfProcurement}
                  onValueChange={itemValue => setTypeOfProcurement(itemValue)}
                  style={styles.picker}
                  placeholder="Select Asset">
                  <Picker.Item label="Select an option" value="" />
                  <Picker.Item label="Outright Purchase" value="OP" />
                  <Picker.Item label="Loan Basis" value="LB" />
                  <Picker.Item label="Add-On" value="FOC" />
                </Picker>
              </View>
            </View>
            <View style={{marginTop: '3%'}}>
              <Text style={styles.headings}>Location*</Text>
              <View
                style={{
                  borderWidth: 1,
                  width: '95%',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  height: 58,
                  borderRadius: 5,
                }}>
                <Picker
                  selectedValue={location}
                  onValueChange={e => (
                    handleLocationSelection(e, locations), setLocation(e)
                  )}
                  style={styles.picker}>
                  <Picker.Item label="Select an option" value="" />
                  {locations &&
                    locations.map(dept => (
                      <Picker.Item
                        key={dept.idloc}
                        label={dept.nmflr}
                        value={dept.idflr}
                      />
                    ))}
                </Picker>
              </View>
            </View>
            <View style={{marginTop: '3%'}}>
              <Text style={styles.headings}>Department</Text>
              <View
                style={{
                  borderWidth: 1,
                  width: '95%',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  height: 58,
                  borderRadius: 5,
                }}>
                <Picker
                  selectedValue={department}
                  onValueChange={itemValue => (
                    handleIdDepSet(itemValue, departments),
                    setDepartment(itemValue)
                  )}
                  style={styles.picker}
                  placeholder="Select Department">
                  <Picker.Item label="Select an option" value="" />
                  {departments &&
                    departments.map(dept => (
                      <Picker.Item
                        key={dept.iddept}
                        label={dept.nmdept}
                        value={dept.iddept}
                      />
                    ))}
                </Picker>
              </View>
            </View>
            <View style={{marginTop: '3%'}}>
              <Text style={styles.headings}>Cost Center/Project</Text>
              <View
                style={{
                  borderWidth: 1,
                  width: '95%',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  height: 58,
                  borderRadius: 5,
                }}>
                <Picker
                  selectedValue={costCenter}
                  onValueChange={itemValue => (
                    handleIdCc(itemValue, centers), setCostCenter(itemValue)
                  )}
                  style={styles.picker}>
                  <Picker.Item label="Select an option" value="" />
                  {centers &&
                    centers.map(dept => (
                      <Picker.Item
                        key={dept.idcc}
                        label={dept.nmcc}
                        value={dept.idcc}
                      />
                    ))}
                </Picker>
              </View>
            </View>
            <View style={{marginTop: '3%'}}>
              <Text style={styles.headings}>Item Description</Text>
              <TextInput
                style={styles.textinputs}
                onChangeText={value => setDescription(value)}
                value={description}
              />
            </View>
            <View style={{marginTop: '3%'}}>
              <Text style={styles.headings}>Remarks</Text>
              <TextInput
                style={styles.textinputs}
                onChangeText={value => setRemarks(value)}
                value={remarks}
                editable={false}
                multiline={true}
              />
            </View>
            <View style={{backgroundColor: '#052d6e', marginTop: '3%'}}>
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
              <Text style={styles.headings}>PO Number*</Text>
              <TextInput
                style={styles.textinputs}
                onChangeText={handlePoNumberChange}
                value={poNumber}
              />
            </View>
            <View style={{marginTop: '3%'}}>
              <Text style={styles.headings}>PO Date*</Text>
              <TextInput
                style={styles.textinputs}
                placeholder="PO Date"
                placeholderTextColor="gray"
                value={poDate}
                onFocus={() => setShowPoDatepicker(true)}
              />
              {showPoDatepicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  display="default"
                  onChange={handlePODateChange}
                />
              )}
            </View>
            <View style={{marginTop: '3%'}}>
              <Text style={styles.headings}>Invoice Number*</Text>
              <TextInput
                style={styles.textinputs}
                onChangeText={handleInvoiceNumberChange}
                value={invoiceNumber}
              />
            </View>
            <View style={{marginTop: '3%'}}>
              <Text style={styles.headings}>Invoice Date*</Text>
              <TextInput
                style={styles.textinputs}
                placeholder="Invoice Date"
                placeholderTextColor="gray"
                value={invoiceDate}
                onFocus={() => setShowInvoiceDatepicker(true)}
              />
              {showInvoiceDatepicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  display="default"
                  onChange={handleInvoiceDateChange}
                />
              )}
            </View>
            <View style={{marginTop: '3%'}}>
              <Text style={styles.headings}>GRN Number</Text>
              <TextInput
                style={styles.textinputs}
                onChangeText={handleGrnNumberChange}
                value={grnNumber}
              />
            </View>
            <View style={{marginTop: '3%'}}>
              <Text style={styles.headings}>GRN Date*</Text>
              <TextInput
                style={styles.textinputs}
                placeholder="GRN Date"
                placeholderTextColor="gray"
                value={grnDate}
                onFocus={() => setShowGrnDatepicker(true)}
              />
              {showGrnDatepicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  display="default"
                  onChange={handleGrnDateChange}
                />
              )}
            </View>
            <View style={{marginTop: '3%'}}>
              <Text style={styles.headings}>DC Number</Text>
              <TextInput
                style={styles.textinputs}
                onChangeText={handleDcNumberChange}
                value={dcNumber}
              />
            </View>
            <View style={{marginTop: '3%'}}>
              <Text style={styles.headings}>DC Date*</Text>
              <TextInput
                style={styles.textinputs}
                placeholder="DC Date"
                placeholderTextColor="gray"
                value={dcDate}
                onFocus={() => setShowDcDatepicker(true)}
              />
              {showDcDatepicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  display="default"
                  onChange={handleDcDateChange}
                />
              )}
            </View>
            <View style={{marginTop: '3%'}}>
              <Text style={styles.headings}>Vendor*</Text>
              <View
                style={{
                  borderWidth: 1,
                  width: '95%',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  height: 58,
                  borderRadius: 5,
                }}>
                <Picker
                  selectedValue={vendor}
                  onValueChange={itemValue => (
                    handeIdVend(itemValue, vendors), setVendor(itemValue)
                  )}
                  style={styles.picker}
                  placeholder="Select Asset">
                  {vendors.map(dept => (
                    <Picker.Item
                      key={dept.id_ven}
                      label={dept.nm_ven}
                      value={dept.nm_ven}
                    />
                  ))}
                </Picker>
              </View>
            </View>
            {showConfig ? (
              <>
                <View style={{marginTop: '3%'}}>
                  <Text style={styles.headings}>Disk Space(GB)</Text>
                  <TextInput
                    style={styles.textinputs}
                    onChangeText={value => setDiskSpace(value)}
                    value={diskSpace}
                  />
                </View>
                <View style={{marginTop: '3%'}}>
                  <Text style={styles.headings}>RAM(MB)</Text>
                  <TextInput
                    style={styles.textinputs}
                    onChangeText={value => setRam(value)}
                    value={ram}
                  />
                </View>
                <View style={{marginTop: '3%'}}>
                  <Text style={styles.headings}>Operating System</Text>
                  <TextInput
                    style={styles.textinputs}
                    onChangeText={value => setOperatingSystem(value)}
                    value={operatingSystem}
                  />
                </View>
                <View style={{marginTop: '3%'}}>
                  <Text style={styles.headings}>OS Service Type</Text>
                  <TextInput
                    style={styles.textinputs}
                    onChangeText={handleOsServiceTypeChange}
                    value={osServiceType}
                  />
                </View>
              </>
            ) : (
              <></>
            )}
            <UploadFile from={'modifStore'} />

            <TouchableOpacity onPress={handleSerialNo}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Next</Text>
              </View>
            </TouchableOpacity>

            {sidebarOpen && (
              <View style={styles.sidebar}>
                <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
              </View>
            )}
          </View>
        )}
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
  },
  container: {
    flex: 1,
  },
  icon: {
    position: 'absolute',
    top: '23%',
    left: '80%',
    zIndex: 1,
  },
  content: {
    flex: 1,
    padding: '5%',
    paddingTop: '10%',
  },
  card: {
    marginBottom: '5%',
    backgroundColor: '#cccfff',
  },
  back: {
    position: 'absolute',
    marginLeft: '5%',
    marginTop: '3%',
  },
  cardicon: {
    position: 'absolute',
    marginLeft: '80%',
    marginTop: '7%',
    backgroundColor: '#ccc',
    borderRadius: 10,
    height: '100%',
    width: '25%',
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
  headings: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: '3%',
    marginBottom: '1%',
  },
  picker: {
    width: '99%',
    color: 'black',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#ff8a3d',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    width: '40%',
    alignSelf: 'center',
    margin: '5%',
    marginTop: '10%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});
export default ModifyAssetForm;
