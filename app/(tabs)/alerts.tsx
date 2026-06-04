
import { api } from '@/constants/api';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAlerts = async () => {
    try {
      const response = await api.get('/alerts/');
      setAlerts(response.data);
    } catch (error) {
      console.error('Failed to fetch alerts', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAlerts();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchAlerts();
    // Optional: Poll every 10 seconds
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Alerts</Text>

      <ScrollView
        contentContainerStyle={styles.alertList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
        }
      >
        {alerts.length === 0 ? (
          <Text style={{ color: 'gray', textAlign: 'center', marginTop: 20 }}>No alerts found.</Text>
        ) : (
          alerts.map((alert: any) => (
            <TouchableOpacity key={alert.id} style={styles.alertItem}>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>
                  {alert.weapon_type?.toLowerCase().includes('knife') ? '🔪' :
                    alert.weapon_type?.toLowerCase().includes('gun') ? '🔫' : '🚨'}
                </Text>
              </View>
              <View style={styles.messageContainer}>
                <Text style={styles.message}>{alert.formatted_message}</Text>
                <Text style={styles.time}>{new Date(alert.timestamp).toLocaleString()}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
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
  alertList: {
    paddingBottom: 80,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 15,
    marginBottom: 12,
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  messageContainer: {
    flex: 1,
  },
  message: {
    color: 'white',
    fontSize: 15,
    marginBottom: 4,
  },
  time: {
    color: '#aaa',
    fontSize: 12,
  },
});
