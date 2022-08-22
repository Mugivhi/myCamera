import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView,Image, TouchableOpacity } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { Camera } from 'expo-camera';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
// import { Icon } from 'react-native-vector-icons/Icon';

export default function App() {
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState();

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>
  } else if (!hasCameraPermission) {
    return <Text>Permission for camera not granted. Please change this in settings.</Text>
  }

  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
  };

  if (photo) {
    let sharePic = () => {
      shareAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };

    let savePhoto = () => {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };

    return (
      <SafeAreaView style={styles.container}>
        <Image style={styles.preview} source={{ uri: "data:image/jpg;base64," + photo.base64 }} />
        <TouchableOpacity title="Share" onPress={sharePic}>
          <Text style={styles.texts}>Share</Text>
        </TouchableOpacity>
        {hasMediaLibraryPermission ? <TouchableOpacity title="Save" onPress={savePhoto}>
           <Text style={styles.texts}>Save</Text>
        </TouchableOpacity> : undefined}
        <TouchableOpacity title="Discard" onPress={() => setPhoto(undefined)}>
          <Text style={styles.texts}>Discard</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <Camera style={styles.container} ref={cameraRef}>
      <View style={styles.buttonContainer}>
       <TouchableOpacity title='capture' onPress={takePic}>
        {/* <Icon
        name='add'
        color="#ccc"
        size={25}
        /> */}
       <Text style={styles.texts}>takePic</Text>
       </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </Camera>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'grey'
  },
  buttonContainer: {
    backgroundColor: 'whitesmoke',
    position:'absolute',
    borderRadius:10,
    bottom:1
  },
  preview: {
    alignSelf: 'stretch',
    flex: 1
  },
  texts:{
    fontSize:25,
    backgroundColor:'whitesmoke',
    margin:8,
    borderRadius:10,
    padding:10
  }
});
