import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { responsiveFontSize as rf } from 'react-native-responsive-dimensions';
import { useRoute, useNavigation } from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getUserProfile, addBookmark, removeBookmark, isBookmarked } from '../lib/supabaseUtils';

export default function ExerciseDetailScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { exercise, isBookmarked: initialBookmarked } = route.params;
    const [ user, setUser ] = useState(null);
    const [isBookmarkedState, setIsBookmarkedState] = useState(initialBookmarked || false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const profile = await getUserProfile();
                setUser(profile);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);
    
    useEffect(() => {
        if (!initialBookmarked) {
            checkBookmarkStatus();
        }
    }, []);

    const checkBookmarkStatus = async () => {
        if (user) {
            const bookmarked = await isBookmarked(user.id, exercise.exerciseName, 'exercise');
            setIsBookmarkedState(bookmarked);
        }
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const handleBookmark = async () => {
        if (!user) {
            // Handle case when user is not logged in
            return;
        }

        try {
            if (isBookmarkedState) {
                await removeBookmark(user.id, exercise.exerciseName, 'exercise');
            } else {
                await addBookmark(user.id, exercise.exerciseName, exercise, 'exercise');
            }
            setIsBookmarkedState(!isBookmarkedState);
        } catch (error) {
            console.error('Error toggling bookmark:', error);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" />
            
            {/* Back Button */}
            <TouchableOpacity 
                style={styles.backButton}
                onPress={handleBack}
                activeOpacity={0.7}
            >
                <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>

            {/* Bookmark Button */}
            <TouchableOpacity 
                style={styles.bookmarkButton}
                onPress={handleBookmark}
                activeOpacity={0.7}
            >
                <Ionicons 
                    name={isBookmarkedState ? "bookmark" : "bookmark-outline"} 
                    size={24} 
                    color={isBookmarkedState ? "#29c439" : "#333"} 
                />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.contentContainer}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <FontAwesome5 name={exercise.iconClass} size={40} color="#29c439" />
                    </View>
                    <Text style={styles.title}>{exercise.exerciseName}</Text>
                    <View style={styles.metaContainer}>
                        <View style={styles.metaRow}>
                            <Ionicons name="time-outline" size={20} color="#29c439" />
                            <Text style={styles.metaText}>{exercise.duration}</Text>
                        </View>
                        <View style={styles.metaRow}>
                            <Ionicons name="speedometer-outline" size={20} color="#29c439" />
                            <Text style={styles.metaText}>{exercise.intensity}</Text>
                        </View>
                    </View>
                </View>

                {/* Description */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.description}>{exercise.exerciseDescription}</Text>
                </View>

                {/* Benefits */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Health Benefits</Text>
                    <View style={styles.benefitsContainer}>
                        <Ionicons name="heart-outline" size={20} color="#29c439" />
                        <Text style={styles.benefitsText}>{exercise.exerciseBenefits}</Text>
                    </View>
                </View>

                {/* Instructions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>How to Perform</Text>
                    {exercise.exercisePerform.map((step, index) => (
                        <View key={index} style={styles.stepItem}>
                            <View style={styles.stepNumber}>
                                <Text style={styles.stepText}>{index + 1}</Text>
                            </View>
                            <Text style={styles.stepText}>{step}</Text>
                        </View>
                    ))}
                </View>

                {/* Location */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Where to Do It</Text>
                    <View style={styles.locationContainer}>
                        <Ionicons name="location-outline" size={20} color="#29c439" />
                        <Text style={styles.locationText}>{exercise.location}</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#edffdd",
        paddingTop: 25,
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#f0f9f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    title: {
        fontSize: rf(2.5),
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    metaContainer: {
        marginTop: 10,
        gap: 8,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    metaText: {
        fontSize: rf(1.8),
        color: '#666',
        marginLeft: 10,
    },
    section: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: rf(2),
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    description: {
        fontSize: rf(1.8),
        color: '#666',
        lineHeight: 24,
    },
    benefitsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    benefitsText: {
        fontSize: rf(1.8),
        color: '#666',
        marginLeft: 10,
        flex: 1,
    },
    stepItem: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    stepNumber: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#29c439',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    stepText: {
        flex: 1,
        fontSize: rf(1.8),
        color: '#666',
        lineHeight: 24,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        fontSize: rf(1.8),
        color: '#666',
        marginLeft: 10,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        zIndex: 1,
    },
    bookmarkButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        zIndex: 1,
    },
}); 