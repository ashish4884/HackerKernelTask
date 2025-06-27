import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './Screens/LoginScreen.jsx';
import HomeScreen from './Screens/HomeScreen.jsx';
import { AuthProvider, AuthContext } from './Context/AuthContext.jsx';
import AddProductScreen from './Screens/AddProductScreen.jsx';

const Stack = createNativeStackNavigator();

const AppNav = () => {
  const { isLogged } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLogged ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="AddProduct" component={AddProductScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => (
  <AuthProvider>
    <AppNav />
  </AuthProvider>
);

export default App;
