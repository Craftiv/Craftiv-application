import { useColorScheme } from '@/hooks/useColorScheme';
import { Montserrat_400Regular, Montserrat_700Bold, useFonts as useGoogleFonts } from '@expo-google-fonts/montserrat';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts as useExpoFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { DesignProvider } from '../contexts/DesignContext';
import 'react-native-reanimated';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Combined font loading
  const [googleFontsLoaded] = useGoogleFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });
  
  const [expoFontsLoaded] = useExpoFonts({
    Transcity: require('../assets/fonts/Transcity-owMAA.otf'),
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const fontsLoaded = googleFontsLoaded && expoFontsLoaded;

  if (!fontsLoaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <DesignProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Combined routes - choose which to keep */}
          <Stack.Screen name="Splash" options={{ headerShown: false }} />
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </DesignProvider>
  );
}