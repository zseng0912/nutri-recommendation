// Environment and API setup
require("dotenv").config(); 
const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai"); //GEMINI API

const app = express();
const port = 3000;

// Configure express to handle large payloads (needed for image processing)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Initialize Gemini AI with API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.API_KEY); // Get Gemini API_Key
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // Using latest Gemini model

// System prompt that defines the AI's behavior and scope (for chatbot purpose)
const SYSTEM_PROMPT = `You are a helpful nutrition assistant. Only respond to questions related to:
- BMI
- Obesity levels
- Nutrition
- Healthy foods
- Diet and exercise

IMPORTANT INSTRUCTIONS:
1. Keep responses very short and concise (maximum 2-3 sentences)
2. Focus on direct answers without lengthy explanations
3. If the user asks something outside these topics, simply say: "I can only help with nutrition-related questions."
4. Use simple, clear language
5. No need for greetings or formalities
6. Get straight to the point

Example responses:
User: "What's a healthy breakfast?"
Assistant: "Try oatmeal with fruits and nuts. It's high in fiber and protein, keeping you full longer."

User: "How to lose weight?"
Assistant: "Focus on a balanced diet and regular exercise. Aim for a 500-calorie daily deficit through diet and activity."

User: "What's the weather today?"
Assistant: "I can only help with nutrition-related questions."`;

// Helper function to clean and validate JSON responses from AI
function cleanJsonResponse(text) {
    try {
        // First, try to find JSON content between code blocks
        let cleanedText = text;
        
        // Remove markdown code blocks if present
        cleanedText = cleanedText.replace(/```json\s*|\s*```/g, '');
        
        // Remove any leading/trailing whitespace
        cleanedText = cleanedText.trim();
        
        // Find the first { and last } to extract the JSON object
        const startIndex = cleanedText.indexOf('{');
        const endIndex = cleanedText.lastIndexOf('}');
        
        if (startIndex === -1 || endIndex === -1) {
            throw new Error('No valid JSON object found in the response');
        }
        
        cleanedText = cleanedText.slice(startIndex, endIndex + 1);

        // Clean up common JSON formatting issues
        cleanedText = cleanedText
            // Remove trailing commas in objects and arrays
            .replace(/,(\s*[}\]])/g, '$1')
            // Fix multiple consecutive newlines
            .replace(/\n+/g, '\n')
            // Remove any remaining markdown artifacts
            .replace(/\\\*/g, '')
            // Ensure proper quotation marks
            .replace(/[""]/g, '"')
            // Fix escaped newlines
            .replace(/\\n/g, '\n')
            // Fix escaped quotes
            .replace(/\\"/g, '"');

        // Parse the JSON
        const parsedJson = JSON.parse(cleanedText);
        
        // Validate the structure
        if (!parsedJson.recipes || !parsedJson.exercises) {
            throw new Error('Missing required recipes or exercises arrays');
        }

        // Validate each recipe has required fields
        parsedJson.recipes.forEach((recipe, index) => {
            const requiredFields = ['recipeName', 'recipeDescription', 'recipeItems', 'cookingInstructions', 'recipeCalories', 'recipeBenefits', 'iconClass', 'estimatedCookingTime'];
            const missingFields = requiredFields.filter(field => !recipe[field]);
            if (missingFields.length > 0) {
                throw new Error(`Recipe at index ${index} is missing required fields: ${missingFields.join(', ')}`);
            }
        });

        // Validate each exercise has required fields
        parsedJson.exercises.forEach((exercise, index) => {
            const requiredFields = ['exerciseName', 'exerciseDescription', 'exercisePerform', 'duration', 'intensity', 'exerciseBenefits', 'iconClass', 'location'];
            const missingFields = requiredFields.filter(field => !exercise[field]);
            if (missingFields.length > 0) {
                throw new Error(`Exercise at index ${index} is missing required fields: ${missingFields.join(', ')}`);
            }
        });

        return parsedJson;

    } catch (error) {
        console.error('Error cleaning JSON:', error);
        throw new Error(`Failed to process JSON response: ${error.message}`);
    }
}

// API Endpoint: Generate personalized nutrition and exercise recommendations based on BMI
app.post("/generate-ai-tips", async (req, res) => {
    try {
        const { bmi, obesityRisk } = req.body;
        if (!bmi || !obesityRisk) {
            return res.status(400).json({ error: "BMI value or Obesity Risk Level is required" });
        }
        // Prompt AI to generate 5 healthy Malaysian recipes and 5 suitable exercises in JSON format based on BMI and ObesityRisk
        const prompt = `
            Generate 5 healthy Malaysian recipes and 5 suitable exercises in JSON format for a person with a BMI of ${bmi} and Obesity Level is ${obesityRisk}.
            
            Requirements for recipes:
            - Must be authentic Malaysian dishes or Malaysian-inspired healthy dishes
            - Include common ingredients found in Malaysian markets
            - Include calorie count and nutritional benefits
            - Provide cooking instructions that are easy to follow
            - Include a relevant and valid Font Awesome icon class name for the dish
              Example: For Nasi Lemak use "utensils"
              For Mee Goreng use "utensils"
              For Satay use "drumstick-bite"
              For vegetables use "carrot"
              For fruits use "apple-alt"
              For fish dishes use "fish"
              For salads use "leaf"
              For soup use "mug-hot"
            
            Requirements for exercises:
            - Must be exercises that can be done in Malaysian climate and environment
            - Consider local gym facilities and public spaces available in Malaysia
            - Include detailed instructions on how to perform the exercise
            - Include duration and intensity recommendations
            - Include a relevant and valid Font Awesome icon class name for the exercise
              Example: For Jogging use "running"  
                    For Yoga use "pray"  
                    For Swimming use "swimmer"  
                    For Cycling use "biking"  
                    For Walking use "walking"  
                    For Stretching use "hands-helping"  
                    For Hiking use "hiking"  
                    For Weightlifting use "dumbbell"  
                    For Dancing/Zumba use "music"  
                    For Boxing use "hand-rock"  
                    For Team Sports use "users"  
                    For Meditation use "spa"  
                    For Jump Rope use "child"  
                    For Treadmill Exercise use "running"  
                    For Martial Arts use "fist-raised"  
                    For Generic Workout use "heartbeat"  
                    For Climbing use "mountain"  
                    For Gym Session use "weight"
            
            The response should follow this JSON schema:
            {
                "recipes": [
                    {
                        "recipeName": "string",
                        "recipeDescription": "string",
                        "recipeItems": ["string"],
                        "cookingInstructions": ["string"],
                        "recipeCalories": "number",
                        "recipeBenefits": "string",
                        "iconClass": "string (Font Awesome icon class name)",
                        "estimatedCookingTime": "string"
                    }
                ],
                "exercises": [
                    {
                        "exerciseName": "string",
                        "exerciseDescription": "string",
                        "exercisePerform": ["string"],
                        "duration": "string",
                        "intensity": "string",
                        "exerciseBenefits": "string",
                        "iconClass": "string (Font Awesome icon class name)",
                        "location": "string (where this can be done in Malaysia)"
                    }
                ]
            }
            
            For recipes, focus on:
            - Healthy versions of Malaysian favorites
            - Use of local vegetables and proteins
            - Balanced nutrition
            - Portion control
            - Low-oil cooking methods
            
            For exercises, consider:
            - Malaysia's tropical climate
            - Available facilities (parks, gyms, community centers)
            - Cultural considerations
            - Indoor and outdoor options
            - Different fitness levels

            IMPORTANT: 
            - Use appropriate Font Awesome icon classes
            - Icons should be relevant to the recipe/exercise
            - Choose icons that best represent the activity or dish
            - Just the class name without fas, for example: carrot, not fas fa-carrot
            - Must use valid icon name for family "FontAwesome5Free-Regular"

            Provide a valid JSON format with appropriate Font Awesome icon classes.
        `;

        const result = await model.generateContent(prompt); // Call model generate content based on prompt
        const rawText = result.response.text(); // Result Generated
        console.log("JSON generated", rawText);

        const aiTipsJSON = cleanJsonResponse(rawText);

        res.json({
            bmi,
            data: aiTipsJSON
        }); // Results in JSON format

    } catch (error) {
        console.error("Error generating AI tips:", error.message);
        res.status(500).json({ error: "Failed to generate recipes and exercises" });
    }
});

// API Endpoint: Nutrition-focused chatbot with strict response guidelines
app.post("/ai-chatbot", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        
        // Create chat with proper history format
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: SYSTEM_PROMPT }]
                },
                {
                    role: "model",
                    parts: [{ text: "I understand. I will keep my responses short and focused on nutrition." }]
                }
            ],
            generationConfig: {
                maxOutputTokens: 100,  // Limit response length
                temperature: 0.7,      // Balance between creativity and consistency
                topP: 0.8,            // Control response diversity
                topK: 40              // Control response diversity
            }
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        // Ensure response is concise
        const conciseResponse = text.split('.')[0] + (text.includes('.') ? '.' : '');
        
        res.json({ response: conciseResponse });
    } catch (error) {
        console.error('Error in Gemini API:', error);
        res.status(500).json({ error: "Failed to process message" });
    }
});

// API Endpoint: Food image analysis for calorie estimation
app.post("/estimate-calories", async (req, res) => {
    try {
        const { base64Image } = req.body;
        if (!base64Image) {
            return res.status(400).json({ error: "Image is required" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        // Convert base64 to blob
        const imageData = base64Image.split(',')[1];
        const imageBlob = {
            inlineData: {
                data: imageData,
                mimeType: "image/jpeg"
            }
        };

        // Generate content with specific prompt
        const result = await model.generateContent([
            {
                text: "Analyze this food image and provide the following information in a clear format:\n" +
                      "1. Identify the main dish name (e.g., 'Chicken Caesar Salad', 'Beef Burger with Fries')\n" +
                      "2. List all food items visible in the image\n" +
                      "3. For each item, provide an estimated calorie count\n" +
                      "4. Calculate and provide the total calories\n" +
                      "5. If any items are unclear or cannot be identified, mention them\n" +
                      "Be as specific and accurate as possible with the calorie estimates.\n\n" +
                      "Format your response as a JSON object with the following structure:\n" +
                      "{\n" +
                      "  \"dishName\": \"name of the main dish\",\n" +
                      "  \"foodItems\": [\n" +
                      "    {\n" +
                      "      \"name\": \"food name\",\n" +
                      "      \"calories\": number,\n" +
                      "      \"portion\": \"description of portion\"\n" +
                      "    }\n" +
                      "  ],\n" +
                      "  \"totalCalories\": number,\n" +
                      "  \"notes\": [\"any important notes or disclaimers\"]\n" +
                      "}\n\n" +
                      "IMPORTANT: Return ONLY the JSON object, no other text or formatting."
            },
            {
                inlineData: imageBlob.inlineData
            }
        ]);

        const response = await result.response;
        const text = response.text();

        // Clean the response text to extract JSON
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No JSON found in response');
        }

        const jsonStr = jsonMatch[0];
        const parsedResponse = JSON.parse(jsonStr);

        res.json({ 
            success: true,
            data: parsedResponse
        });
    } catch (error) {
        console.error('Error in Gemini API:', error);
        res.status(500).json({ 
            success: false,
            error: "Failed to analyze image" 
        });
    }
});

// Start the server with this port
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
