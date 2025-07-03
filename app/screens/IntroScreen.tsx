import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');

export default function IntroScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();
    const timer = setTimeout(() => {
      router.replace('/signup');
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={["#6366F1", "#fff"]}
      style={styles.gradient}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <Animated.View style={[styles.centered, { opacity: fadeAnim }]}> 
        <Image source={require('../../assets/images/crativLogo.png')} style={styles.logo} resizeMode="contain" />
      </Animated.View>
      <Animated.View style={[styles.loginButton, { opacity: fadeAnim }]}> 
        <TouchableOpacity onPress={() => router.replace('/login')}>
          <Text style={styles.loginText}>Already have an account? <Text style={styles.loginLink}>Login</Text></Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    width: width * 0.6,
    height: 90,
    marginBottom: 60,
    marginTop: 60,
    shadowColor: '#222',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  loginButton: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
    shadowColor: '#6366F1',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  loginText: {
    color: '#222',
    fontSize: 16,
  },
  loginLink: {
    color: '#6366F1',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
}); 