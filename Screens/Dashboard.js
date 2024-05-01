import React, {useState, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {Card, Title} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Sidebar from './Sidebar/Sidebar';
import FIcon from 'react-native-vector-icons/FontAwesome6';
import ReportIcon from 'react-native-vector-icons/Octicons';
import {encode} from 'base-64';

const Dashboard = ({navigation, config}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inStoreCount, setInStoreCount] = useState('Loading...');
  const [allocatedAssetCount, setAllocatedAssetCount] = useState('Loading...');

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleLogout}
          style={{position: 'absolute', top: '30%', left: '65%', zIndex: 1}}>
          <Icon name="logout" color="white" size={25} />
        </TouchableOpacity>
      ),
    });
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={handleMenuIconPress}
          style={{position: 'absolute', top: '30%', left: '20%', zIndex: 1}}>
          <Icon name="menu" color="white" size={25} />
        </TouchableOpacity>
      ),
    });
  });

  const handleMenuIconPress = () => {
    setSidebarOpen(prevState => !prevState);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };
  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  };
  const handleEmployee = () => {
    navigation.navigate('Employee');
  };
  const handleInstore = () => {
    navigation.navigate('Instore');
  };
  const handleDamagedAssets = () => {
    navigation.navigate('DamagedAssets');
  };
  const fetchInStoreCount = async () => {
    try {
      const Username = 'SVVG'; // Replace with your actual username
      const Password = 'Pass@123'; // Replace with your actual password
      const basicAuth = 'Basic ' + encode(`${Username}:${Password}`);

      const response = await fetch(
        'https://ezatlas.co.in/AMS-SVVG-ANDROID/webapi/Count_Asset/Instore',
        {
          method: 'GET',
          headers: {
            Authorization: basicAuth,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data && Array.isArray(data.data)) {
        const inStoreAsset = data.data[0]?.In_store_Asset;
        setInStoreCount(inStoreAsset || 'N/A');
      }
      console.log(inStoreCount, 'instoreeee');
    } catch (error) {
      console.error('Error fetching in-store count:', error);
      // Handle error, e.g., show an error message
      setInStoreCount('Error');
    }
  };

  const fetchAllocatedAssetCount = async () => {
    try {
      const Username = 'SVVG'; // Replace with your actual username
      const Password = 'Pass@123'; // Replace with your actual password
      const basicAuth = 'Basic ' + encode(`${Username}:${Password}`);

      const response = await fetch(
        'https://ezatlas.co.in/AMS-SVVG-ANDROID/webapi/Count_Asset/Allocated_Asset',
        {
          method: 'GET',
          headers: {
            Authorization: basicAuth,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data && Array.isArray(data.data)) {
        const allocatedAssetCount = data.data[0]?.Allocated_Asset;
        setAllocatedAssetCount(allocatedAssetCount || 'N/A');
      }
      console.log(allocatedAssetCount, 'innnnnnn');
    } catch (error) {
      console.error('Error fetching in-store count:', error);
      // Handle error, e.g., show an error message
      setAllocatedAssetCount('Error');
    }
  };
  useEffect(() => {
    console.log('Fetching data...');
    fetchInStoreCount();
    fetchAllocatedAssetCount();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={{width: '100%'}} onPress={handleEmployee}>
        <Card style={{...styles.card, backgroundColor: 'orange'}}>
          <Card.Content>
            <Title>
              <FIcon
                name="user-plus"
                size={24}
                color="gray"
                style={styles.ficon}
              />
            </Title>
            <Title style={{color: 'white', marginTop: '2%'}}>
              {allocatedAssetCount}
            </Title>
            <Text style={{color: 'white', marginTop: '2%'}}>
              Allocated to Employee
            </Text>
          </Card.Content>
        </Card>
      </TouchableOpacity>
      <TouchableOpacity style={{width: '100%'}} onPress={handleInstore}>
        <Card style={{...styles.card, backgroundColor: 'purple'}}>
          <Card.Content>
            <Title>
              <Icon
                name="view-list"
                size={24}
                color="gray"
                style={styles.ficon}
              />
            </Title>
            <Title style={{color: 'white', marginTop: '2%'}}>
              {inStoreCount}
            </Title>
            <Text style={{color: 'white', marginTop: '2%'}}>In Store</Text>
          </Card.Content>
        </Card>
      </TouchableOpacity>
      <TouchableOpacity style={{width: '100%'}} onPress={handleDamagedAssets}>
        <Card style={{...styles.card, backgroundColor: '#ff4d00'}}>
          <Card.Content>
            <Title>
              <ReportIcon
                name="report"
                size={24}
                color="gray"
                style={styles.ficon}
              />
            </Title>
            <Title style={{color: 'white', marginTop: '2%'}}>
              Damaged Assets
            </Title>
            <Text style={{color: 'white', marginTop: '2%'}}>
              Damaged Assets
            </Text>
          </Card.Content>
        </Card>
      </TouchableOpacity>
      {sidebarOpen && (
        <View style={styles.sidebar}>
          <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: '5%',
    alignContent: 'center',
  },
  iconContainer: {},
  icon: {
    position: 'absolute',
    top: '23%',
    left: '80%',
    zIndex: 1,
  },
  ficon: {
    color: '#f0f0f0',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: '5%',
    paddingTop: '5%',
    justifyContent: 'center',
  },
  card: {
    width: '80%',
    height: 150,
    margin: '1%',
    backgroundColor: '#cccfff',
    borderRadius: 10,
    overflow: 'hidden',
    alignContent: 'center',
    marginLeft: '10%',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    marginBottom: 10,
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

export default Dashboard;
