import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet } from 'react-native';

const SplashScreen = () => {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      router.replace('/(drawer)'); 
    }, 3000); // 3 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient 
      colors={['#6366F1', '#fff']} 
      style={styles.container}
      start={{x: 0.5, y: 0}}
      end={{x: 0.5, y: 1}}
    >
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}> 
        <Image source={require('../assets/images/Logo.png')} style={styles.logo} />
      </Animated.View>
    </LinearGradient>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, // Light purple background
    justifyContent: 'center',
    alignItems: 'center',
  }, 
  logo: {
    width:300,
    height:400,
    borderRadius:200,
    // elevation:8,
  },
});
