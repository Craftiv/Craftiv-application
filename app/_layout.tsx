import { useColorScheme } from '@/hooks/useColorScheme';
import { Montserrat_400Regular, Montserrat_700Bold, useFonts as useGoogleFonts } from '@expo-google-fonts/montserrat';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts as useExpoFonts } from 'expo-font';
import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import { DesignProvider } from '../contexts/DesignContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();
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
    <DesignProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" options={{ headerShown: false }} />
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </DesignProvider>
  );
}
