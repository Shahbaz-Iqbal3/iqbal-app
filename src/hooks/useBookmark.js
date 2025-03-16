import { useState } from 'react';

export function useBookmark() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const addPoemBookmark = async ({ userId, poemId }) => {
    setIsLoading(true);
    setError(null);
    try {   
      const response = await fetch('/api/bookmark', {
        method: 'POST',
        body: JSON.stringify({
          userId,
          poemId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add bookmark');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const addStanzaBookmark = async ({ userId, stanzaId }) => {
    setIsLoading(true);
    setError(null);
    try { 
      const response = await fetch('/api/bookmark', {
        method: 'POST',
        body: JSON.stringify({
          userId,
          stanzaId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add bookmark');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBookmark = async (bookmarkId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/bookmark/${bookmarkId}`, {
        method: 'DELETE',
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete bookmark');
      }
  
      return true;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  return {
    addPoemBookmark,
    addStanzaBookmark,
    deleteBookmark,
    isLoading,
    error,
  };
}