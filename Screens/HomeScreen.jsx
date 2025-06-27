import React, { useState, useEffect, useContext } from 'react';
import { Search } from 'lucide-react-native';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Snackbar } from 'react-native-paper';
import { AuthContext } from '../Context/AuthContext';

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  const { logout } = useContext(AuthContext);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const storedProducts = await AsyncStorage.getItem('products');
      setProducts(storedProducts ? JSON.parse(storedProducts) : []);
    } catch (error) {
      showSnackbar('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = msg => {
    setSnackbarMsg(msg);
    setSnackbarVisible(true);
  };

  const deleteProduct = async productName => {
    setLoading(true);
    try {
      const updatedProducts = products.filter(p => p.name !== productName);
      await AsyncStorage.setItem('products', JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
      showSnackbar('Product deleted');
    } catch (error) {
      showSnackbar('Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
          logout();
        },
      },
    ]);
  };

  const renderProductCard = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteProduct(item.name)}
      >
        <Text style={styles.deleteText}>🗑️</Text>
      </TouchableOpacity>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.productImage} />
      )}
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>${item.price}</Text>
    </View>
  );

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search products"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity onPress={() => Alert.alert('Search clicked')}>
          <Search size={24} color="#666" style={styles.searchIcon} />
        </TouchableOpacity>
      </View>

      <Text style={styles.headerTitle}>Hi-Fi Shop & Service</Text>
      <Text style={styles.headerSub}>Audio shop on Russell Ave 57</Text>
      <Text style={styles.headerSub}>
        The shop offers both products and services
      </Text>

      {loading && (
        <ActivityIndicator size="large" style={{ marginVertical: 20 }} />
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Products ({filteredProducts.length})
        </Text>
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProductCard}
        keyExtractor={item => item.name}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          navigation.navigate('AddProduct', { refreshProducts: fetchProducts })
        }
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMsg}
      </Snackbar>
    </View>
  );
}

const CARD_MARGIN = 8;
const CARD_WIDTH = (screenWidth - CARD_MARGIN * 3 - 32) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  searchIcon: {
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSub: {
    fontSize: 14,
    color: '#666',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: CARD_MARGIN,
  },
  card: {
    width: CARD_WIDTH,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  productImage: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 13,
    color: '#777',
  },
  deleteButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: 1,
  },
  deleteText: {
    fontSize: 18,
    color: 'red',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    backgroundColor: '#2196F3',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: {
    color: '#fff',
    fontSize: 32,
    lineHeight: 32,
  },
  logoutButton: {
    alignSelf: 'flex-end',
    padding: 8,
    marginBottom: 10,
    backgroundColor: '#eee',
    borderRadius: 4,
  },
  logoutText: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
