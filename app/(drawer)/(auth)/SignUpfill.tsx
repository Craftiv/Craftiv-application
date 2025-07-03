import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function EmailAuth() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async () => {
    // 1. Validation
    if (!name || !email || !password) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Invalid email address');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        'Weak Password',
        'Password must be 8+ characters and include a capital letter, number, and special character'
      );
      return;
    }

    // 🔁 Simulated API delay and success
    Alert.alert('Signing up...', 'Please wait');
    setTimeout(() => {
      Alert.alert('Success', 'Account created!');
      router.push('/(drawer)/(tabs)'); // Use push instead of replace
    }, 1500);

    // 2. API Request
    // setLoading(true);
    // try {
    //   const response = await fetch('https://your-backend.com/api/signup', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ name, email, password }),
    //   });

    //   const data = await response.json();

    //   if (response.ok) {
    //     Alert.alert('Success', 'Account created!');
    //     router.replace('/(tabs)');
    //   } else {
    //     Alert.alert('Signup Failed', data.error || 'Something went wrong');
    //   }
    // } catch (err) {
    //   console.error(err);
    //   Alert.alert('Network Error', 'Could not reach the server');
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.wrapper}
      keyboardShouldPersistTaps="handled"
    >
      <View><Image source={require('../../../assets/images/Logo.png')} style={styles.logo} />
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>

        {/* Inputs */}
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholderTextColor="#999"
          accessibilityLabel="Name input"
          textContentType="name"
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholderTextColor="#999"
          keyboardType="email-address"
          accessibilityLabel="Email input"
          textContentType="emailAddress"
        />
        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
            accessibilityLabel="Password input"
            textContentType="password"
          />
          <Pressable
            onPress={() => setShowPassword((prev) => !prev)}
            onPressIn={() => Keyboard.dismiss()}
            hitSlop={10}
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={22}
              color="#999"
              style={{ marginLeft: -35, marginRight: 10 }}
            />
          </Pressable>
        </View>

            <Pressable
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </Pressable>


        <Text style={styles.footerText}>
          Already have an account?{' '}
          <Text style={styles.link} onPress={() => router.push('/(drawer)/(auth)/LogIn2')}>
            Login
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    backgroundColor: '#F4F4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: '#F4F4FF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginTop: -20,
  },
  logo: {
    width: 300,
    height: 100,
    marginTop: -30,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    marginBottom: 15,
    fontSize: 16,
    color: '#000',
  },
  button: {
    width: '100%',
    paddingVertical: 12,
    backgroundColor: '#6366F1',
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Montserrat_700Regular',
  },
  footerText: {
    marginTop: 20,
    fontSize: 13,
    color: '#444',
    fontFamily: 'Montserrat_400Regular',
  },
  link: {
    color: '#6366F1',
    fontWeight: '500',
    fontSize: 18,
    fontFamily: 'Montserrat_700Regular',
  },
});
