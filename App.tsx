import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import store from './store';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import ProductList, {ProductListNavigationProp} from './screens/ProductsList';
import Cart from './screens/Cart';
import ProductDetail from './screens/ProductDetail';
import SplashScreen from 'react-native-splash-screen';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import PlScreen from './components/topBar';
import {Button, Image, Text, TouchableOpacity} from 'react-native';
import styles from './styles';
import CartIcon from './CartIcon';

const queryClient = new QueryClient();
const Stack = createStackNavigator();
const App = () => {
  // const navigation = useNavigation<ProductListNavigationProp>();
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="ProductList"
              component={ProductList}
              // options={{
              //   headerTitle: () =>
              //     PlScreen({
              //       title: 'Product List',
              //     }),
              // }}
              options={{
                title: 'Product List',
                headerStyle: {backgroundColor: 'blue'},
                headerTintColor: 'red',
                headerTitleAlign: 'left',
                headerRight: () => <CartIcon />,
              }}
            />
            <Stack.Screen name="ProductDetail" component={ProductDetail} />
            <Stack.Screen name="Cart" component={Cart} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </QueryClientProvider>
  );
};

export default App;
