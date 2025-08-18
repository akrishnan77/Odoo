import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Button, StyleSheet } from 'react-native';

type Product = {
  id: number;
  name: string;
  qty_available: number;
  default_code?: string;
};

export default function InventoryScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

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
        fetchProducts();
      } else {
        setMessage('Failed to update quantity');
      }
    } catch (err) {
      setMessage('Error updating quantity');
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory</Text>
      {loading && <Text>Loading...</Text>}
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, selectedProduct?.id === item.id && styles.selectedItem]}
            onPress={() => { setSelectedProduct(item); setQuantity(String(item.qty_available)); }}
          >
            <Text>{item.name} (Qty: {item.qty_available})</Text>
          </TouchableOpacity>
        )}
      />
      {selectedProduct && (
        <View style={styles.updateSection}>
          <Text>Update Quantity for {selectedProduct.name}</Text>
          <TextInput
            style={styles.input}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />
          <Button title="Update" onPress={updateQuantity} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  item: { padding: 12, borderBottomWidth: 1, borderColor: '#ccc' },
  selectedItem: { backgroundColor: '#e0f7fa' },
  updateSection: { marginTop: 24 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginVertical: 8, width: 100 },
  message: { color: 'red', marginVertical: 8 },
});
