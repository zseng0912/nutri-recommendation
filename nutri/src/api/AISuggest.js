/**
 * Fetches personalized nutrition and exercise recommendations from Gemini AI
 * @param {number} bmi - User's Body Mass Index
 * @param {string} obesityRisk - User's obesity risk level
 * @returns {Promise<Object>} JSON response containing recipes and exercises
 */
export const fetchAISuggestion = async (bmi, obesityRisk) => {
    try {
        // Make POST request to local Gemini AI server
        const response = await fetch('http://192.168.0.115:3000/generate-ai-tips', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bmi, obesityRisk }), // Send BMI and Obesity Risk in the request body
        });

        // Parse and Return Result in JSON format
        const result = await response.json();
        console.log("Result json", result);
        return result;
    } catch (error) {
        // Log any errors that occur during the API call
        console.error('Error fetching recipes:', error);
    }
};
