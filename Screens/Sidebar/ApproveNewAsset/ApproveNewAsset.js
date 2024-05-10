import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Table, Row} from 'react-native-table-component';
import {encode} from 'base-64';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Sidebar from '../Sidebar';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseUrl } from '../../../Api/BaseUrl';


const ApproveNewAsset = ({navigation}) => {
  const [apiData, setApiData] = useState([]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uDetails, setUDetail] = useState({id: '', type: ''});

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const tableHeadings = [
    'S.NO',
    'Invoice No',
    'Invoice Date',
    'Requested By',
    'Asset Name/Model',
    'Vendor',
    'Total Quantity',
    'Add to Store',
  ];

  const MyTable = ({data, headings}) => {
    const cellWidths = [50, 95, 110, 80, 150, 200, 80, 50];
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;

    const handleAddToStorePress = (id_inv_m) => {
      navigation.navigate('ApproveForm', {id_inv_m});
    };

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{marginTop: '10%', marginBottom: '10%'}}>
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
            {data.length <= 0 ? (
              <Row
                data={[`No Assets to Approve`]}
                style={{
                  height: 35,
                  justifyContent: 'space-evenly',
                  color: 'gray',
                }}
                textStyle={{
                  textAlign: 'center',
                  color: 'gray',
                }}
              />
            ) : (
              data &&
              data.slice(startIdx, endIdx).map((rowData, rowIndex) => (
                <>
                  <Row
                    key={rowIndex}
                    data={[
                      rowIndex + 1,
                      ...rowData.slice(0, 6),
                      <TouchableOpacity
                        onPress={() =>
                          handleAddToStorePress(rowData[6])
                        }
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
                </>
              ))
            )}
          </Table>
        </View>
      </ScrollView>
    );
  };
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, []),
  );
  const fetchData = async () => {
    try {
      const detail = await AsyncStorage.getItem('userAccess');

      const Username = 'SVVG';
      const Password = 'Pass@123';
      const credentials = encode(`${Username}:${Password}`);
      const response = await fetch(
        `${BaseUrl}/asset/allinvoices`,
        {
          headers: {
            Authorization: `Basic ${credentials}`,
          },
        },
      );

      const responseData = await response.json();
      if (Array.isArray(responseData) && responseData.length > 0) {
        const mappedData = responseData.map(item => [
          item.idinvm.noinv,
          item.idinvm.dtinv,
          item.RequestBy,
          item.idmodel.typasst,
          item.idinvm.idven.nmven,
          item.qty,
          item.idinv,
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
        {apiData && (
          <>
            <MyTable data={apiData} headings={tableHeadings} />
            {renderPaginationButtons()}
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

export default ApproveNewAsset;
