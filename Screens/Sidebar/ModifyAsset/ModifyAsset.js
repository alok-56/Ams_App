import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {Table, Row} from 'react-native-table-component';
import {encode} from 'base-64';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Sidebar from '../Sidebar';
import {useFocusEffect} from '@react-navigation/native';
const ModifyAsset = ({navigation}) => {
  const [apiData, setApiData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const itemsPerPage = 15;
  const tableHeadings = [
    'Invoice No',
    'Invoice Date',
    'Requested By',
    'Asset Name/Model',
    'Vendor',
    'Total Quantity',
    'Add to Store',
  ];

  const MyTable = ({data, headings}) => {
    const cellWidths = [95, 110, 80, 150, 200, 80, 50];
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;

    const handleAddToStorePress = (id_inv_m, id_inv) => {
      navigation.navigate('ModifyAssetForm', {id_inv_m, id_inv});
    };

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{marginTop: '10%', marginBottom: '50%'}}>
          <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
            <Row
              data={headings}
              style={{
                height: 40,
                backgroundColor: '#ff8a3d',
                width: '100%',
              }}
              textStyle={{
                color: 'white',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
              widthArr={cellWidths}
            />
            {data &&
              data.slice(startIdx, endIdx).map((rowData, rowIndex) => (
                <Row
                  key={rowIndex}
                  data={[
                    ...rowData.slice(0, 6), // Columns before "Add to Store"
                    <TouchableOpacity
                      onPress={() =>
                        handleAddToStorePress(rowData[6], rowData[7])
                      } // Pass both id_inv_m and id_inv
                      key={`plusIcon_${rowIndex}`}
                      style={{alignItems: 'center'}}>
                      <Icon name="add" size={30} color="#ff8a3d" />
                    </TouchableOpacity>,
                  ]}
                  style={{
                    height: 35,
                    justifyContent: 'space-evenly',
                    color: 'black',
                  }}
                  textStyle={{
                    textAlign: 'center',
                    color: 'black',
                  }}
                  widthArr={[...cellWidths]}
                />
              ))}
          </Table>
        </View>
      </ScrollView>
    );
  };

  const fetchData = async () => {
    try {
      const Username = 'SVVG';
      const Password = 'Pass@123';
      const idEmpUser = 1;
      const userType = 'Super';
      const credentials = encode(`${Username}:${Password}`);
      const response = await fetch(
        `https://ezatlas.co.in/AMS-SVVG-ANDROID/webapi/Store_Rejectlist/dropdownlist?id_emp_user=${idEmpUser}&userType=${userType}&searchWord`,
        {
          headers: {
            Authorization: `Basic ${credentials}`,
          },
        },
      );

      const responseData = await response.json();

      if (Array.isArray(responseData.data) && responseData.data.length > 0) {
        const mappedData = responseData.data.map(item => [
          item.InvoiceNo,
          item.InvoiceDate,
          item.RequestBy,
          item['AssetName/Item'],
          item.Vendor,
          item.TotalQty,
          item.id_inv_m,
          item.id_inv,
          // item.id_inv_m,
        ]);
        setApiData(mappedData);
      } else {
        setApiData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setApiData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      // Your effect code here
      fetchData(); // Clean up function (if needed)
    }, []),
  );

  const handlePageChange = newPage => {
    setCurrentPage(newPage);
  };

  const renderPaginationButtons = () => {
    const totalItems = apiData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Display up to 5 pagination buttons, along with previous and next arrows
    const visiblePages = 5;
    const startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    const endPage = Math.min(totalPages, startPage + visiblePages - 1);

    return (
      <View style={styles.paginationContainer}>
        {currentPage > 1 && (
          <TouchableOpacity
            style={styles.paginationButton}
            onPress={() => handlePageChange(currentPage - 1)}>
            <Text style={styles.paginationButtonText}>{'<'}</Text>
          </TouchableOpacity>
        )}

        {[...Array(endPage - startPage + 1).keys()].map(index => (
          <TouchableOpacity
            key={startPage + index}
            style={[
              styles.paginationButton,
              currentPage === startPage + index &&
                styles.activePaginationButton,
            ]}
            onPress={() => handlePageChange(startPage + index)}>
            <Text style={styles.paginationButtonText}>{startPage + index}</Text>
          </TouchableOpacity>
        ))}

        {currentPage < totalPages && (
          <TouchableOpacity
            style={styles.paginationButton}
            onPress={() => handlePageChange(currentPage + 1)}>
            <Text style={styles.paginationButtonText}>{'>'}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const styles = StyleSheet.create({
    button: {
      backgroundColor: '#ff8a3d',
      padding: '3%',
      alignItems: 'center',
      border: 'none',
      width: '40%',
      alignSelf: 'center',
      margin: '5%',
    },
    buttonText: {
      color: 'white',
      fontSize: 18,
    },
    paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginVertical: '3%',
    },
    paginationButton: {
      padding: 8,
      marginHorizontal: '2%',
      border: 'none',
      color: 'white',
    },
    activePaginationButton: {
      backgroundColor: '#ff8a3d',
      color: 'white',
    },
    paginationButtonText: {
      color: 'black',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    exportButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: '3%',
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
  });

  return (
    <ScrollView>
      <View>
        {apiData && apiData.length > 0 ? (
          <>
            <MyTable data={apiData} headings={tableHeadings} />
            {renderPaginationButtons()}
          </>
        ) : (
          <>
            <MyTable data={[]} headings={tableHeadings} />
            <Text
              style={{
                height: 35,
                justifyContent: 'center',
                color: 'gray',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
              textStyle={{
                textAlign: 'center',
                color: 'gray',
              }}>
              No Rejected Assets
            </Text>
          </>
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

export default ModifyAsset;
