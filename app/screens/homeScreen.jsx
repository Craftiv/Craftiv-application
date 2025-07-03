  // SignUpScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const SignUpScreen = () => {
  return (
    // <View className="bg">
    //   <Text>homeScreen</Text>
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Continue to sign up for free</Text>

      {/* Apple */}
      <TouchableOpacity style={styles.button}>
        <Icon name="apple" size={20} color="#000" style={styles.icon} />
        <Text style={styles.buttonText}>Continue with Apple</Text>
      </TouchableOpacity>

      {/* Google */}
      <TouchableOpacity style={styles.button}>
        <Icon name="google" size={20} color="#DB4437" style={styles.icon} />
        <Text style={styles.buttonText}>Continue with Google</Text>
      </TouchableOpacity>

      {/* Facebook */}
      <TouchableOpacity style={styles.button}>
        <Icon name="facebook" size={20} color="#4267B2" style={styles.icon} />
        <Text style={styles.buttonText}>Continue with Facebook</Text>
      </TouchableOpacity>

      {/* Email */}
      <TouchableOpacity style={styles.button}>
        <Icon name="envelope" size={20} color="#000" style={styles.icon} />
        <Text style={styles.buttonText}>Continue with email</Text>
      </TouchableOpacity>

      <Text style={styles.loginText}>
        Already have an account? <Text style={styles.loginLink}>Login</Text>
      </Text>

      <Text style={styles.termsText}>
        By continuing you agree to Popink's{' '}
        <Text style={styles.linkText}>Terms of Use</Text>. Read our{' '}
        <Text style={styles.linkText}>Privacy Policy</Text>
      </Text>
    </SafeAreaView>
  )  
}  

export default SignUpScreen;

