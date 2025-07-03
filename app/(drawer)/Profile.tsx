import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function Profile() {
  const { setIsAuthenticated, setProfileImage, profileImage } = useAuth();
  const [name, setName] = useState('Mina Torgah');
  const [email, setEmail] = useState('torgahdelamino@gmail.com');
  const [editingField, setEditingField] = useState<'name' | 'email' | null>(null); // 'name' or 'email'
  const [tempValue, setTempValue] = useState('');
  const [logoutPressed, setLogoutPressed] = useState(false);

  const startEdit = (field: 'name' | 'email') => {
    setEditingField(field);
    setTempValue(field === 'name' ? name : email);
  };

  const saveEdit = () => {
    if (editingField === 'name') setName(tempValue);
    if (editingField === 'email') setEmail(tempValue);
    setEditingField(null);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      "You're doing a good job! Are you sure you want to log out?",
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            setIsAuthenticated(false);
            router.replace('/(auth)/LogIn');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Back Button and Title */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#222" />
        </TouchableOpacity>
        <Text style={styles.title}>Your Profile</Text>
      </View>
      {/* Avatar and Edit Photo */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarCircle}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatarImg} />
          ) : (
            <Ionicons name="person" size={40} color="#fff" />
          )}
        </View>
        <TouchableOpacity style={styles.editPhotoBtn} onPress={pickImage}>
          <Text style={styles.editPhotoText}>Edit Photo</Text>
        </TouchableOpacity>
      </View>
      {/* Info Rows */}
      <View style={styles.infoSection}>
        {/* Name Row */}
        <View style={styles.infoRow}>
          <View>
            <Text style={styles.infoLabel}>Name</Text>
            {editingField === 'name' ? (
              <TextInput
                style={styles.infoValue}
                value={tempValue}
                onChangeText={setTempValue}
                onBlur={saveEdit}
                autoFocus
              />
            ) : (
              <Text style={styles.infoValue}>{name}</Text>
            )}
          </View>
          <TouchableOpacity style={styles.editBtn} onPress={() => startEdit('name')}>
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
        {/* Email Row */}
        <View style={styles.infoRow}>
          <View>
            <Text style={styles.infoLabel}>Email address</Text>
            {editingField === 'email' ? (
              <TextInput
                style={styles.infoValue}
                value={tempValue}
                onChangeText={setTempValue}
                onBlur={saveEdit}
                autoFocus
                keyboardType="email-address"
              />
            ) : (
              <Text style={styles.infoValue}>{email}</Text>
            )}
          </View>
          <TouchableOpacity style={styles.editBtn} onPress={() => startEdit('email')}>
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Logout Button at the bottom */}
      <View style={styles.logoutContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.logoutBtn,
            pressed || logoutPressed ? styles.logoutBtnPressed : null,
          ]}
          onPress={handleLogout}
          onPressIn={() => setLogoutPressed(true)}
          onPressOut={() => setLogoutPressed(false)}
        >
          <Ionicons name="log-out-outline" size={18} color={logoutPressed ? '#fff' : '#6366F1'} style={{ marginRight: 6 }} />
          <Text style={[styles.logoutText, logoutPressed ? { color: '#fff' } : {}]}>Logout</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    paddingHorizontal: 0,
    paddingTop: 30,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f3f3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginRight: 36, // to balance the back button
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1e239c',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  avatarImg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    resizeMode: 'cover',
  },
  editPhotoBtn: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 8,
  },
  editPhotoText: {
    color: '#222',
    fontSize: 14,
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 0,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#eee',
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  infoLabel: {
    fontSize: 13,
    color: '#888',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
    minWidth: 180,
  },
  editBtn: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  editBtnText: {
    color: '#222',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 0,
  },
  logoutContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 32,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#6366F1',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 8,
    marginTop: 16,
    minWidth: 120,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutBtnPressed: {
    backgroundColor: '#e53935',
    borderColor: '#e53935',
  },
  logoutText: {
    color: '#6366F1',
    fontWeight: 'bold',
    fontSize: 15,
  },
  profileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    resizeMode: 'cover',
  },
}); 