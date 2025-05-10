import { supabase } from './supabase';

/**
 * User Profile Operations
 * Functions for managing user profile data in the database
 */

// Fetch the current user's profile data
export const getUserProfile = async () => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .single();
  
  if (error) throw error;
  return data;
};

// Update the current user's profile with new data
export const updateUserProfile = async (updates) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', (await supabase.auth.getUser()).data.user.id);
  
  if (error) throw error;
  return data;
};

/**
 * Progress Tracking Operations
 * Functions for managing user's progress tracking data
 */

// Fetch user's progress history, sorted by date
export const getProgressHistory = async () => {
  const { data, error } = await supabase
    .from('progress_tracking')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Add a new progress entry for the current user
export const addProgressEntry = async (entry) => {
  const { data, error } = await supabase
    .from('progress_tracking')
    .insert([{
      ...entry,
      user_id: (await supabase.auth.getUser()).data.user.id
    }]);
  
  if (error) throw error;
  return data;
};

/**
 * Recommendations Operations
 * Functions for managing user's recommendations
 */

// Fetch recommendations for the current user
export const getRecommendations = async () => {
  const { data, error } = await supabase
    .from('recommendations')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

/**
 * Authentication Operations
 * Helper functions for user authentication
 */

// Get the currently authenticated user  
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

// Sign out the current user
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}; 

/**
 * Bookmarks Operations
 * Functions for managing user's bookmarked items (recipes and exercises)
 */

// Add a new bookmark for the user
export const addBookmark = async (userId, itemId,item, type) => {
  try {
      const { data, error } = await supabase
          .from('bookmarks')
          .insert([
              {
                  user_id: userId,
                  item_id: itemId,
                  item_data: item,
                  type: type, // 'recipe' or 'exercise'
                  created_at: new Date().toISOString()
              }
          ]);
      
      if (error) throw error;
      return data;
  } catch (error) {
      console.error('Error adding bookmark:', error);
      throw error;
  }
};

// Remove a bookmark for the user
export const removeBookmark = async (userId, itemId, type) => {
  try {
      const { data, error } = await supabase
          .from('bookmarks')
          .delete()
          .match({
              user_id: userId,
              item_id: itemId,
              type: type
          });
      
      if (error) throw error;
      return data;
  } catch (error) {
      console.error('Error removing bookmark:', error);
      throw error;
  }
};

// Fetch all bookmarks for a user
export const getBookmarks = async (userId) => {
    try {
        const { data: bookmarks, error } = await supabase
            .from('bookmarks')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return bookmarks;
    } catch (error) {
        console.error('Error fetching bookmarks:', error);
        throw error;
    }
};

// Check if an item is bookmarked by the user
export const isBookmarked = async (userId, itemId, type) => {
  try {
      const { data, error } = await supabase
          .from('bookmarks')
          .select('id')
          .eq('user_id', userId)
          .eq('item_id', itemId)
          .eq('type', type)
          .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
  } catch (error) {
      console.error('Error checking bookmark:', error);
      throw error;
  }
};

/**
 * Meals Operations
 * Functions for managing user's meal and calorie tracking data
 */

// Fetch all meals for a specific date
export const getMealsForDate = async (date) => {
    try {
        // Set time range for the entire day
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const { data, error } = await supabase
            .from('calories')
            .select('*')
            .gte('created_at', startOfDay.toISOString())
            .lte('created_at', endOfDay.toISOString())
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching meals:', error);
        throw error;
    }
};

// Add a new meal entry for the current user
export const addMeal = async (mealData) => {
    try {
        const { data, error } = await supabase
            .from('calories')
            .insert([{
                ...mealData,
                user_id: (await supabase.auth.getUser()).data.user.id,
                created_at: new Date().toISOString()
            }]);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error adding meal:', error);
        throw error;
    }
}; 
