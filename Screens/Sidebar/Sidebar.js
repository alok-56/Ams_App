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
    console.log(formatedData, 'fornmatedData');
    if (formatedData) {
      setUserData(formatedData?.data[0]?.access),
        filterSibarContents(formatedData?.data[0]?.access);
    }
  };
  const [isAssetsClicked, setIsAssetsClicked] = useState(false);
  const [content, setContent] = useState([]);

  const {params: {userId} = {}} = route || {};
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

  //   const filterSibarContents = (userDetail) => {
  // console.log(typeof userDetail,"udddd")
  //     if (userDetail) {

  //       const modules = userDetail.split(',');
  //       console.log(modules, "modu")

  //       modules.map(i => {
  //         if (i === 'addnewitem') {
  //           setContent([ ...content,{orderBy:0, key: 'dashboard', value: 'Dashboard', route: 'Dashboard' , Icon:'home'},
  //           {orderBy:1, key: 'addnewitem', value: 'Add New Asset', route: 'AddToStore' , Icon:'menu'},
  //            {orderBy:3, key: 'addnewitem', value: 'Rejected Assets', route: 'ModifyAsset' , Icon:'change-circle'},
  //            {orderBy:4, key: 'myAsset', value: 'My Asset', route: 'MyAssets', Icon:'web-asset' },
  //             {orderBy:11, key: 'logout', value: 'Logout', route: 'logout' , Icon:'logout'},
  //         ])
  //     } else if (i === 'additemstore') {
  //       setContent((prev) => [
  //         ...prev,
  //         { orderBy: 2, key: 'additemstore', value: 'Approve New Asset', route: 'ApproveNewAsset', Icon: 'add-card' }
  //       ]);
  //     } else if (i ==='scanning' ){
  //       setContent((prev) => [
  //         ...prev,
  //         { orderBy: 5, key: 'scanning', value: 'Scan', route: 'Scan', Icon: 'menu' }
  //       ]);    }else if (i ==='bulkinstall' ){

  //       setContent([ ...content,{orderBy:6, key: 'assets', value: 'Assets', route: true , Icon:'arrow-drop-down'},
  //       {orderBy:7, key: 'bulkinstall', value: 'Allocate', route: 'Allocate', Icon:'menu' }])
  //     }else if (i ==='uninstallasset' ){
  //       setContent([ ...content,{orderBy:8, key: 'uninstallasset', value: 'De - Allocate', route: 'DAllocate', Icon:'pin' }])
  //     }else if (i ==='Link_Accessories' ){
  //       setContent([ ...content,{orderBy:9, key: 'Link_Accessories', value: 'Link Accessories', route: 'Link', Icon:'link' }])
  //     }else if (i ==='Dlink_Accessories' ){
  //       setContent([ ...content,{orderBy:10, key: 'Dlink_Accessories', value: 'DLink Accessories', route: 'DLink', Icon:'link-off' }])
  //     }else{

  //     }

  //   })
  // }else{
  //   console.log('super admin')
  //   setContent([

  //     {orderBy:1, key: 'addnewitem', value: 'Add New Asset', route: 'AddToStore' , Icon:'menu'},
  //     {orderBy:3, key: 'addnewitem', value: 'Rejected Assets', route: 'ModifyAsset' , Icon:'change-circle'},
  //     {orderBy:4, key: 'myAsset', value: 'My Asset', route: 'MyAssets' , Icon:'web-asset'},
  //     {orderBy:2, key: 'additemstore', value: 'Approve New Asset', route: 'ApproveNewAsset' , Icon:'add-card'},
  //     {orderBy:5, key: 'scanning', value: 'Scan', route: 'Scan' , Icon:'menu' },
  //     {orderBy:6, key: 'assets', value: 'Assets', route: true , Icon:'arrow-drop-down'},
  //     {orderBy:7, key: 'bulkinstall', value: 'Allocate', route: 'Allocate' , Icon:'menu'},
  //     {orderBy:8, key: 'uninstallasset', value: 'De - Allocate', route: 'DAllocate' , Icon:'link'},
  //     {orderBy:9, key: 'Link_Accessories', value: 'Link Accessories', route: 'Link' , Icon:'link'},
  //     {orderBy:10, key: 'Dlink_Accessories', value: 'DLink Accessories', route: 'DLink' , Icon:'link-off'},
  //     {orderBy:11, key: 'logout', value: 'Logout', route: 'logout' , Icon:'logout'},
  //     {orderBy:0, key: 'dashboard', value: 'Dashboard', route: 'Dashboard', Icon:'home' }

  //   ])
  // }
  // }

  const filterSibarContents = userDetail => {
    const modules = userDetail.split(',');
    console.log(modules, 'modu');
    const updatedContent = generateContent(modules);
    setContent(updatedContent);
  };

  const generateContent = modules => {
    const moduleConfig = {
      addnewitem: [
       
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
       
       
      ],
      additemstore: [
        
        {
          orderBy: 2,
          key: 'additemstore',
          value: 'Approve New Asset',
          route: 'ApproveNewAsset',
          Icon: 'playlist-add-check',
        },
        
      ],
      scanning: [
        {
          orderBy: 8,
          key: 'scanning',
          value: 'Scan',
          route: 'Scan',
          Icon: 'qr-code-scanner',
        },
        
      ],
      bulkinstall: [
        {
          orderBy: 4,
          key: 'bulkinstall',
          value: 'Allocate',
          route: 'Allocate',
          Icon: 'playlist-add',
        },
        
      ],
      uninstallasset: [
        {
          orderBy: 5,
          key: 'uninstallasset',
          value: 'De - Allocate',
          route: 'DAllocate',
          Icon: 'playlist-remove',
        },
      
      ],
      Link_Accessories: [
        {
          orderBy: 6,
          key: 'Link_Accessories',
          value: 'Link Accessories',
          route: 'Link',
          Icon: 'link',
        },
        
      ],
      Dlink_Accessories: [
        {
          orderBy: 7,
          key: 'Dlink_Accessories',
          value: 'DLink Accessories',
          route: 'DLink',
          Icon: 'link-off',
        },
       
      ],
    };

    let content = [];
    console.log(
      modules.some(module => module.trim() === ''),
      'sdfadfsdfvsdfv',
    );
    if (modules.some(module => module.trim() === '')) {
      // Display all data if modules is empty
      Object.values(moduleConfig).forEach(moduleArray => {
        content = [...content, ...moduleArray];
      });
    } else {
      modules.forEach(module => {
        if (moduleConfig[module]) {
          content = [...content, ...moduleConfig[module]];
        }
      });
    }

    return content;
  };

  // const handleOutforDelivery = () => {
  // handleItemClick('OutForDelivery')
  // }
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
      {console.log(userData, 'usdddd')}

      {console.log(content, 'contents')}
    
      <TouchableOpacity
        onPress={()=>handleItemClick('Dashboard')}
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
        onPress={()=>handleItemClick('MyAssets')}
        style={[styles.sidebarButton, styles.sidebarButtonLarge]}>
        <Icon
          name="web-asset"
          size={30}
          color="gray"
          style={{marginHorizontal: '5%'}}
        />
        <Text style={styles.sidebarItem}>My-Assets</Text>
      </TouchableOpacity>
      
      {content
        .sort((a, b) => a.orderBy - b.orderBy)
        .map(item => {
          let iconComponent;
          console.log(item.key, 'keyeyeyey');
          switch (item.key) {
           
            default:
              return (<>
                <TouchableOpacity
                  onPress={() => handleItemClick(item.route, {userId})}
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
              );
              break;
          }
        })}
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
