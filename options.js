// options.js - Logic for the options page.
// This script handles loading and saving the user's preferences.

document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('enable-dark-mode-toggle');
    const highlightingToggle = document.getElementById('enable-highlighting-toggle');
    const notesHighlightToggle = document.getElementById('enable-notes-highlight-toggle');
    const repositioningToggle = document.getElementById('enable-repositioning-toggle');
    const upsPhoneToggle = document.getElementById('enable-ups-phone-toggle');
    const upsPhoneNumberInput = document.getElementById('ups-phone-number-input');

    // 1. Load the saved preferences when the options page is opened.
    chrome.storage.sync.get(['isDarkModeEnabled', 'isHighlightingEnabled', 'isNotesHighlightEnabled', 'isRepositioningEnabled', 'isUpsPhoneEnabled', 'upsPhoneNumber'], (data) => {
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

        // Set state for the UPS phone toggle.
        upsPhoneToggle.checked = data.isUpsPhoneEnabled !== false;

        // Set the value for the UPS phone number input.
        upsPhoneNumberInput.value = data.upsPhoneNumber || "111-111-1111";

        // Toggle the visibility of the custom phone container based on the saved state.
        toggleCustomPhoneContainer();
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

    // 7. Add an event listener for the UPS phone toggle.
    upsPhoneToggle.addEventListener('change', () => {
        const isEnabled = upsPhoneToggle.checked;
        chrome.storage.sync.set({ isUpsPhoneEnabled: isEnabled }, () => {
            console.log('UPS phone preference saved:', isEnabled);
        });
        toggleCustomPhoneContainer();
    });

    function toggleCustomPhoneContainer() {
        const container = document.getElementById('custom-ups-phone-container');
        container.style.display = upsPhoneToggle.checked ? 'flex' : 'none';
    }

    // 8. Add an event listener for the UPS phone number input.
    upsPhoneNumberInput.addEventListener('input', () => {
        const phoneNumber = upsPhoneNumberInput.value;
        chrome.storage.sync.set({ upsPhoneNumber: phoneNumber }, () => {
            console.log('UPS phone number saved:', phoneNumber);
        });
    });
});
