import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

type Props = {
    navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
    const startPageId = 'start';

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chào mừng đến với Wiki!</Text>
            <Text style={styles.subtitle}>Sử dụng menu bên trái để điều hướng.</Text>
            <View style={styles.buttonContainer}>
                <Button
                    title={`Xem trang "${startPageId}"`}
                    onPress={() => navigation.navigate('ViewPage', { pageId: startPageId })}
                    color="#FF0000"
                />
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    title="Tìm kiếm trang"
                    onPress={() => navigation.navigate('Search')}
                    color="#FF0000"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666666',
        marginBottom: 40,
        textAlign: 'center',
    },
    buttonContainer: {
        marginVertical: 10,
        width: '80%',
        borderRadius: 8,
        overflow: 'hidden',
    },
});

export default HomeScreen;