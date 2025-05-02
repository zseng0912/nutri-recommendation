import { useState, useEffect } from "react";
import { View, Text, Image, StatusBar, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { responsiveFontSize as rf } from 'react-native-responsive-dimensions';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { updateUserProfile, addProgressEntry } from '../lib/supabaseUtils';

export default function BMIResultScreen({ navigation }) {

  const route = useRoute();
  const { name, bmi, selectedGender, age, eatingHabits, lifestyle, isFirstTimeUser } = route.params || {};
  const [obesityRisk, setObesityRisk] = useState('');

// Set BMI Status Color
  const getBMIStatus =(bmi) => {
    if (bmi < 18.5) {
      return { color: "yellow"};
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      return { color: "lightgreen"};
    } else if (bmi >= 25 && bmi <= 29.9) {
      return { color: "orange"};
    } else {
      return { color: "red"};
    }
  }

  // Set BMI Description
  const getBMIDescription = (bmi) => {
    if (bmi < 18.5) {
      return "Your BMI is below normal. Consider increasing your calorie intake with a balanced diet.";
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      return "Great! Keep maintaining a balanced diet and regular exercise.";
    } else if (bmi >= 25 && bmi <= 29.9) {
      return "Your BMI is slightly above normal. Consider incorporating more exercise and mindful eating.";
    } else {
      return "Your BMI is in the overweight range. It's recommended to consult with a healthcare professional for a personalized plan.";
    }
  };
  
  // Send Data to FastAPI Backend to Predict Obesity Risk
  const sendDataToBackend = async () => {
    try {
      console.log("Sending payload:", {
        age: age,
        gender: selectedGender,
        veggies: eatingHabits.veggies,
        waterIntake: eatingHabits.waterIntake,
        mainMeals: eatingHabits.mainMeals,
        exercise: lifestyle.exercise,
        technologicalDevices: lifestyle.technologicalDevices,
        bmi: bmi
      });
      
      const response = await axios.post('http://192.168.100.16:8000/predict_obesity_risk/', {
        age: age,
        selectedGender: selectedGender,
        bmi: bmi,
        veggies: eatingHabits.veggies,
        waterIntake: eatingHabits.waterIntake,
        mainMeals: eatingHabits.mainMeals,
        exercise: lifestyle.exercise,
        technologicalDevices: lifestyle.technologicalDevices
      });

      console.log("Response from backend:", response.data);
      const riskLevel = response.data.obesity_level;
      setObesityRisk(riskLevel);

      // Save BMI and obesity risk to user profile
      await updateUserProfile({
        bmi: bmi,
        obesity_risk: riskLevel,
        weight: route.params.weight, // Make sure weight is passed from previous screen
        height: route.params.height, // Make sure height is passed from previous screen
        age: age,
        gender: selectedGender
      });

      // Save BMI and obesity risk to user profile
      await addProgressEntry({
        bmi: bmi,
        obesity_risk: riskLevel,
        weight: route.params.weight, // Make sure weight is passed from previous screen
        height: route.params.height, // Make sure height is passed from previous screen
      });
    } catch (error) {
      console.error("Error sending data to backend:", error);
    }
  }
  

  // Call this function when the component mounts
  useEffect(() => {
    sendDataToBackend();
  }, []);


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />

      {/* Header */}
      <View style={styles.headingContainer}>
        {isFirstTimeUser && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="black" />
          </TouchableOpacity>
        )}
        <Text style={[styles.headingText, { marginLeft: isFirstTimeUser ? 80 : 0 }]}>
          BMI RESULTS
        </Text>
        {/* {isFirstTimeUser && (
          <TouchableOpacity onPress={() => navigation.navigate('IntroScreen')} style={{marginLeft:70}}>
            <Ionicons name="home" size={28} color="black" />
          </TouchableOpacity>
        )} */}
      </View>

      {/* BMI Result Card */}
      <View style={styles.resultCard}>
        <Image source={require('../assets/fatIcon.png')} style={styles.image} />
        <Text style={[styles.statusText, { color: getBMIStatus(bmi).color}]}>{obesityRisk}</Text>
        <Text style={styles.bmiValue}>{bmi}</Text>
        <Text style={styles.rangeText}>Normal BMI range: 18.5 - 24.9</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardText}>{name}</Text>
        <Text style={styles.adviceText}>{getBMIDescription(bmi)}</Text>
        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.startButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.startButtonText}>Start Now</Text>
          </TouchableOpacity>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#edffdd'
  },
  headingContainer:{
    marginTop: 70,
    width: '100%',
    padding:20,
    backgroundColor: '#edffdd',
    flexDirection: 'row',  
    alignItems: 'center',  
    justifyContent: 'flex-start',  
  },
  headingText: {
    color: 'black',
    fontWeight: 700,
    fontSize: rf(3),
  },
  resultCard: {
    backgroundColor: '#edffdd',
    width: '90%',
    padding: 20,
    margin:20,
    marginBottom:10,
    marginTop:38,
    borderRadius: 15,
    justifyContent:'center',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 10,
    marginLeft:15,
  },
  statusText: {
    color: 'limegreen',
    fontSize: rf(2.5),
    fontWeight: 'bold',
  },
  bmiValue: {
    color: 'black',
    fontSize: rf(5),
    fontWeight: 'bold',
    marginVertical: 5,
  },
  rangeText: {
    color: 'gray',
    fontSize: rf(2),
  },
  card:{
    backgroundColor: 'white',
    width: '90%',
    padding: 5,
    margin:20,
    marginTop:0,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  cardText: {
    color: 'black',
    fontSize: rf(3.0),
    fontWeight: 'bold',
    marginVertical: 5,
  },
  adviceText: {
    color: 'black',
    fontSize: rf(1.8),
    textAlign: 'center',
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '90%',
    marginTop: 30,
    margin: 20,
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: '#66cd7e',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  startButtonText: {
    color: 'white',
    fontSize: rf(1.8),
    fontWeight: 'bold',
  },
});
