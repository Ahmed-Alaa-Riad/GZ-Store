/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {FlatList, Image, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store';
import styles from '../styles';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {productCount, removeFromCart} from '../Slices/cartSlice';
import {useNavigation} from '@react-navigation/native';
import {NavigationProp, Product} from './ProductDetail';

const Cart: React.FC = () => {
  const cartItems = useSelector((State: RootState) => State.cart.cartList);
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp>();
  const renderItem = ({item}: {item: Product}) => {
    return (
      <View style={styles.product}>
        <Text style={styles.title}>{item.title}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('ProductDetail', {product: item})}>
          <Image source={{uri: item.image}} style={styles.image} />
        </TouchableOpacity>
        <Text style={styles.price}>
          Price: {item.price * Number(item.count)} $
        </Text>
        <Text>Count: {item.count}</Text>
        <View style={{flexDirection: 'row', gap: 25}}>
          <TouchableOpacity
            style={styles.miniBtn}
            onPress={() => {
              dispatch(
                productCount({id: item.id, count: Number(item.count) + 1}),
              );
            }}>
            <Text style={styles.miniBtnText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.miniBtn}
            onPress={() => {
              Number(item.count) > 1 &&
                dispatch(
                  productCount({id: item.id, count: Number(item.count) - 1}),
                );
            }}>
            <Text style={styles.miniBtnText}>-</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.removeBtn}
          onPress={() => dispatch(removeFromCart({id: item.id}))}>
          <Text style={styles.btnText}>Remove From Cart</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.btnPL}
        onPress={() => navigation.navigate('ProductList')}>
        <Text style={styles.btnPlText}> All Products </Text>
      </TouchableOpacity>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};
export default Cart;

// export const CartScreenOptions = {
//   headerTitle: () => (
//     <View>
//       <Text style={{color: 'red'}}>ahmed</Text>
//     </View>
//   ),
// };
