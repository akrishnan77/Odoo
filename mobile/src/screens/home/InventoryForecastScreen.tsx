import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography } from '../../theme';
import { Toolbar } from '../../ui/Toolbar';

type InventoryForecastScreenProps = {
  route: { params: { productId: number; productName?: string } };
  navigation: { goBack: () => void };
};
type ForecastItem = { ds: string; yhat: number };

export default function InventoryForecastScreen({ route, navigation }: InventoryForecastScreenProps) {
  const { productId, productName: routeProductName } = route.params;
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [quantity, setQuantity] = useState('');
  const [productName, setProductName] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [qtyLoading, setQtyLoading] = useState(true);

  useEffect(() => {
    setQtyLoading(true);
    fetch(`http://10.0.2.2:8000/api/products`)
      .then(res => res.json())
      .then(data => {
        let prod;
        if (routeProductName) {
          const compareName = routeProductName.replace(/\s*\[.*?\]/g, '').trim();
          prod = data.find((p: { name: string }) => p.name.replace(/\s*\[.*?\]/g, '').trim() === compareName);
        }
        if (!prod) {
          prod = data.find((p: { id: number }) => p.id === productId);
        }
        setQuantity(prod ? String(prod.qty_available) : '');
        setProductName(prod ? prod.name : '');
        setQtyLoading(false);
      });
    fetch(`http://10.0.2.2:8000/api/inventory-forecast?product_id=${productId}&periods=30`)
      .then(res => res.json())
      .then(data => {
        setForecast(data.forecast || []);
        setLoading(false);
      });
  }, [productId, routeProductName]);

  const updateQuantity = () => {
    setUpdating(true);
    fetch(`http://10.0.2.2:8000/api/products/${productId}/update-quantity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Number(quantity)),
    }).then(() => {
      fetch(`http://10.0.2.2:8000/api/products`)
        .then(res => res.json())
        .then(data => {
          const prod = data.find((p: { id: number; name: string; qty_available: number }) => p.id === productId);
          setQuantity(prod ? String(prod.qty_available) : '');
          setUpdating(false);
        });
    });
  };

  return (
    <View style={styles.mainContainer}>
      <Toolbar title="Inventory Forecast" onBack={() => navigation.goBack()} variant="primary" />
      <View style={styles.contentContainer}>
        <Text style={[typography.titleStrong, { marginBottom: 4 }]}>{productName}</Text>
  {/* Removed quantity update section as requested */}
        <View style={styles.sectionCard}>
          <Text style={[typography.titleStrong, { marginBottom: 8 }]}>Forecast (Next 30 Days)</Text>
          {loading ? (
            <ActivityIndicator size="large" />
          ) : (
            <FlatList
              data={forecast}
              keyExtractor={(item: ForecastItem) => item.ds}
              renderItem={({ item }: { item: ForecastItem }) => (
                <View style={styles.forecastRow}>
                  <Text style={styles.forecastDate}>{item.ds}</Text>
                  <Text style={styles.forecastValue}>{item.yhat.toFixed(2)}</Text>
                </View>
              )}
              ListEmptyComponent={<Text style={styles.emptyListText}>No forecast data available.</Text>}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  contentContainer: {
    padding: 16,
  },
  sectionCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: 8,
    marginBottom: 12,
    borderRadius: 6,
    backgroundColor: colors.surface,
    width: 120,
  },
  updateButton: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 4,
  },
  updateButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  forecastRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  forecastDate: {
    color: '#616161',
    fontSize: 14,
  },
  forecastValue: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyListText: {
    padding: 16,
    textAlign: 'center',
    color: '#616161',
  },
});