import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SignUp() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Craftiv</Text>
      <Text style={styles.title}>Sign Up</Text>
      <View style={styles.inputCard}>
        <TouchableOpacity style={styles.buttonOutline}>
          <FontAwesome name="apple" size={22} color="#222" style={styles.icon} />
          <Text style={styles.buttonTextBlack}>Continue with Apple</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonOutline}>
          <FontAwesome name="google" size={22} color="#EA4335" style={styles.icon} />
          <Text style={styles.buttonTextBlack}>Continue with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonOutline}>
          <FontAwesome name="facebook" size={22} color="#1877F3" style={styles.icon} />
          <Text style={styles.buttonTextBlack}>Continue with Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/signup/email')}>
          <MaterialIcons name="email" size={22} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Continue with Email</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.loginText}>Already have an account? <Text style={styles.loginLink}>Login</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6ff',
    alignItems: 'center',
    paddingTop: 64,
    paddingHorizontal: 16,
  },
  logo: {
    color: '#6366F1',
    fontSize: 32,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 32,
    marginLeft: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 32,
    alignSelf: 'center',
    color: '#222',
  },
  inputCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#6366F1',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
  },
  buttonOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  buttonTextBlack: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
  },
  loginText: {
    fontSize: 14,
    color: '#222',
    marginBottom: 18,
    textAlign: 'center',
  },
  loginLink: {
    color: '#6366F1',
    fontWeight: '700',
  },
}); 