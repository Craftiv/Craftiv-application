import { Drawer } from 'expo-router/drawer';
import CustomDrawerContent from '../../components/CustomDrawerContent';

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: '#fff', width: 250 },
      }}
    >
     
      <Drawer.Screen 
        name="(tabs)" 
        options={{ 
          title: 'Home',
          drawerItemStyle: { display: 'none' } // Hide from drawer menu
        }} 
      />
      <Drawer.Screen 
        name="index" 
        options={{ 
          title: 'Sign Up',
          drawerItemStyle: { display: 'none' } // Hide from drawer menu
        }} 
      />
      <Drawer.Screen 
        name="Profile" 
        options={{ 
          title: 'My Profile',
          drawerItemStyle: { display: 'flex' } // Show in drawer menu
        }} 
      />
      <Drawer.Screen 
        name="(auth)/SignUpfill" 
        options={{ 
          title: 'Sign Up Fill',
          drawerItemStyle: { display: 'none' } // Hide from drawer menu
        }} 
      />
      <Drawer.Screen 
        name="(auth)/LogIn" 
        options={{ 
          title: 'Login',
          drawerItemStyle: { display: 'none' } // Hide from drawer menu
        }} 
      />
      <Drawer.Screen 
        name="(auth)/LogIn2" 
        options={{ 
          title: 'Login 2',
          drawerItemStyle: { display: 'none' } // Hide from drawer menu
        }} 
      />
      <Drawer.Screen 
        name="YourStories" 
        options={{ 
          title: 'Your Stories',
          drawerItemStyle: { display: 'none' } // Hide from drawer menu
        }} 
      />
      <Drawer.Screen 
        name="CanvaDesignPage" 
        options={{ 
          title: 'Canva Design',
          drawerItemStyle: { display: 'none' } // Hide from drawer menu
        }} 
      />
    </Drawer>
  );
} 