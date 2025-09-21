// options.js - Logic for the options page.
// This script handles loading and saving the user's preferences.

document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('enable-dark-mode-toggle');
    const highlightingToggle = document.getElementById('enable-highlighting-toggle');
    const notesHighlightToggle = document.getElementById('enable-notes-highlight-toggle');
    const repositioningToggle = document.getElementById('enable-repositioning-toggle');
    const packAllToggle = document.getElementById('enable-pack-all-toggle');

    // 1. Load the saved preferences when the options page is opened.
    chrome.storage.sync.get(['isDarkModeEnabled', 'isHighlightingEnabled', 'isNotesHighlightEnabled', 'isRepositioningEnabled', 'isPackAllProminent'], (data) => {
        // Set state for the dark mode toggle.
        if (data.isDarkModeEnabled) {
            darkModeToggle.checked = true;
            document.body.classList.add('dark-mode');
        }

        // Set state for the main highlighting toggle.
        highlightingToggle.checked = data.isHighlightingEnabled !== false;

        // Set state for the notes highlight toggle (default to true).
        notesHighlightToggle.checked = data.isNotesHighlightEnabled !== false;

        // Set state for the new repositioning toggle.
        repositioningToggle.checked = data.isRepositioningEnabled !== false;

        // Set state for the pack all toggle.
        packAllToggle.checked = data.isPackAllProminent !== false;
    });

    // 2. Add an event listener to the dark mode toggle.
    darkModeToggle.addEventListener('change', () => {
        const isEnabled = darkModeToggle.checked;
        document.body.classList.toggle('dark-mode', isEnabled);
        chrome.storage.sync.set({ isDarkModeEnabled: isEnabled }, () => {
            console.log('Dark mode preference saved:', isEnabled);
        });
    });

    // 3. Add an event listener to the main toggle.
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

    // 5. Add an event listener for the pack all toggle.
    packAllToggle.addEventListener('change', () => {
        const isEnabled = packAllToggle.checked;
        chrome.storage.sync.set({ isPackAllProminent: isEnabled }, () => {
            console.log('Prominent pack all preference saved:', isEnabled);
        });
    });
});

