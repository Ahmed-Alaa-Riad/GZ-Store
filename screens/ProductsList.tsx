/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {useEffect, useState} from 'react';
import axios from 'axios';
import {View, Text, Image, FlatList, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import styles from '../styles';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../store';
import {
  addToCart,
  deleteFromCart,
  emptyCart,
  selectTotalQuantity,
} from '../Slices/cartSlice';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  count: number;
  description: string;
  category: string;
}
type RootStackParamList = {
  ProductList: [];
  ProductDetail: {product: Product};
  Cart: undefined;
};

export type ProductListNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ProductList',
  'Cart'
>;
const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState([]);
  const navigation = useNavigation<ProductListNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const totalQuantity = useSelector((state: RootState) =>
    selectTotalQuantity(state),
  );
  const fetchData = async () => {
    const fetchedData = await axios.get('https://fakestoreapi.com/products');
    setProducts(fetchedData.data);
  };
  const getCategory = async () => {
    const categoryName = await axios.get(
      'https://fakestoreapi.com/products/categories',
    );
    setCategories(categoryName.data);
  };
  const productsInCategory = async (catName: string) => {
    const categoreyname = await axios.get(
      `https://fakestoreapi.com/products/category/${catName}`,
    );
    setProducts(categoreyname.data);
  };
  useEffect(() => {
    fetchData();
    getCategory();
  }, []);
  const addProductToCart = (item: Product) => {
    dispatch(addToCart(item));
  };
  const renderItem = ({item}: {item: Product}) => (
    <View style={styles.product}>
      <Text style={styles.title}>{item.title}</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('ProductDetail', {product: item})}
        style={styles.imgContainer}>
        <Image source={{uri: item.image}} style={styles.image} />
      </TouchableOpacity>
      <Text style={styles.price}>Price: {item.price} $</Text>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => addProductToCart(item)}>
        <Text style={styles.btnText}>Add To Cart</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => dispatch(deleteFromCart({id: item.id}))}>
        <Text style={styles.btnText}>Remove From Cart</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Cart')}
          style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require('../src/images/Cart.png')}
          />
          <Text style={styles.logoText}>My Cart ({totalQuantity})</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.catContainer}>
        <View>
          <TouchableOpacity style={styles.catBtn} onPress={() => fetchData()}>
            <Text style={styles.catBtnText}>All</Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', gap: 5}}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={styles.catBtn}
              onPress={() => productsInCategory(cat)}>
              <Text style={styles.catBtnText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => dispatch(emptyCart())}>
        <Text style={styles.btnText}>Remove All From Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProductList;
