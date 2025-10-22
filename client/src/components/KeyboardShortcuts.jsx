import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const KeyboardShortcuts = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Only trigger shortcuts when not typing in inputs
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }

      // Ctrl/Cmd + K for search
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = document.querySelector('input[type="text"]');
        if (searchInput) {
          searchInput.focus();
        }
      }

      // Ctrl/Cmd + N for new (create)
      if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
        event.preventDefault();
        const createButton = document.querySelector('button[class*="btn-primary"]');
        if (createButton) {
          createButton.click();
        }
      }

      // Escape to close modals
      if (event.key === 'Escape') {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
          const closeButton = modal.querySelector('button[aria-label="Close"], button:last-child');
          if (closeButton) {
            closeButton.click();
          }
        }
      }

      // Number keys for navigation
      if (event.key >= '1' && event.key <= '3') {
        const navItems = document.querySelectorAll('.sidebar-item');
        const index = parseInt(event.key) - 1;
        if (navItems[index]) {
          navItems[index].click();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return null;
};

export default KeyboardShortcuts;
