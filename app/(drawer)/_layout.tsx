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
          drawerItemStyle: { display: 'none' }
        }} 
      />
      <Drawer.Screen 
        name="index" 
        options={{ 
          title: 'Sign Up',
          drawerItemStyle: { display: 'none' }
        }} 
      />
      <Drawer.Screen 
        name="Profile" 
        options={{ 
          title: 'My Profile',
          drawerItemStyle: { display: 'flex' }
        }} 
      />
      <Drawer.Screen 
        name="YourStories" 
        options={{ 
          title: 'Your Stories',
          drawerItemStyle: { display: 'none' }
        }} 
      />
      <Drawer.Screen 
        name="CanvaDesignPage" 
        options={{ 
          title: 'Canva Design',
          drawerItemStyle: { display: 'none' }
        }} 
      />
    </Drawer>
  );
} 