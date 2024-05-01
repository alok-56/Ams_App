import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {encode} from 'base-64';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BaseUrl} from '../../../../Api/BaseUrl';

const UploadFile = ({from}) => {
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const uploadDocument = async () => {
    try {
      const pickedFile = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });

      const base64Data = await RNFS.readFile(pickedFile.uri, 'base64');
      const formData = new FormData();
      formData.append('file', {
        uri: pickedFile.uri,
        type: pickedFile.type,
        name: pickedFile.name,
      });

      let response = await fetch(
        `http://13.235.186.102:8090/api/files/upload`,
        {
          method: 'POST',
          body: formData,
        },
      );
      response = await response.json();
      if (response.message === 'File uploaded successfully.') {
        console.log('Document uploaded successfully');
        Alert.alert('Upload Document', 'Document uploaded successfully');
        console.log(response);
        setUploadedDocument({
          base64Data,
          fileName: pickedFile.name,
          fileType: pickedFile.type,
        });

        if (from === 'addToStore') {
          return await AsyncStorage.setItem('upload_inv', response.fileName);
        } else if (from === 'modifStore') {
          return await AsyncStorage.setItem('modifStore', response.fileName);
        } else {
          return await AsyncStorage.setItem('upload_inv', response.fileName);
        }
      } else {
        console.error('Failed to upload document. Status:', response.status);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Document picker canceled');
      } else {
        console.error('Error picking document:', err);
        throw err;
      }
    }
  };

  return (
    <View>
      <View style={{marginTop: '3%'}}>
        <TouchableOpacity onPress={uploadDocument}>
          <Text
            style={{
              textAlign: 'center',
              backgroundColor: '#052d6e',
              color: 'white',
              fontWeight: 'bold',
              padding: 10,
              borderRadius: 10,
              width: '45%',
              marginTop: '3%',
              marginLeft: '3%',
            }}>
            Upload Document
          </Text>
        </TouchableOpacity>
        {uploadedDocument && (
          <View style={{marginLeft: '3%'}}>
            <Text style={{color: 'black'}}>Uploaded Document:</Text>
            <Text style={{color: 'black'}}>
              Name: {uploadedDocument.fileName}
            </Text>
            <Text style={{color: 'black'}}>
              Type: {uploadedDocument.fileType}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default UploadFile;
