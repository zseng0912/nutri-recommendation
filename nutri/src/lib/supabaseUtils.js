import { supabase } from './supabase';

// User Profile Operations
export const getUserProfile = async () => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .single();
  
  if (error) throw error;
  return data;
};

export const updateUserProfile = async (updates) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', (await supabase.auth.getUser()).data.user.id);
  
  if (error) throw error;
  return data;
};

// Progress Tracking Operations
export const getProgressHistory = async () => {
  const { data, error } = await supabase
    .from('progress_tracking')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) throw error;
  return data;
};

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

// Recommendations Operations
export const getRecommendations = async () => {
  const { data, error } = await supabase
    .from('recommendations')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Authentication Helper
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

// Sign Out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}; 

// Bookmarks functions
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

// Meals Operations
export const getMealsForDate = async (date) => {
    try {
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