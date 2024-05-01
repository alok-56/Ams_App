import React, {useEffect, useState} from 'react';
import {View, Alert, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {Table, Row, Rows} from 'react-native-table-component';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import XLSX from 'xlsx';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {encode} from 'base-64';
import {ScrollView} from 'react-native-gesture-handler';

const Instore = () => {
  const [apiData, setApiData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [exportIndex, setExportIndex] = useState(0);
  const itemsPerPage = 15;
  const tableHeadings = ['Asset Id', 'PO No', 'Invoice No'];

  const MyTable = ({data, headings}) => {
    const cellWidths = [150, 150, 150];
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{marginTop: '10%', marginBottom: '10%'}}>
          <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
            <Row
              data={headings}
              style={{
                height: 40,
                backgroundColor: '#052d6e',
                width: '100%',
              }}
              textStyle={{
                color: 'white',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
              widthArr={cellWidths}
            />
            {data && data.map && (
              <Rows
                data={data.slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage,
                )}
                style={{
                  height: 35,
                  justifyContent: 'space-evenly',
                  color: 'black',
                }}
                textStyle={{
                  textAlign: 'center',
                  color: 'black',
                }}
                widthArr={cellWidths}
                onPress={(rowData, rowIndex) => {
                  if (rowIndex === data.length - 1) {
                    handleAddToStorePress(rowData[0]);
                  }
                }}
              />
            )}
          </Table>
        </View>
      </ScrollView>
    );
  };

  const fetchData = async () => {
    try {
      const Username = 'SVVG';
      const Password = 'Pass@123';

      const credentials = encode(`${Username}:${Password}`);
      const response = await fetch(
        'https://ezatlas.co.in/AMS-SVVG-ANDROID/webapi/reportAPI/assetstatusreport?searchword=in_store',
        {
          headers: {
            Authorization: `Basic ${credentials}`,
          },
        },
      );

      const responseData = await response.json();

      if (Array.isArray(responseData.data) && responseData.data.length > 0) {
        const mappedData = responseData.data.map(item => [
          item.AssetID,
          item.PONo,
          item.InvoiceNo,
        ]);
        setApiData(mappedData);
      } else {
        console.error('Error fetching data: Data is not an array or is empty');
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
  const styles = StyleSheet.create({
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
    paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginVertical: 10,
    },
    paginationButton: {
      padding: 8,
      marginHorizontal: 5,
      border: 'none',
      color: 'white',
    },
    activePaginationButton: {
      backgroundColor: '#052d6e',
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
      marginBottom: 10,
    },
  });

  const generateTableHTML = ({data, headings}) => {
    const tableRows = data.map(
      rowData => `<tr>${rowData.map(cell => `<td>${cell}</td>`).join('')}</tr>`,
    );
    const tableHTML = `
      <table>
        <thead>
          <tr>${headings.map(heading => `<th>${heading}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${tableRows.join('')}
        </tbody>
      </table>
    `;
    return tableHTML;
  };
  const ensureDirectoryExists = async directoryPath => {
    const directoryExists = await RNFS.exists(directoryPath);
    if (!directoryExists) {
      await RNFS.mkdir(directoryPath);
    }
  };
  const generatePDF = async () => {
    const htmlContent = generateTableHTML({
      data: apiData,
      headings: tableHeadings,
    });
    const pdfFileName = `Instore-table(${exportIndex}).pdf`;
    const downloadsPath = `${RNFS.DownloadDirectoryPath}`;
    const pdfFilePath = `${RNFS.DownloadDirectoryPath}/${pdfFileName}`
    await ensureDirectoryExists(RNFS.DownloadDirectoryPath);
    const options = {
      html: htmlContent,
      fileName: pdfFileName,
      directory: RNFS.DownloadDirectoryPath,
    };
    setExportIndex(prevIndex => prevIndex + 1);
    try {
      const pdf = await RNHTMLtoPDF.convert(options);
      console.log('PDF Conversion Result:', pdf);

      if (pdf.filePath) {
        // Move the downloaded PDF file to the correct path
        await RNFS.moveFile(pdf.filePath, pdfFilePath);
        console.log('PDF file moved to:', pdfFilePath);
        Alert.alert('Successfully exported PDF!', ' File stored in Downloads folder');
      } else {
        console.error('PDF conversion failed. No file path received.');
        Alert.alert('PDF Export', 'Failed to export PDF!');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('PDF Export', 'Failed to export PDF!');
    }
  };
  

  const generateExcel = async () => {
    const ws = XLSX.utils.aoa_to_sheet([tableHeadings, ...apiData]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const excelBuffer = XLSX.write(wb, {bookType: 'xlsx', type: 'base64'});

    const excelFileName = `Instore-table(${exportIndex}).xlsx`;
    const excelFilePath = `${RNFS.DownloadDirectoryPath}/${excelFileName}`;
    setExportIndex(prevIndex => prevIndex + 1);
    try {
      await RNFS.writeFile(excelFilePath, excelBuffer, 'base64');
      console.log('Excel file created:', excelFilePath);
      Alert.alert('Successfully exported Excel!', ' File stored in Downloads folder');
    } catch (error) {
      console.error('Error creating Excel file:', error);
      Alert.alert('Excel Export', 'Failed to export Excel!');
    }
  };

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

  return (
    <ScrollView>
      <View>
        {apiData && apiData.length > 0 ? (
          <>
            <MyTable data={apiData} headings={tableHeadings} />
            {renderPaginationButtons()}
          </>
        ) : (
          <Text style={{color:'black'}}>Loading data...</Text>
        )}

        <View style={styles.exportButtonsContainer}>
          <View style={styles.button}>
            <TouchableOpacity onPress={generatePDF}>
              <Text style={styles.buttonText}>Export to PDF</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            <TouchableOpacity onPress={generateExcel}>
              <Text style={styles.buttonText}>Export to Excel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Instore;
