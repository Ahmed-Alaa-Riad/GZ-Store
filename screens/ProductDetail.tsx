import {RouteProp, useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef} from 'react';
import {View, Text, Image, ScrollView, TouchableOpacity} from 'react-native';
import styles from '../styles';
import {addToCart, selectTotalQuantity} from '../Slices/cartSlice';
import {useDispatch, useSelector} from 'react-redux';
import {StackNavigationProp} from '@react-navigation/stack';
import axios from 'axios';
import {RootState} from '../store';
import {useQuery} from '@tanstack/react-query';

export interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  description: string;
  count?: number;
  quantity?: number;
  category: string;
}

export type RootStackParamList = {
  ProductDetail: {product: Product};
  ProductList: undefined;
  Cart: undefined;
};

export type ProductDetailRouteProp = RouteProp<
  RootStackParamList,
  'ProductDetail'
>;
export type NavigationProp = StackNavigationProp<
  RootStackParamList,
  'ProductDetail'
>;

interface Props {
  route: ProductDetailRouteProp;
}
const itemsInCategory = (catName: string) => {
  return axios.get(`https://fakestoreapi.com/products/category/${catName}`);
};
const ProductDetail: React.FC<Props> = ({route}) => {
  const {product} = route.params;
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();
  const totalQuantity = useSelector((state: RootState) =>
    selectTotalQuantity(state),
  );
  const addProductToCart = (item: Product) => {
    dispatch(addToCart(item));
  };
  const scrollViewRef = useRef<ScrollView>(null);

  const {data, error, isLoading} = useQuery({
    queryKey: ['product', product.category],
    queryFn: () => itemsInCategory(product.category).then(res => res.data),
  });
  useEffect(() => {
    scrollViewRef.current?.scrollTo({x: 0, y: 0, animated: true});
  }, [product]);
  if (isLoading) {
    return (
      <View>
        <Text style={{color: 'black', fontWeight: 'bold', fontSize: 20}}>
          Loading...
        </Text>
      </View>
    );
  }
  if (error) {
    return (
      <View>
        <Text style={{color: 'black', fontWeight: 'bold', fontSize: 20}}>
          Error: {error.message}
        </Text>
      </View>
    );
  }
  return (
    <ScrollView ref={scrollViewRef}>
      <View style={styles.product}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('ProductList')}>
          <Text style={styles.btnText}> All Products </Text>
        </TouchableOpacity>
        <View style={styles.imgContainer}>
          <Image source={{uri: product.image}} style={styles.image} />
        </View>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.title}>Description: {product.description}</Text>
        <Text style={styles.price}>Price: {product.price} $</Text>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => addProductToCart(product)}>
          <Text style={styles.btnText}>Add To Cart</Text>
        </TouchableOpacity>
      </View>
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
      <Text style={styles.header}>Related Products </Text>
      <View style={styles.relatedContainer}>
        {data
          .filter((item: Product) => item.id !== product.id)
          .map((item: Product) => (
            <TouchableOpacity
              key={item.id}
              style={styles.imgContainer}
              onPress={() =>
                navigation.navigate('ProductDetail', {product: item})
              }>
              <Image source={{uri: item.image}} style={styles.image} />
              <Text style={{color: '#343a40'}}>Price: {item.price}</Text>
            </TouchableOpacity>
          ))}
      </View>
    </ScrollView>
  );
};

export default ProductDetail;
