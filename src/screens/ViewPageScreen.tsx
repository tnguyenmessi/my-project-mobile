import React, { useState, useEffect, useLayoutEffect } from 'react';
import { ScrollView, Text, StyleSheet, useWindowDimensions, Linking, Alert, Image, TouchableOpacity, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import RenderHTML from 'react-native-render-html';
import { getPageHTML } from '../api/dokuWikiApi';
import { RootStackParamList } from '../navigation/types';
import LoadingIndicator from '../components/LoadingIndicator';

type Props = StackScreenProps<RootStackParamList, 'ViewPage'>;

const ViewPageScreen: React.FC<Props> = ({ route, navigation }) => {
    const { pageId } = route.params;
    const [htmlContent, setHtmlContent] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { width } = useWindowDimensions();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: pageId,
            headerStyle: {
                backgroundColor: '#FF0000',
            },
            headerTintColor: '#FFFFFF',
        });
    }, [navigation, pageId]);

    useEffect(() => {
        const fetchPage = async () => {
            setLoading(true);
            setError(null);
            try {
                const html = await getPageHTML(pageId);
                setHtmlContent(html);
            } catch (err) {
                setError(`Không thể tải trang: ${pageId}.`);
                console.error(err);
                setHtmlContent(`<p><b>Lỗi: Không thể tải trang.</b></p>`);
            } finally {
                setLoading(false);
            }
        };

        fetchPage();
    }, [pageId]);

    if (loading) {
        return <LoadingIndicator />;
    }

    const tagsStyles = {
        body: {
            color: '#000000',
            fontSize: 16,
            lineHeight: 24,
        },
        a: {
            color: '#FF0000',
            textDecorationLine: "none" as "none",
        },
        h1: {
            color: '#000000',
            borderBottomWidth: 1,
            borderBottomColor: '#E5E5EA',
            paddingBottom: 5,
            marginTop: 20,
            marginBottom: 10,
        },
        h2: {
            color: '#000000',
            borderBottomWidth: 1,
            borderBottomColor: '#E5E5EA',
            paddingBottom: 5,
            marginTop: 18,
            marginBottom: 9,
        },
        h3: {
            color: '#000000',
            marginTop: 16,
            marginBottom: 8,
        },
        pre: {
            backgroundColor: '#F0F0F0',
            color: '#000000',
            padding: 10,
            borderRadius: 5,
            fontSize: 14,
        },
        code: {
            backgroundColor: '#F0F0F0',
            color: '#000000',
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 3,
        },
        blockquote: {
            borderLeftWidth: 3,
            borderLeftColor: '#666666',
            paddingLeft: 10,
            marginLeft: 5,
            color: '#666666',
            fontStyle: "italic" as "italic",
        },
        li: {
            marginBottom: 8,
        },
    };

    const handleLinkPress = (event: any, href: string): void => {
        console.log('Link pressed:', href);
        const match = href.match(/id=([^&]+)/);
        if (match && match[1]) {
            const linkPageId = match[1];
            console.log('Navigating to internal page:', linkPageId);
            navigation.push('ViewPage', { pageId: linkPageId });
        } else {
            Linking.canOpenURL(href).then(supported => {
                if (supported) {
                    Linking.openURL(href);
                } else {
                    Alert.alert("Lỗi", `Không thể mở link: ${href}`);
                }
            });
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                {error && <Text style={styles.errorText}>{error}</Text>}
                {htmlContent ? (
                    <RenderHTML
                        contentWidth={width - 40}
                        source={{ html: htmlContent }}
                        tagsStyles={tagsStyles}
                        renderersProps={{
                            a: {
                                onPress: handleLinkPress,
                            },
                        }}
                    />
                ) : (
                    !loading && <Text style={styles.errorText}>Không có nội dung để hiển thị.</Text>
                )}
            </ScrollView>
            <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('EditPage', { pageId })}
            >
                <Text style={styles.editButtonText}>Sửa</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    contentContainer: {
        padding: 20,
    },
    image: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginBottom: 20,
    },
    errorText: {
        color: '#FF0000',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    editButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#FF0000',
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    editButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ViewPageScreen;