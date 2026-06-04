import { api } from '@/constants/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ProfilePage() {
  const { signOut } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Fetch user profile
    console.log('Fetching profile...');
    api.get('/auth/profile/')
      .then(response => {
        console.log('Profile fetched:', response.data);
        setUser(response.data);
      })
      .catch(error => {
        console.error('Failed to fetch profile:', error);
        if (error.response) {
          console.error('Error status:', error.response.status);
          console.error('Error data:', error.response.data);
        }
      });
  }, []);

  const handleLogout = async () => {
    await signOut();
    // Redirect is handled by AuthContext/RootLayout, but we can be explicit if needed
  };

  const menuItems = [
    { id: 1, icon: 'settings-outline', title: 'Settings' },
    { id: 2, icon: 'notifications-outline', title: 'Notifications' },
    { id: 3, icon: 'lock-closed-outline', title: 'Privacy' },
    { id: 4, icon: 'help-circle-outline', title: 'Help & Support' },
    { id: 5, icon: 'information-circle-outline', title: 'About' },
  ];

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
          style={styles.avatar}
        />
        <Text style={styles.userName}>{user?.username || 'Loading...'}</Text>
        <Text style={{ color: '#aaa', marginTop: -5, marginBottom: 10 }}>{user?.email}</Text>

        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Menu List */}
      <ScrollView contentContainerStyle={styles.menuContainer}>
        {menuItems.map(item => (
          <TouchableOpacity key={item.id} style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Icon name={item.icon} size={22} color="white" style={styles.menuIcon} />
              <Text style={styles.menuText}>{item.title}</Text>
            </View>
            <Icon name="chevron-forward-outline" size={20} color="#aaa" />
          </TouchableOpacity>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f18ff',
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 50,
    marginBottom: 10,
    backgroundColor: '#444',
  },
  userName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  editBtn: {
    backgroundColor: '#6C4AB6',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editText: {
    color: 'white',
    fontSize: 14,
  },
  menuContainer: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 10,
  },
  menuText: {
    color: 'white',
    fontSize: 16,
  },
  logoutBtn: {
    backgroundColor: '#2f1e61ff',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
