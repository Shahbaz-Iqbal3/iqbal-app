"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Define style presets for different moods
const stylePresets = {
  love: {
    name: "Romantic",
    font: "var(--font-playfair)",
    fontSize: "24px",
    textColor: "#ffffff",
    backgroundColor: "#1a202c",
    backgroundImage: "/images/presets/romantic.avif",
    description: "Soft and romantic style perfect for love poems"
  },
  hope: {
    name: "Hopeful",
    font: "var(--font-opensans)",
    fontSize: "20px",
    textColor: "#ffffff",
    backgroundColor: "#1a202c",
    backgroundImage: "/images/presets/hopeful.avif",
    description: "Bright and uplifting style for hopeful verses"
  },
  dark: {
    name: "Dark",
    font: "var(--font-merriweather)",
    fontSize: "22px",
    textColor: "#ffffff",
    backgroundColor: "#1a202c",
    backgroundImage: "/images/presets/darknature.avif",
    description: "Deep and intense style for dark themes"
  },
  nature: {
    name: "Nature",
    font: "var(--font-lora)",
    fontSize: "20px",
    textColor: "#ffffff",
    backgroundColor: "#1a202c",
    backgroundImage: "/images/presets/nature.avif",
    description: "Earthy and organic style for nature poems"
  },
  melancholic: {
    name: "Melancholic",
    font: "var(--font-roboto)",
    fontSize: "18px",
    textColor: "#ffffff",
    backgroundColor: "#1a202c",
    backgroundImage: "/images/presets/sad.avif",
    description: "Subtle and reflective style for melancholic verses"
  }
};

// Keywords for mood detection
const moodKeywords = {
  love: ['love', 'heart', 'kiss', 'romance', 'passion', 'soul', 'forever', 'beautiful', 'darling', 'sweet'],
  hope: ['hope', 'light', 'future', 'dream', 'believe', 'faith', 'strength', 'courage', 'rise', 'shine'],
  dark: ['dark', 'night', 'shadow', 'death', 'pain', 'sorrow', 'tears', 'cry', 'lonely', 'empty'],
  nature: ['tree', 'flower', 'sky', 'mountain', 'river', 'wind', 'earth', 'sun', 'moon', 'star'],
  melancholic: ['sad', 'melancholy', 'memory', 'past', 'gone', 'lost', 'time', 'fade', 'end', 'farewell']
};

export default function AIStyleSuggestions({ text, onApplyStyle, autoApply = false }) {
  useEffect(() => {
    if (autoApply && text) {
      // Use setTimeout to ensure we're not in the middle of a render cycle
      const timeoutId = setTimeout(() => {
        // Simple mood detection
        const words = text.toLowerCase().split(/\s+/);
        const moodScores = {};
        
        Object.entries(moodKeywords).forEach(([mood, keywords]) => {
          moodScores[mood] = words.filter(word => keywords.includes(word)).length;
        });
        
        // Find the mood with highest score or default to 'dark'
        const maxScore = Math.max(...Object.values(moodScores));
        const mood = maxScore === 0 ? 'dark' : 
          Object.entries(moodScores).find(([_, score]) => score === maxScore)[0];
        
        const stylePreset = stylePresets[mood];
        
        // Convert the style preset to the expected format
        const aiStyle = {
          urduFontId: 'nastaliq',
          englishFontId: stylePreset.font.includes('playfair') ? 'playfair' :
                        stylePreset.font.includes('lora') ? 'lora' :
                        stylePreset.font.includes('merriweather') ? 'merriweather' :
                        'roboto',
          fontSize: stylePreset.fontSize,
          textColor: stylePreset.textColor,
          backgroundColor: stylePreset.backgroundColor,
          backgroundImage: stylePreset.backgroundImage,
          overlayOpacity: 0.7
        };

        // Apply the style
        onApplyStyle(aiStyle);
      }, 0);

      // Cleanup timeout if component unmounts
      return () => clearTimeout(timeoutId);
    }
  }, [text, autoApply, onApplyStyle]);

  // Don't render anything in auto mode
  if (autoApply) return null;

  // Manual mode UI (not used in this case)
  return null;
} 