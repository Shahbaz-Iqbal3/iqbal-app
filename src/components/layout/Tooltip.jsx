// components/Tooltip.jsx
'use client';

import { memo, useCallback, useEffect, useRef, useState } from 'react';

const Tooltip = memo(({ 
  content, 
  children, 
  delay = 200, 
  position = 'top',
  mobileDelay = 800 // Longer delay for mobile long press
}) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const triggerRef = useRef(null);
  const showTimeout = useRef(null);
  const hideTimeout = useRef(null);
  const observerRef = useRef(null);
  const touchTimeoutRef = useRef(null);
  const isTouchingRef = useRef(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    
    const rect = triggerRef.current.getBoundingClientRect();
    
    // Calculate positions relative to viewport
    const positions = {
      top: { 
        x: rect.left + rect.width / 2,
        y: rect.top
      },
      bottom: {
        x: rect.left + rect.width / 2,
        y: rect.bottom
      },
      left: {
        x: rect.left,
        y: rect.top + rect.height / 2
      },
      right: {
        x: rect.right,
        y: rect.top + rect.height / 2
      }
    };

    setCoords(adjustForViewport(positions[position], rect.width));
  }, [position]);

  const adjustForViewport = (pos) => {
    const buffer = 8;
    return {
      x: Math.max(buffer, Math.min(pos.x, window.innerWidth - buffer)),
      y: Math.max(buffer, Math.min(pos.y, window.innerHeight - buffer))
    };
  };

  const clearTimeouts = () => {
    clearTimeout(showTimeout.current);
    clearTimeout(hideTimeout.current);
    clearTimeout(touchTimeoutRef.current);
  };

  const showTooltip = useCallback(() => {
    if (isMobile) return; // Don't show on hover for mobile
    
    clearTimeouts();
    showTimeout.current = setTimeout(() => {
      updatePosition();
      setVisible(true);
    }, delay);
  }, [delay, updatePosition, isMobile]);

  const hideTooltip = useCallback(() => {
    clearTimeouts();
    hideTimeout.current = setTimeout(() => {
      setVisible(false);
    }, 100);
  }, []);

  // Mobile touch handlers
  const handleTouchStart = useCallback(() => {
    if (!isMobile) return;
    
    isTouchingRef.current = true;
    clearTimeouts();
    
    touchTimeoutRef.current = setTimeout(() => {
      if (isTouchingRef.current) {
        updatePosition();
        setVisible(true);
        
        // Trigger vibration if supported
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }
    }, mobileDelay);
  }, [mobileDelay, updatePosition, isMobile]);

  const handleTouchEnd = useCallback(() => {
    isTouchingRef.current = false;
    clearTimeout(touchTimeoutRef.current);
    
    // Keep tooltip visible for a moment after releasing
    setTimeout(() => {
      if (!isTouchingRef.current) {
        setVisible(false);
      }
    }, 1500);
  }, []);

  const handleTouchMove = useCallback(() => {
    // Cancel long press if user is scrolling/moving
    isTouchingRef.current = false;
    clearTimeout(touchTimeoutRef.current);
  }, []);

  useEffect(() => {
    if (!triggerRef.current) return;

    observerRef.current = new ResizeObserver(updatePosition);
    observerRef.current.observe(triggerRef.current);
    
    // Add passive scroll listener
    window.addEventListener('scroll', updatePosition, { 
      passive: true,
      capture: true 
    });

    return () => {
      observerRef.current?.disconnect();
      window.removeEventListener('scroll', updatePosition, { 
        capture: true 
      });
      clearTimeouts();
    };
  }, [updatePosition]);

  return (
    <div 
      ref={triggerRef}
      className="relative inline-flex"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onTouchCancel={handleTouchEnd}
      role="tooltip"
    >
      {children}
      
      {visible && (
        <div
          className={`fixed z-[9999] px-2.5 py-1.5 text-sm bg-[#343a40] text-gray-100 rounded-lg shadow-xl transition-opacity duration-200 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            left: `${coords.x}px`,
            top: `${coords.y}px`,
            transform: getTransform(position),
            transitionDelay: `${delay}ms`
          }}
        >
          <div className={`absolute w-2 h-2 bg-[#343a40] ${ARROW_STYLES[position]}`} />
          {content}
        </div>
      )}
    </div>
  );
});

const ARROW_STYLES = {
  top: '-bottom-1 left-1/2 -translate-x-1/2 rotate-45',
  bottom: '-top-1 left-1/2 -translate-x-1/2 rotate-45',
  right: 'left-[-4px] top-1/2 -translate-y-1/2 rotate-45',
  left: 'right-[-4px] top-1/2 -translate-y-1/2 rotate-45',
};

const getTransform = (position) => {
  const transforms = {
    top: 'translate(-50%, calc(-100% - 8px))',
    bottom: 'translate(-50%, 8px)',
    left: 'translate(calc(-100% - 8px), -50%)',
    right: 'translate(8px, -50%)',
  };
  return transforms[position] || 'translate(-50%, -100%)';
};

export default Tooltip;