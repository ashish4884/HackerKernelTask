import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';

export default function AddProductScreen({ navigation, route }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const randomImages = [
    'https://picsum.photos/id/1011/300/300',
    'https://picsum.photos/id/1012/300/300',
    'https://picsum.photos/id/1013/300/300',
    'https://picsum.photos/id/1015/300/300',
    'https://picsum.photos/id/1020/300/300',
  ];

  const pickRandomImage = () => {
    const randomUri =
      randomImages[Math.floor(Math.random() * randomImages.length)];
    setImageUri(randomUri);
  };

  const selectImage = () => {
    launchImageLibrary(
      { mediaType: 'photo', maxWidth: 300, maxHeight: 300 },
      response => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert(
            'Error',
            response.errorMessage || 'Failed to select image',
          );
        } else {
          setImageUri(response.assets[0].uri);
        }
      },
    );
  };

  const addProduct = async () => {
    if (!name.trim() || !price.trim() || isNaN(price) || Number(price) <= 0) {
      Alert.alert(
        'Validation Error',
        'Valid product name and positive price are required.',
      );
      return;
    }
    setLoading(true);

    try {
      const productsStr = await AsyncStorage.getItem('products');
      const products = productsStr ? JSON.parse(productsStr) : [];

      if (
        products.some(p => p.name.toLowerCase() === name.trim().toLowerCase())
      ) {
        Alert.alert(
          'Duplicate Product',
          'Product with this name already exists.',
        );
        setLoading(false);
        return;
      }

      const finalImageUri =
        imageUri ||
        randomImages[Math.floor(Math.random() * randomImages.length)];

      const newProduct = {
        name: name.trim(),
        price: price.trim(),
        image: finalImageUri,
      };
      const updatedProducts = [...products, newProduct];

      await AsyncStorage.setItem('products', JSON.stringify(updatedProducts));
      if (route.params?.refreshProducts) route.params.refreshProducts();
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to add product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Product Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />

      <TouchableOpacity onPress={selectImage} style={styles.imagePicker}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        ) : (
          <Text>Select Product Image (optional)</Text>
        )}
      </TouchableOpacity>

      <View style={styles.buttonRow}>
        <Button title="Pick Image" onPress={selectImage} />
        <View style={{ width: 10 }} />
        <Button title="Use Random Image" onPress={pickRandomImage} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <Button title="Add Product" onPress={addProduct} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 20,
    height: 40,
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: '#ccc',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 6,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
});
