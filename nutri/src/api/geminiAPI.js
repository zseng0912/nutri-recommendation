const API_URL = 'http://192.168.100.16:3000/ai-chatbot';

export const sendMessage = async (message) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to get response from server');
        }

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Error in Gemini API:', error);
        throw error;
    }
}; 