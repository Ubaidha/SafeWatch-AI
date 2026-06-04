import { api } from '@/constants/api';
import { useAuth } from '@/context/AuthContext';
import { ResizeMode, Video } from 'expo-av';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');

export default function CCTVPage() {
  const [cameras, setCameras] = useState<any[]>([]);
  const { userToken } = useAuth();

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [cameraName, setCameraName] = useState('');
  const [cameraUrl, setCameraUrl] = useState('');
  const [cameraType, setCameraType] = useState('RTSP'); // Default to RTSP
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCameras = async () => {
    try {
      const response = await api.get('/cameras/');
      setCameras(response.data);
    } catch (error) {
      console.error('Failed to fetch cameras', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCameras();
    }, [])
  );

  const handleAddCamera = async () => {
    if (!cameraName || !cameraUrl) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/cameras/', {
        name: cameraName,
        source_url: cameraUrl,
        camera_type: cameraType
      });
      setModalVisible(false);
      setCameraName('');
      setCameraUrl('');
      setCameraType('RTSP'); // Reset to default
      fetchCameras(); // Refresh list
      Alert.alert('Success', 'Camera added successfully');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to add camera');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCamera = (camera: any) => {
    // RTSP streams are converted to MJPEG and served via HTTP
    if (camera.camera_type === 'RTSP') {
      const feedUrl = `${api.defaults.baseURL}/feed/${camera.id}/?token=${userToken}`;
      return (
        <View key={camera.id} style={styles.cameraContainer}>
          <View style={styles.videoWrapper}>
            <WebView
              source={{ uri: feedUrl }}
              style={{ flex: 1 }}
              scrollEnabled={false}
              onError={(e) => console.log('WebView Error', e.nativeEvent)}
              nestedScrollEnabled
            />
          </View>
          <View style={styles.cameraLabel}>
            <Text style={styles.cameraName}>{camera.name}</Text>
            <View style={[styles.statusDot, { backgroundColor: '#0f0' }]} />
          </View>
        </View>
      );
    }

    // HLS streams
    if (camera.camera_type === 'HLS') {
      return (
        <View key={camera.id} style={styles.cameraContainer}>
          <Video
            style={styles.videoWrapper}
            source={{ uri: camera.source_url }}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping
            shouldPlay
          />
          <View style={styles.cameraLabel}>
            <Text style={styles.cameraName}>{camera.name}</Text>
            <View style={[styles.statusDot, { backgroundColor: '#0f0' }]} />
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Live Feed</Text>

      <ScrollView contentContainerStyle={styles.grid}>
        {cameras.length === 0 ? (
          <Text style={{ color: 'gray', textAlign: 'center', marginTop: 20 }}>No cameras added yet.</Text>
        ) : (
          cameras.map(camera => renderCamera(camera))
        )}

        {/* Add Camera Button */}
        <TouchableOpacity style={styles.addCameraBtn} onPress={() => setModalVisible(true)}>
          <Icon name="add-circle-outline" size={40} color="#6C4AB6" />
          <Text style={styles.addText}>Add Camera</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Add Camera Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Camera</Text>

            <TextInput
              style={styles.input}
              placeholder="Camera Name (e.g., Front Door)"
              placeholderTextColor="#aaa"
              value={cameraName}
              onChangeText={setCameraName}
            />

            <TextInput
              style={styles.input}
              placeholder="RTSP/HLS URL"
              placeholderTextColor="#aaa"
              value={cameraUrl}
              onChangeText={setCameraUrl}
              autoCapitalize="none"
            />

            {/* Camera Type Selector */}
            <View style={styles.typeContainer}>
              <Text style={styles.typeLabel}>Type:</Text>
              <TouchableOpacity
                style={[styles.typeBtn, cameraType === 'RTSP' && styles.typeBtnActive]}
                onPress={() => setCameraType('RTSP')}
              >
                <Text style={[styles.typeBtnText, cameraType === 'RTSP' && styles.typeBtnTextActive]}>RTSP</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeBtn, cameraType === 'HLS' && styles.typeBtnActive]}
                onPress={() => setCameraType('HLS')}
              >
                <Text style={[styles.typeBtnText, cameraType === 'HLS' && styles.typeBtnTextActive]}>HLS</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveBtn} onPress={handleAddCamera} disabled={isSubmitting}>
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnText}>Save Camera</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f18ff',
    paddingTop: 40,
    paddingHorizontal: 10,
  },
  heading: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  grid: {
    paddingBottom: 80,
    alignItems: 'center',
  },
  cameraContainer: {
    width: width - 30,
    height: 220,
    backgroundColor: '#1e1e2eff',
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  videoWrapper: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  cameraName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  addCameraBtn: {
    width: width - 30,
    height: 100,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#6C4AB6',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(108, 74, 182, 0.1)',
  },
  addText: {
    color: '#6C4AB6',
    marginTop: 5,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#1e1e2eff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  modalTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#0a0f18ff',
    color: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  typeLabel: {
    color: 'white',
    fontSize: 16,
    marginRight: 10,
  },
  typeBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6C4AB6',
    alignItems: 'center',
  },
  typeBtnActive: {
    backgroundColor: '#6C4AB6',
  },
  typeBtnText: {
    color: '#6C4AB6',
    fontWeight: 'bold',
  },
  typeBtnTextActive: {
    color: 'white',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#6C4AB6',
    padding: 15,
    borderRadius: 10,
    marginLeft: 10,
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
  }
});
