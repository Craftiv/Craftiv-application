import { Link, Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>This screen does not exist.</Text>
        <Link href="/" style={styles.link}>
          <Text style={{ color: '#FF2290', textDecorationLine: 'underline' }}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}









const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
