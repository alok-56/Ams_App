import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Alert,
  Button,
} from 'react-native';
import {Card, Title} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Sidebar from '../../Sidebar';
import {Picker} from '@react-native-picker/picker';
import {ScrollView} from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import {encode} from 'base-64';
import UploadFile from './UploadFile';
import {BaseUrl} from '../../../../Api/BaseUrl';

const AddToStore = ({navigation}) => {
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
  const [selectedModel, setSelectedModel] = useState(null);
  const [searchText, setSearchText] = useState('');
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
  }, [refreshData]);
  const handleMenuIconPress = () => {
    setSidebarOpen(prevState => !prevState);
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
  useEffect(() => {
    if (refreshData) {
      setModalName('');
      setQuantity('');
      setRefreshData(false);
    }
  }, [refreshData]);
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
      navigation.navigate('SerialNo', {
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
        location,
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

      // Calculate end date by adding one year to the selected start date
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
      const endingYear = new Date(selectedDate);
      endingYear.setFullYear(new Date().getFullYear() + 1);

      const endYear = endingYear.getFullYear();
      const endMonth = `${endingYear.getMonth() + 1}`.padStart(2, '0');
      const endDay = `${endingYear.getDate()}`.padStart(2, '0');
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
      const day = ` ${selectedDate.getDate()}`.padStart(2, '0');
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
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };
  const handleLocationSelection = (itemValue, itemIndex) => {
    console.log(itemValue);
    setLocation(itemValue);
    setSelectedLocationId(itemValue);
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
      setModels(data);
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
    setRefreshData(false);
  }, [refreshData]);

  const getModalDetails = e => {
    const selectedModel = models.find(item => item?.idmodel === e);
    console.log(selectedModel.idsgrp.idgrp.idgrp);
    if (selectedModel) {
      const {
        nm_model,
        id_model,
        id_s_assetdiv,
        id_assetdiv,
        typ_asst,
        ds_asst,
      } = selectedModel;

      setModalNm(selectedModel?.nmmodel);
      setSelectedModelId(selectedModel?.idmodel);
      setIdSAssetdiv(selectedModel?.idsgrp?.idsgrp);
      setIdAssetdiv(selectedModel?.idsgrp?.idgrp?.idgrp);
      setTypAsst(selectedModel?.typasst);
      setDsAsset(ds_asst);
      setItemDescription(selectedModel?.itemdesc);
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
    if (/^\d*\.?\d*$/.test(value) || value === '') {
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
  const filteredModels = models.filter(model =>
    model?.nmmodel.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <ScrollView>
      <View style={styles.container}>
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
                getModalDetails(itemValue),
                  setModalName(itemValue),
                  getModalDetails(itemValue);
              }}
              style={styles.picker}
              placeholder="Select Asset">
              <Picker.Item label="Select an option" value="" />
              {models.map(dept => (
                <Picker.Item
                  key={dept.idmodel}
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
            value={quantity}
            keyboardType="numeric"
          />
        </View>
        <View style={{marginTop: '3%'}}>
          <Text style={styles.headings}>Unit Price*</Text>
          <TextInput
            style={styles.textinputs}
            onChangeText={handleUnitPriceNumber}
            value={unitPrice}
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
              {console.log(startDate, 'start date amc')}
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
              onValueChange={handleLocationSelection}
              style={styles.picker}>
              <Picker.Item label="Select an option" value="" />
              {locations.map(loc => (
                <Picker.Item
                  key={loc.idflr}
                  label={
                    loc.nmflr +
                    ' , ' +
                    loc.idbuilding.nmbuilding +
                    ' , ' +
                    loc.idbuilding.idloc.nmLoc
                  }
                  value={loc.idflr}
                />
              ))}
            </Picker>
          </View>
        </View>
        <View style={{marginTop: '3%'}}>
          <Text style={styles.headings}>Department*</Text>
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
              onValueChange={(itemValue, itemIndex) => {
                setDepartment(itemValue);
                setSelectedDepartmentId(departments[itemIndex]?.iddept || '');
              }}
              style={styles.picker}
              placeholder="Select Department">
              <Picker.Item label="Select an option" value="" />
              {departments.map(dept => (
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
          <Text style={styles.headings}>Cost Center/Project*</Text>
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
              onValueChange={itemValue => setCostCenter(itemValue)}
              style={styles.picker}
              placeholder="Select Asset">
              <Picker.Item label="Select an option" value="" />
              {centers.map(dept => (
                <Picker.Item
                  key={dept.idcc}
                  label={dept.nmcc}
                  value={dept.idcc}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={{marginTop: '3%', marginBottom: '4%'}}>
          <Text style={styles.headings}>Item Description*</Text>
          <TextInput
            style={styles.textinputs}
            onChangeText={value => setItemDescription(value)}
            value={itemDescription}
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
          <Text style={styles.headings}>Vendor</Text>
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
              onValueChange={itemValue => setVendor(itemValue)}
              style={styles.picker}
              placeholder="Select Asset">
              <Picker.Item label="Select an option" value="" />
              {vendors.map(dept => (
                <Picker.Item
                  key={dept.idven}
                  label={dept.nmven}
                  value={dept.idven}
                />
              ))}
            </Picker>
          </View>
        </View>
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
        <UploadFile from={'addToStore'} />

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
export default AddToStore;
