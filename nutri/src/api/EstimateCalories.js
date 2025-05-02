// Fetch Gemini AI Calorie Estimation
export const estimateCalories = async (base64Image) => {
    try {
        const response = await fetch('http://192.168.100.16:3000/estimate-calories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ base64Image }),
        });

        if (!response.ok) {
            throw new Error('Failed to analyze image');
        }

        const result = await response.json();
        console.log("Calorie estimation result:", result);
        return result;
    } catch (error) {
        console.error('Error estimating calories:', error);
        throw error;
    }
};