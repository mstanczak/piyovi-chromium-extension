// options.js - Logic for the options page.
// This script handles loading and saving the user's preferences.

document.addEventListener('DOMContentLoaded', () => {
    const highlightingToggle = document.getElementById('enable-highlighting-toggle');
    const notesHighlightToggle = document.getElementById('enable-notes-highlight-toggle');
    const repositioningToggle = document.getElementById('enable-repositioning-toggle');

    // 1. Load the saved preferences when the options page is opened.
    chrome.storage.sync.get(['isHighlightingEnabled', 'isNotesHighlightEnabled', 'isRepositioningEnabled'], (data) => {
        // Set state for the main highlighting toggle.
        highlightingToggle.checked = data.isHighlightingEnabled !== false;

        // Set state for the notes highlight toggle (default to true).
        notesHighlightToggle.checked = data.isNotesHighlightEnabled !== false;

        // Set state for the new repositioning toggle.
        repositioningToggle.checked = data.isRepositioningEnabled !== false;
    });

    // 2. Add an event listener to the main toggle.
    highlightingToggle.addEventListener('change', () => {
        const isEnabled = highlightingToggle.checked;
        chrome.storage.sync.set({ isHighlightingEnabled: isEnabled }, () => {
            console.log('Highlighting preference saved:', isEnabled);
        });
    });

    // 3. Add an event listener to the notes highlight toggle.
    notesHighlightToggle.addEventListener('change', () => {
        const isEnabled = notesHighlightToggle.checked;
        chrome.storage.sync.set({ isNotesHighlightEnabled: isEnabled }, () => {
            console.log('Notes highlighting preference saved:', isEnabled);
        });
    });

    // 4. Add an event listener for the new repositioning toggle.
    repositioningToggle.addEventListener('change', () => {
        const isEnabled = repositioningToggle.checked;
        chrome.storage.sync.set({ isRepositioningEnabled: isEnabled }, () => {
            console.log('Repositioning preference saved:', isEnabled);
        });
    });
});

