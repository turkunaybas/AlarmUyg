import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Button,
  Switch,
  Modal,
  Touchable,
  Platform
} from 'react-native';
import PushNotification from 'react-native-push-notification';
import DateTimePicker from '@react-native-community/datetimepicker';
import BackgroundTimer from 'react-native-background-timer';

export default function App() {
 

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [text, setText] = useState([{hourString: '23:40', active: false}]);
  const [currentDate, setCurrentDate] = useState('');

  const toggleSwitch = index => {
    let copyArray = [...text];
    copyArray[index].active = !copyArray[index].active;
    setText(copyArray);
  };

  //Buradan asagisi onemli bildirim icin
  //Create channel elleme sadece channel idler ayni olsun yoksa gitmez bildirim
  const createChannels = () => {
    PushNotification.createChannel({
      channelId: 'test-channel',
      channelName: 'Test Channel',
    });
  };
  //burasi uygulama acikken gidecek bildirim icin
  const handleNotification = (item, index) => {
    PushNotification.cancelAllLocalNotifications();

    PushNotification.localNotification({
      channelId: 'test-channel', //elleme
      title: 'You clicked on ',
      message: 'You clicked on ',
      bigText: 'You clicked on ',
      color: 'red',
      id: 1,
    });
    //burasi uygulama arka plandayken gidecek bildirim
    PushNotification.localNotificationSchedule({
      channelId: 'test-channel', //elleme
      title: 'Alarm',
      message: 'You clicked on ',
      ongoing: true,
      actions: '["Ertele", "Durdur"]',
      date: new Date(Date.now() + 10 * 1000), // 10 10 saniye demek datetime kafa yoramadim basim agriyor
      allowWhileIdle: true,
    });
  };
  //Buraya kadar

  useEffect(() => {
    let timer = setInterval(() => {
      var hours = new Date().getHours().toString(); //Current Hours
      var min = new Date().getMinutes().toString(); //Current Minutes
      var sec = new Date().getSeconds().toString();
      setCurrentDate(
        `${hours.length > 1 ? hours : '0' + hours} : ${
          min.length > 1 ? min : '0' + min
        }`,
      );

      let activeAlarms = text.filter(item => item.active);

      console.log(sec);
      if (
        activeAlarms.map(item => item.hourString).includes(currentDate) &&
        sec == 1
      ) {
        alert('alarm çalıyo');
        handleNotification();
      }
      console.log(currentDate);
    }, 1000);

    return () => clearInterval(timer);
  });

  //
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date ;
    console.log(selectedDate,"selam")
    setShow(Platform.OS === 'ios');
    setDate(currentDate);

    let tempDate = new Date(currentDate);
    let now = tempDate.getTime();
    console.log(now);
    let fDate =
      tempDate.getDate() +
      '/' +
      (tempDate.getMonth() + 1) +
      '/' +
      tempDate.getFullYear;
    let fTime = `${
      tempDate.getHours().toString().length > 1
        ? tempDate.getHours()
        : '0' + tempDate.getHours()
    } : ${
      tempDate.getMinutes().toString().length > 1
        ? tempDate.getMinutes()
        : '0' + tempDate.getMinutes()
    }`;
    if(selectedDate!==undefined){
      setText([...text, {hourString: fTime, active: false}]);
    }
    
  
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  return (
    <View style={{flex: 1, backgroundColor: '#2e2d2c'}}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: '5%',
          paddingTop: 10,
          borderColor: '#8a8784',
          borderBottomWidth: 2,
        }}>
        <Text style={{fontSize: 20, color: 'orange'}}> ALARMLAR</Text>

        <TouchableOpacity
          onPress={showTimepicker}
          style={{
            width: 40,
            height: 40,
            justifyContent:"center",
            alignItems:"center",
            marginBottom:20
          }}> 
          <Text style={{fontSize:40,color:"orange"}} > + </Text> 
           </TouchableOpacity>


        {/* <TouchableOpacity
          onPress={() => {
            handleNotification();
          }}>
          <Text>asdsadsa</Text>
        </TouchableOpacity> */}
      </View>

      <View style={{flex: 9}}>
        <FlatList
          data={text}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <View
              style={{
                padding: 7,
                paddingVertical: 10,
                minHeight: 70,
                borderColor: '#8a8784',
                borderBottomWidth: 0.6,
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
              }}>

                <View style={{flexDirection:"row",justifyContent:"center",alignItems:"center" }}> 

                <Text style={{color: '#8a8784', fontSize: 30}}>
                {item.hourString}
              </Text>

              <TouchableOpacity style={{}} onPress={()=>
                
                setText(

                  prev => { prev.splice(index, 1);
                    return [...prev] }
                  
                )
                }> 
              <Text style={{marginLeft:2,color:"red",fontSize:20,marginTop:2}}> X </Text>
               </TouchableOpacity>

                   </View>
                   
           

              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={item.active ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => toggleSwitch(index)}
                value={item.active}
              />
             
            </View>
          )}
          ListEmptyComponent={() => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 50,
              }}>
              <Text style={{color: '#bad555'}}> Alarm Yok </Text>
            </View>
          )}
        />

        {/* <Text>{text}</Text>
        <View>
          <Button onPress={showTimepicker} title="Show time picker!" />
        </View> */}

        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={"time"}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
      </View>
    </View>
  );
}
