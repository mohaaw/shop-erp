import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { OrderWithDetails } from '@/types/order';

// Register fonts (optional, using default Helvetica for now)
// Font.register({ family: 'Roboto', src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf' });

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0F172A',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 12,
        color: '#64748B',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    column: {
        flexDirection: 'column',
    },
    label: {
        fontSize: 10,
        color: '#64748B',
        marginBottom: 2,
    },
    value: {
        fontSize: 12,
        color: '#0F172A',
    },
    table: {
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 4,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#F8FAFC',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        padding: 8,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        padding: 8,
    },
    tableCell: {
        fontSize: 10,
        color: '#334155',
    },
    col1: { width: '40%' },
    col2: { width: '20%', textAlign: 'right' },
    col3: { width: '20%', textAlign: 'right' },
    col4: { width: '20%', textAlign: 'right' },

    footer: {
        marginTop: 30,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 200,
        marginBottom: 5,
    },
    totalLabel: {
        fontSize: 12,
        color: '#64748B',
    },
    totalValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0F172A',
    },
});

interface InvoiceDocumentProps {
    order: OrderWithDetails;
}

export const InvoiceDocument: React.FC<InvoiceDocumentProps> = ({ order }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>INVOICE</Text>
                <Text style={styles.subtitle}>#{order.id}</Text>
            </View>

            {/* Info Row */}
            <View style={styles.row}>
                <View style={styles.column}>
                    <Text style={styles.label}>Bill To:</Text>
                    <Text style={styles.value}>{order.customerName || 'Guest Customer'}</Text>
                    <Text style={styles.value}>{order.customerEmail || 'No Email'}</Text>
                </View>
                <View style={styles.column}>
                    <Text style={styles.label}>Date:</Text>
                    <Text style={styles.value}>{new Date(order.createdAt).toLocaleDateString()}</Text>
                    <Text style={styles.label}>Status:</Text>
                    <Text style={styles.value}>{order.status.toUpperCase()}</Text>
                </View>
            </View>

            {/* Table */}
            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <Text style={[styles.tableCell, styles.col1]}>Item</Text>
                    <Text style={[styles.tableCell, styles.col2]}>Quantity</Text>
                    <Text style={[styles.tableCell, styles.col3]}>Price</Text>
                    <Text style={[styles.tableCell, styles.col4]}>Total</Text>
                </View>
                {order.items.map((item) => (
                    <View key={item.id} style={styles.tableRow}>
                        <Text style={[styles.tableCell, styles.col1]}>{item.productName || 'Product'}</Text>
                        <Text style={[styles.tableCell, styles.col2]}>{item.quantity}</Text>
                        <Text style={[styles.tableCell, styles.col3]}>${item.price.toFixed(2)}</Text>
                        <Text style={[styles.tableCell, styles.col4]}>${(item.quantity * item.price).toFixed(2)}</Text>
                    </View>
                ))}
            </View>

            {/* Footer / Totals */}
            <View style={styles.footer}>
                <View style={styles.column}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total:</Text>
                        <Text style={styles.totalValue}>${order.total.toFixed(2)}</Text>
                    </View>
                </View>
            </View>
        </Page>
    </Document>
);
