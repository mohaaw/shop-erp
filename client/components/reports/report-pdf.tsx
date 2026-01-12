
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#E4E4E4',
        padding: 30,
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    table: {
        display: "flex",
        width: "auto",
        borderStyle: "solid",
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    tableRow: {
        margin: "auto",
        flexDirection: "row",
    },
    tableCol: {
        width: "25%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
    },
    tableCell: {
        margin: "auto",
        marginTop: 5,
        fontSize: 10,
    },
    headerCell: {
        margin: "auto",
        marginTop: 5,
        fontSize: 12,
        fontWeight: 'bold',
    }
});

interface ReportDocumentProps {
    title: string;
    data: any[];
    type: 'sales' | 'inventory';
}

export const ReportDocument = ({ title, data, type }: ReportDocumentProps) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.title}>{title}</Text>
                <Text style={{ fontSize: 12, marginBottom: 10 }}>Generated: {new Date().toLocaleDateString()}</Text>

                {type === 'sales' && (
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}><Text style={styles.headerCell}>Date</Text></View>
                            <View style={styles.tableCol}><Text style={styles.headerCell}>Orders</Text></View>
                            <View style={styles.tableCol}><Text style={styles.headerCell}>Revenue</Text></View>
                        </View>
                        {data.map((row, i) => (
                            <View style={styles.tableRow} key={i}>
                                <View style={styles.tableCol}><Text style={styles.tableCell}>{row.date}</Text></View>
                                <View style={styles.tableCol}><Text style={styles.tableCell}>{row.orders}</Text></View>
                                <View style={styles.tableCol}><Text style={styles.tableCell}>${row.revenue.toFixed(2)}</Text></View>
                            </View>
                        ))}
                    </View>
                )}

                {type === 'inventory' && (
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}><Text style={styles.headerCell}>Category</Text></View>
                            <View style={styles.tableCol}><Text style={styles.headerCell}>Item Count</Text></View>
                            <View style={styles.tableCol}><Text style={styles.headerCell}>Total Value</Text></View>
                        </View>
                        {data.map((row, i) => (
                            <View style={styles.tableRow} key={i}>
                                <View style={styles.tableCol}><Text style={styles.tableCell}>{row.category}</Text></View>
                                <View style={styles.tableCol}><Text style={styles.tableCell}>{row.itemCount}</Text></View>
                                <View style={styles.tableCol}><Text style={styles.tableCell}>${row.value.toFixed(2)}</Text></View>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </Page>
    </Document>
);
