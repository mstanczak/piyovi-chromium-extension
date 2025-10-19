// options.js - Logic for the options page.
// This script handles loading and saving the user's preferences.

document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('enable-dark-mode-toggle');
    const highlightingToggle = document.getElementById('enable-highlighting-toggle');
    const notesHighlightToggle = document.getElementById('enable-notes-highlight-toggle');
    const repositioningToggle = document.getElementById('enable-repositioning-toggle');
    const carrierPhoneToggle = document.getElementById('enable-carrier-phone-toggle');
    const carrierPhoneNumberInput = document.getElementById('carrier-phone-number-input');
    const address3Toggle = document.getElementById('enable-address3-toggle');

    // 1. Load the saved preferences when the options page is opened.
    chrome.storage.sync.get(['isDarkModeEnabled', 'isHighlightingEnabled', 'isNotesHighlightEnabled', 'isRepositioningEnabled', 'isCarrierPhoneEnabled', 'carrierPhoneNumber', 'isAddress3Enabled'], (data) => {
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

        // Set state for the carrier phone toggle.
        carrierPhoneToggle.checked = data.isCarrierPhoneEnabled !== false;

        // Set state for the address 3 toggle.
        address3Toggle.checked = data.isAddress3Enabled === true;

        // Set the value for the carrier phone number input.
        carrierPhoneNumberInput.value = data.carrierPhoneNumber || "111-111-1111";

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

    // 5. Add an event listener for the address 3 toggle.
    address3Toggle.addEventListener('change', () => {
        const isEnabled = address3Toggle.checked;
        chrome.storage.sync.set({ isAddress3Enabled: isEnabled }, () => {
            console.log('Address 3 splitting preference saved:', isEnabled);
        });
    });

    // 7. Add an event listener for the carrier phone toggle.
    carrierPhoneToggle.addEventListener('change', () => {
        const isEnabled = carrierPhoneToggle.checked;
        chrome.storage.sync.set({ isCarrierPhoneEnabled: isEnabled }, () => {
            console.log('Carrier phone preference saved:', isEnabled);
        });
        toggleCustomPhoneContainer();
    });

    function toggleCustomPhoneContainer() {
        const container = document.getElementById('custom-carrier-phone-container');
        container.style.display = carrierPhoneToggle.checked ? 'flex' : 'none';
    }

    // 8. Add an event listener for the carrier phone number input.
    carrierPhoneNumberInput.addEventListener('input', () => {
        const phoneNumber = carrierPhoneNumberInput.value;
        chrome.storage.sync.set({ carrierPhoneNumber: phoneNumber }, () => {
            console.log('Carrier phone number saved:', phoneNumber);
        });
    });
});
