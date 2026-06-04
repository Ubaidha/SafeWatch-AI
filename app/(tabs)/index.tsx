
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
export default function App() {
  const router = useRouter();


  return (
    <View style={{ flex: 1, backgroundColor: '#0a0f18ff' }}>
      <Image source={images.bg} style={{ position: "absolute", width: '100%', marginTop: 0 }} />
      <ScrollView style={{ flex: 1, paddingHorizontal: 5 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10, minHeight: "100%" }}>
        <Image source={icons.logo} style={{ width: 250, height: 250, resizeMode: 'contain', alignSelf: 'center', marginTop: 0, marginHorizontal: "auto" }} />
        <ScrollView contentContainerStyle={styles.container}>

          <Text style={styles.welcomeText}>Welcome back

          </Text>
          <Text style={styles.subText}>Monitoring active surveillance...</Text>


          <View style={styles.cardContainer}>
            <View style={styles.card}>
              <Icon name="videocam-outline" size={30} color="#B499FF" />
              <Text style={styles.cardTitle}>Live Cameras</Text>
              <Text style={styles.cardValue}>3 Active</Text>
            </View>

            <View style={styles.card}>
              <Icon name="warning-outline" size={30} color="#FF8C8C" />
              <Text style={styles.cardTitle}>Alerts</Text>
              <Text style={styles.cardValue}>2 New</Text>
            </View>
          </View>

          {/* Device Status */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Device Status</Text>
            <View style={styles.statusRow}>
              <View style={styles.statusItem}>
                <Icon name="wifi-outline" size={22} color="#00FFAB" />
                <Text style={styles.statusText}>Online</Text>
              </View>
              <View style={styles.statusItem}>
                <Icon name="battery-full-outline" size={22} color="#FFD700" />
                <Text style={styles.statusText}>Power Stable</Text>
              </View>
              <View style={styles.statusItem}>
                <Icon name="cloud-outline" size={22} color="#87CEFA" />
                <Text style={styles.statusText}>Cloud Sync</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.actionBtn}>
                <Icon name="notifications-outline" size={24} color="white" />
                <Text style={styles.actionText}>Alerts</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Icon name="camera-outline" size={24} color="white" />
                <Text style={styles.actionText}>View Cam</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Icon name="person-outline" size={24} color="white" />
                <Text style={styles.actionText}>Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#B499FF',
  },
  subText: {
    color: '#aaa',
    marginBottom: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 20,
    width: '48%',
    alignItems: 'center',
  },
  cardTitle: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 8,
  },
  cardValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    color: '#B499FF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 15,
    borderRadius: 14,
  },
  statusItem: {
    alignItems: 'center',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    width: '30%',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 14,
  },
  actionText: {
    color: '#fff',
    marginTop: 6,
    fontSize: 13,
  },
});