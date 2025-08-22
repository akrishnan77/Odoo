import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import { colors, typography } from '../../theme';
import { Toolbar } from '../../ui/Toolbar';

type Product = {
  id: number;
  name: string;
  qty_available: number;
  default_code?: string;
};


export default function InventoryScreen({ route, navigation }: any) {
  const productId = route?.params?.productId;
  const productName = route?.params?.productName;
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [forecast, setForecast] = useState<{ ds: string; yhat: number }[] | null>(null);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [expandedProductId, setExpandedProductId] = useState<number | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      let prod: Product | undefined;
      // Always match by id first
      if (productId) {
        prod = products.find(p => p.id === productId || p.id === Number(productId));
      }
      // If not found by id, try matching by name
      if (!prod && productName) {
        const compareName = productName.replace(/\s*\[.*?\]/g, '').trim();
        prod = products.find(p => p.name.replace(/\s*\[.*?\]/g, '').trim() === compareName);
      }
      if (prod) {
        setSelectedProduct(prod);
        setQuantity(String(prod.qty_available));
        setExpandedProductId(prod.id); // Expand the card for the preselected product
      } else {
        setSelectedProduct(null);
        setExpandedProductId(null);
      }
    } else {
      setSelectedProduct(null);
      setExpandedProductId(null);
    }
  }, [productId, productName, products]);

  async function fetchForecast(productId: number) {
    setForecastLoading(true);
    try {
      const response = await fetch(`http://10.0.2.2:8000/api/inventory-forecast?product_id=${productId}&periods=30`);
      const data = await response.json();
      setForecast(data.forecast || null);
    } catch (err) {
      setForecast(null);
    }
    setForecastLoading(false);
  }

  async function fetchProducts() {
    setLoading(true);
    try {
      const response = await fetch('http://10.0.2.2:8000/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setMessage('Failed to load products');
    }
    setLoading(false);
  }

  async function updateQuantity() {
    if (!selectedProduct) return;
    setLoading(true);
    try {
      const response = await fetch(`http://10.0.2.2:8000/api/products/${selectedProduct.id}/update-quantity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Number(quantity)),
      });
      const result = await response.json();
      if (result.success) {
        setMessage('Quantity updated successfully');
        setShowUpdateModal(false); // Close popup immediately after update
        fetchProducts();
      } else {
        setMessage('Failed to update quantity');
      }
    } catch (err) {
      setMessage('Error updating quantity');
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <View style={styles.mainContainer}>
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      </View>
    );
  }

  // Do not move selected product to top; just use products as is
  const sortedProducts = products;
  return (
    <View style={styles.mainContainer}>
      <Toolbar title="Inventory" onBack={() => navigation.goBack()} variant="primary" />
      <View style={[styles.rowHeader, { padding: 16, marginTop: 16, marginBottom: 16 }]}> 
        <Text style={[typography.titleStrong, { flex: 1 }]}>Products</Text>
        <TouchableOpacity>
          <Image source={require('../../../assets/images/home/icon_filter.png')} style={styles.iconSmallest} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={sortedProducts}
        renderItem={({ item }) => {
          const isExpanded = expandedProductId === item.id;
          // If selectedProduct is set (from navigation), expand its card and shift focus to input
          const shouldAutoFocus = selectedProduct && selectedProduct.id === item.id;
          return (
            <View style={styles.itemContainer}>
              <View style={styles.rowContainer}>
                <View style={{ flex: 1, flexDirection: 'column', gap: 5 }}>
                  <View style={styles.rowContainer}>
                    <Text style={[typography.subtitle, { flex: 1 }]}>Qty: {item.qty_available}</Text>
                    <View style={[styles.itemContainerWithBg, { marginEnd: 8 }]}> 
                      <Text style={[typography.subtitle]}>{item.default_code || ''}</Text>
                    </View>
                  </View>
                  <Text style={[typography.title, { marginTop: 5 }]}>{item.name}</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('InventoryForecast', { productId: item.id })}>
                  <Image source={require('../../../assets/images/home/icon_arrow.png')} style={styles.iconSmallest} />
                </TouchableOpacity>
              </View>
              {(isExpanded || shouldAutoFocus) && (
                <View style={{ marginTop: 12, marginLeft: 32 }}>
                  <Text style={{ marginBottom: 8 }}>Update Quantity:</Text>
                  <TextInput
                    style={styles.input}
                    value={selectedProduct && selectedProduct.id === item.id ? quantity : String(item.qty_available)}
                    onChangeText={text => {
                      setSelectedProduct(item);
                      setQuantity(text);
                    }}
                    keyboardType="numeric"
                    autoFocus={!!shouldAutoFocus}
                  />
                  <TouchableOpacity
                    onPress={updateQuantity}
                    style={{ backgroundColor: '#5B57C7', borderRadius: 6, padding: 10, marginTop: 8 }}
                    disabled={!quantity}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Update</Text>
                  </TouchableOpacity>
                  {message ? <Text style={{ color: 'red', marginTop: 8 }}>{message}</Text> : null}
                </View>
              )}
              <View style={{ flexDirection: 'row', marginTop: 8 }}>
                <TouchableOpacity onPress={() => {
                  if (expandedProductId === item.id) {
                    setExpandedProductId(null);
                  } else {
                    setExpandedProductId(item.id);
                    setSelectedProduct(item);
                    setQuantity(String(item.qty_available));
                  }
                }}>
                  <Text style={{ color: '#5B57C7', textDecorationLine: 'underline', fontSize: 16 }}>
                    Update Quantity
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyListText}>No products found.</Text>}
      />
  {/* Forecast section removed as requested */}
      {/* Update Quantity Modal */}
      {showUpdateModal && selectedProduct && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 24, width: '80%' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Update Quantity</Text>
            <Text style={{ marginBottom: 8 }}>Product: {selectedProduct.name}</Text>
            <Text style={{ marginBottom: 8 }}>Current Qty: {selectedProduct.qty_available}</Text>
            <TextInput
              style={styles.input}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
            />
            {message ? <Text style={{ color: 'red', marginBottom: 8 }}>{message}</Text> : null}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
              <TouchableOpacity onPress={() => setShowUpdateModal(false)} style={{ padding: 10 }}><Text style={{ color: '#616161' }}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity onPress={updateQuantity} style={{ backgroundColor: '#5B57C7', borderRadius: 6, padding: 10 }} disabled={!quantity}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 0,
    margin: 0,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  itemContainerWithBg: {
    backgroundColor: '#FDF3F4',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  iconSmallest: {
    width: 24,
    height: 24,
  },
  emptyListText: {
    padding: 16,
    textAlign: 'center',
    color: '#616161',
  },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginVertical: 8, width: 100 },
});
