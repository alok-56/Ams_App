import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FIcon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
 
const Sidebar = ({isOpen, onClose, route}) => {
  const [userData, setUserData] = useState('');
  const navigation = useNavigation();
  const getUserDetails = async () => {
    const detail = await AsyncStorage.getItem('userAccess');
    const formatedData = await JSON.parse(detail);
    let res = getUsersData(formatedData);
  };

  const getUsersData = async usersJson => {
    if (usersJson) {
      const newModules = {};
      usersJson?.upermission?.submodules?.forEach(submodule => {
        const {idSubmodule, nmSubmodule, idmodule} = submodule;
        const {nmModule} = idmodule;
        if (!newModules[nmModule]) {
          newModules[nmModule] = [];
        }
        newModules[nmModule].push({idSubmodule, nmSubmodule, idmodule});
      });
    }
  };

  const [isAssetsClicked, setIsAssetsClicked] = useState(false);
  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.removeItem('AssestData');
      await AsyncStorage.removeItem('userDetails');
      await AsyncStorage.removeItem('userId');

      console.log('Data CLeared');
    } catch (err) {
      console.log('error', err);
    }
  };
  const handleItemClick = screen => {
    if (screen === 'Assets') {
      setIsAssetsClicked(!isAssetsClicked);
    } else {
      onClose();
      navigation.navigate(screen);
    }
  };
  useEffect(() => {
    (async () => {
      getUserDetails();
    })();
  }, []);

  const generateContent = [
    {
      orderBy: 1,
      key: 'addnewitem',
      value: 'Add New Asset',
      route: 'AddToStore',
      Icon: 'post-add',
    },
    {
      orderBy: 3,
      key: 'addnewitem',
      value: 'Rejected Assets',
      route: 'ModifyAsset',
      Icon: 'change-circle',
    },

    {
      orderBy: 2,
      key: 'additemstore',
      value: 'Approve New Asset',
      route: 'ApproveNewAsset',
      Icon: 'playlist-add-check',
    },
    {
      orderBy: 4,
      key: 'bulkinstall',
      value: 'Allocate',
      route: 'Allocate',
      Icon: 'playlist-add',
    },

    {
      orderBy: 5,
      key: 'uninstallasset',
      value: 'De - Allocate',
      route: 'DAllocate',
      Icon: 'playlist-remove',
    },

    {
      orderBy: 6,
      key: 'Link_Accessories',
      value: 'Link Accessories',
      route: 'Link',
      Icon: 'link',
    },

    {
      orderBy: 7,
      key: 'Dlink_Accessories',
      value: 'DLink Accessories',
      route: 'DLink',
      Icon: 'link-off',
    },
    {
      orderBy: 8,
      key: 'scanning',
      value: 'Scan',
      route: 'Scan',
      Icon: 'qr-code-scanner',
    },
  ];

  const handleLogout = () => {
    clearAsyncStorage();
    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  };
  return (
    <View
      style={[styles.sidebarContainer, {display: isOpen ? 'flex' : 'none'}]}>
      <TouchableOpacity
        onPress={() => handleItemClick('Dashboard')}
        style={[styles.sidebarButton, styles.sidebarButtonLarge]}>
        <Icon
          name="home"
          size={30}
          color="gray"
          style={{marginHorizontal: '5%'}}
        />
        <Text style={styles.sidebarItem}>Dashboard</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleItemClick('MyAssets')}
        style={[styles.sidebarButton, styles.sidebarButtonLarge]}>
        <Icon
          name="web-asset"
          size={30}
          color="gray"
          style={{marginHorizontal: '5%'}}
        />
        <Text style={styles.sidebarItem}>My-Assets</Text>
      </TouchableOpacity>

      {generateContent &&
        generateContent.map(item => (
          <>
            <TouchableOpacity
              onPress={() => handleItemClick(item.route)}
              style={[styles.sidebarButton, styles.sidebarButtonLarge]}>
              <Icon
                name={`${item.Icon}`}
                size={30}
                color="gray"
                style={{marginHorizontal: '5%'}}
              />
              <Text style={styles.sidebarItem}>{item.value}</Text>
            </TouchableOpacity>
          </>
        ))}

      <TouchableOpacity
        onPress={handleLogout}
        style={[styles.sidebarButton, styles.sidebarButtonLarge]}>
        <Icon
          name="logout"
          size={30}
          color="gray"
          style={{marginHorizontal: '5%'}}
        />
        <Text style={styles.sidebarItem}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: '100%',
    height: '25%',
    resizeMode: 'contain',
    alignSelf: 'center',
    marginVertical: '5%',
    marginHorizontal: '10%',
    borderRadius: 10,
  },
  sidebarContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: '#ccc',
  },
  sidebarButton: {
    paddingVertical: '3%',
    paddingHorizontal: '10%',
    backgroundColor: '#ccc',
    flexDirection: 'row',
  },
  sidebarButtonLarge: {
    width: '100%',
  },
  sidebarItem: {
    fontSize: 16,
    color: 'gray',
    paddingVertical: '2%',
    fontWeight: 'bold',
  },
  dropdownContainer: {
    marginTop: '2%',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 2,
    marginBottom: '1%',
  },
  dropdownButton: {
    marginBottom: '1%',
    paddingVertical: '2%',
    paddingHorizontal: '10%',
    flexDirection: 'row',
    width: '100%',
  },
  dropdownButtonLarge: {
    width: '100%',
  },
  dropdownItem: {
    fontSize: 16,
    color: 'gray',
    paddingVertical: '3%',
    fontWeight: 'bold',
  },
});

export default Sidebar;
