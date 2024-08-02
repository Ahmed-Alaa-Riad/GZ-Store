/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {useNavigation} from '@react-navigation/native';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {useSelector} from 'react-redux';
import {ProductListNavigationProp} from './screens/ProductsList';
import {selectTotalQuantity} from './Slices/cartSlice';
import {RootState} from './store';

const CartIcon = () => {
  const totalQuantity = useSelector((state: RootState) =>
    selectTotalQuantity(state),
  );
  const navigation = useNavigation<ProductListNavigationProp>();

  return (
    <View
      style={{
        width: '100%',
        backgroundColor: 'black',
      }}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Cart')}
        style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          style={{width: 30, height: 30, marginRight: 5}}
          source={require('./src/images/Cart.png')}
        />
      </TouchableOpacity>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={{color: 'red'}}>({totalQuantity})</Text>
      </View>
    </View>
  );
};
export default CartIcon;
