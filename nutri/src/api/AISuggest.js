// Fetch Gemini AI Suggestion
export const fetchAISuggestion = async (bmi, obesityRisk) => {
    try {
        const response = await fetch('http://192.168.0.115:3000/generate-ai-tips', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bmi, obesityRisk }), // Send BMI and Obesity Risk in the request body
        });

        // Return Result in JSON format
        const result = await response.json();
        console.log("Result json", result);
        return result;
    } catch (error) {
        console.error('Error fetching recipes:', error);
    }
};
