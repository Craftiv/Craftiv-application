import { useColorScheme } from '@/hooks/useColorScheme';
import { Montserrat_400Regular, Montserrat_700Bold, useFonts as useGoogleFonts } from '@expo-google-fonts/montserrat';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts as useExpoFonts } from 'expo-font';
import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
// import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { DesignProvider } from '../contexts/DesignContext';
import { ThemeProvider as CustomThemeProvider } from '../contexts/ThemeContext';

function RootStack() {
  const colorScheme = useColorScheme();
  // const { isAuthenticated } = useAuth();
  const [googleFontsLoaded] = useGoogleFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });
  const [expoFontsLoaded] = useExpoFonts({
    Transcity: require('../assets/fonts/Transcity-owMAA.otf'),
  });
  const fontsloaded = googleFontsLoaded && expoFontsLoaded;
  if (!fontsloaded) return null;

  return (
    <CustomThemeProvider>
      <DesignProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          {/*
          // When authentication is ready, restore this logic:
          <Stack screenOptions={{ headerShown: false }} initialRouteName={isAuthenticated ? "(drawer)" : "Splash"}>
            {isAuthenticated ? (
              <>
                <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
              </>
            ) : (
              <>
                <Stack.Screen name="Splash" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)/LogIn" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)/SignUpfill" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)/LogIn2" options={{ headerShown: false }} />
              </>
            )}
          </Stack>
          */}
          {/* Temporary: Allow access to all screens for development */}
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/LogIn" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/SignUpfill" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/LogIn2" options={{ headerShown: false }} />
            <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </DesignProvider>
    </CustomThemeProvider>
  );
}

export default function AppLayout() {
  // return (
  //   <AuthProvider>
  //     <RootStack />
  //   </AuthProvider>
  // );
  return <RootStack />;
}
