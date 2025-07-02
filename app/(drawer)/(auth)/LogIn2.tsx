import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Google from 'expo-auth-session/providers/google';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

WebBrowser.maybeCompleteAuthSession();
const navigation=useNavigation;

type UserInfo = {
  name: string;
  email: string;
};


export default function LogIn2() {


const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: 'web 678627646589-bkkoetvbd02oglu9noc7h2m1ej1cu9dv.apps.googleusercontent.com', // Replace this with your actual client ID
    responseType: 'id_token',
    scopes: ['openid', 'profile', 'email'],
  });
   const handleGoogleSignIn = async () => {
    const result = await promptAsync();

    if (result.type === 'success' && result.params?.id_token) {
      try {
        const decoded: UserInfo = jwtDecode(result.params.id_token);
        setUserInfo(decoded);
        setErrorMsg(null);
      } catch (err) {
        console.error('Token decode error:', err);
        setErrorMsg('Failed to decode token');
      }
    } else if (result.type === 'error') {
      setErrorMsg('Authentication failed');
    }
  };



  return (
    <View style={styles.container}>
      <View style={{display: 'flex' , flexDirection: 'row' , top:30}}>
        <TouchableOpacity onPress={()=> router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Continue to sign up for free</Text>
        
      </View>
      

      <TouchableOpacity style={styles.button} onPress={()=> Alert.alert("Comming soon", "apple sig-in is coming soon")}>
        <AntDesign name="apple1" size={24} color="black" />
        <Text style={styles.buttonText}>Continue with Apple</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleGoogleSignIn}>
  <Image
    source={require('../../../assets/images/google.png')} // place the image in your assets folder
    style={{ width: 28, height: 28, marginRight: 8 }}
  />
  <Text style={styles.buttonText}>Continue with Google</Text>
</TouchableOpacity>

      

      {userInfo && (
        <Text style={{ marginTop: 20 }}>
          Welcome, {userInfo.name} ({userInfo.email})
        </Text>
      )}

      {errorMsg && <Text style={{ color: 'red' }}>{errorMsg}</Text>}
   
  

      

      <TouchableOpacity style={styles.button} onPress={()=> Alert.alert("Coming soon", "Facebook sign-in is coming soon")}>
        <FontAwesome name="facebook" size={24} color="#1877F2" />
        <Text style={styles.buttonText}>Continue with Facebook</Text>
      </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={() => router.push('/(drawer)/(auth)/LogIn')}>
        <Ionicons name="mail-outline" size={24} color="black" />
        <Text style={styles.buttonText}>Continue with email</Text>
      </TouchableOpacity>

      

      <Text style={styles.terms}>
        By continuing you agree to Popink's <Text style={styles.link}>Terms of Use</Text>. Read our{" "}
        <Text style={styles.link}>Privacy Policy</Text>
      </Text>
    </View>

    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    paddingTop: 50,
    
  },
  title: {
    fontSize: 18,
    marginBottom: 30,
    fontWeight: 'bold',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    borderRadius: 8,
    marginVertical: 8,
    justifyContent: 'flex-start',
   gap: '10%',
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 16,
  },
  loginText: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 14,
  },
  link: {
    color: 'hotpink',
  },
  terms: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 15,
    color: '#555',
  },
});
