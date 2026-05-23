import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ConfirmacionScreen() {
  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reserva confirmada</Text>
        <Text style={styles.headerSub}>Resumen de tu agendamiento</Text>
      </View>

      <View style={styles.content}>

        {/* Ícono éxito */}
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Text style={styles.successEmoji}>✅</Text>
          </View>
          <Text style={styles.successText}>Tu flete está agendado</Text>
        </View>

        {/* Resumen */}
        <View style={styles.summaryCard}>
          {[
            { label: 'Transportista', value: 'Carlos Ramírez' },
            { label: 'Vehículo', value: 'Camión 3/4' },
            { label: 'Servicio', value: 'Mudanza' },
            { label: 'Fecha', value: 'Mar 17 mayo' },
            { label: 'Hora', value: '12:00 hrs' },
            { label: 'Precio estimado', value: '$25.000/hr' },
          ].map((item, i) => (
            <View key={i} style={[styles.summaryRow, i === 5 && styles.summaryRowLast]}>
              <Text style={styles.summaryLabel}>{item.label}</Text>
              <Text style={[styles.summaryValue, i === 5 && styles.summaryValuePrice]}>
                {item.value}
              </Text>
            </View>
          ))}

          {/* Estado */}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Estado</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>⏳ Pendiente</Text>
            </View>
          </View>
        </View>

        {/* Botones */}
        <TouchableOpacity
          style={styles.btnHome}
          onPress={() => router.push('/(tabs)/')}
        >
          <Text style={styles.btnHomeText}>Volver al inicio</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { backgroundColor: '#0F6E56', padding: 24, paddingTop: 60 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  headerSub: { fontSize: 13, color: '#9FE1CB', marginTop: 4 },
  content: { padding: 16 },
  successContainer: { alignItems: 'center', paddingVertical: 24 },
  successIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#E1F5EE', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  successEmoji: { fontSize: 30 },
  successText: { fontSize: 15, color: '#555' },
  summaryCard: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 0.5, borderColor: '#eee', marginBottom: 20 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0' },
  summaryRowLast: { borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0' },
  summaryLabel: { fontSize: 13, color: '#888' },
  summaryValue: { fontSize: 13, fontWeight: '500', color: '#222' },
  summaryValuePrice: { color: '#0F6E56', fontWeight: '700' },
  statusBadge: { backgroundColor: '#E1F5EE', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 12, color: '#0F6E56', fontWeight: '500' },
  btnHome: { backgroundColor: '#0F6E56', padding: 18, borderRadius: 12, alignItems: 'center' },
  btnHomeText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});