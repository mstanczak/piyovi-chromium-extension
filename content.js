// content.js - This script runs on piyovi.io pages.
// Its purpose is to highlight specific rows and reposition elements in the UI.

/**
 * Finds and applies a highlight style to specific rows in the grid.
 * A row is highlighted if it contains a 'div' with attribute col-id="DG"
 * and a child '<yesno-cell>' with the text "Yes".
 */
const highlightRows = () => {
    // Select all div elements with the specified column ID.
    const targetDivs = document.querySelectorAll('div[col-id="DG"]');

    targetDivs.forEach(div => {
        // Find the <yesno-cell> element within the current div.
        const yesNoCell = div.querySelector('yesno-cell');

        // Check if the cell exists and its text content is "Yes".
        if (yesNoCell && yesNoCell.textContent.trim() === 'Yes') {
            // Find the parent row element, which has the class 'ag-row'.
            const parentRow = div.closest('.ag-row');

            // If a parent row is found, apply the highlight styles.
            if (parentRow) {
                parentRow.style.backgroundColor = 'rgba(255, 0, 0, 0.15)';
                parentRow.style.fontWeight = 'bold';
            }
        }
    });
};

/**
 * Finds the 'Notes' and 'Tax ID' form elements and moves the 'Notes' box
 * to be directly after the 'Tax ID' box for better readability.
 */
const repositionNotesBox = () => {
    // Select the 'Notes' element using its specific label attribute.
    const notesBox = document.querySelector('py-form-group-item[label="common.field.notes"]');

    // Select the 'Tax ID' element, which will be our anchor point.
    const taxIdBox = document.querySelector('py-form-group-item[label="Tax ID"]');

    // Check if both elements exist on the page before trying to move them.
    // This also prevents the observer from causing unnecessary DOM manipulations if the element is already moved.
    if (notesBox && taxIdBox && taxIdBox.nextElementSibling !== notesBox) {
        // The .after() method inserts a node after the specified element in its parent.
        // This effectively moves the notesBox to the new position.
        taxIdBox.after(notesBox);
    }
};

/**
 * Applies a noticeable style to the 'Notes' box but only if it contains text.
 * This helps draw the user's attention to existing notes.
 */
const stylePopulatedNotes = () => {
    // Select the parent container for the notes.
    const notesBox = document.querySelector('py-form-group-item[label="common.field.notes"]');
    if (!notesBox) {
        return; // Exit if the notes box isn't on the page.
    }

    // Find the actual textarea element inside the container.
    const textArea = notesBox.querySelector('textarea');
    if (!textArea) {
        return; // Exit if the textarea isn't found.
    }
    
    // Find the inner form-group div to apply margins.
    const formGroup = notesBox.querySelector('.form-group');
    if (!formGroup) {
        return;
    }

    // Check if the textarea has actual content (not just whitespace).
    const hasContent = textArea.value.trim() !== '';

    if (hasContent) {
        // Apply noticeable styles if there's content.
        notesBox.style.backgroundColor = 'rgba(255, 248, 225, 1)'; // A light yellow.
        notesBox.style.borderRadius = '5px';
        notesBox.style.border = '1px solid #f0ad4e'; // A soft orange border.
        notesBox.style.transition = 'all 0.3s ease-in-out';
        
        // Apply even margins as requested for a more balanced look.
        formGroup.style.marginTop = '8px';
        formGroup.style.marginBottom = '8px';
        formGroup.style.fontSize = '13px';

    } else {
        // Remove styles if there's no content to revert to the default appearance.
        notesBox.style.backgroundColor = '';
        notesBox.style.borderRadius = '';
        notesBox.style.border = '';
        
        // Revert margin and font styles.
        formGroup.style.marginTop = '';
        formGroup.style.marginBottom = '';
        formGroup.style.fontSize = '';
    }

    // Add a live input listener to the textarea so the style updates as the user types.
    // We add a 'data' attribute to ensure the listener is only attached once.
    if (!textArea.dataset.noteListenerAttached) {
        textArea.addEventListener('input', stylePopulatedNotes);
        textArea.dataset.noteListenerAttached = 'true';
    }
};

/**
 * Makes the "Pack all" button more prominent and hides other packing-related buttons.
 */
const prominentPackAll = () => {
    const packAllButton = document.querySelector('button[ngbtooltip="Pack all"]');
    if (packAllButton) {
        // Make the "Pack all" button bigger and more prominent.
        packAllButton.classList.remove('btn-sm', 'btn-outline-secondary', 'btn-primary');
        packAllButton.classList.add('prominent-pack-all');

        // Find the parent fieldset to locate sibling buttons.
        const fieldset = packAllButton.closest('fieldset');
        if (fieldset) {
            // Hide other buttons within the same fieldset.
            const buttonsToHide = fieldset.querySelectorAll('button:not([ngbtooltip="Pack all"])');
            buttonsToHide.forEach(button => {
                button.style.display = 'none';
            });
        }
    }
};

/**
 * Automatically clicks the "Pack all" button when conditions are met.
 * This is triggered when a package's items are loaded into the product grid,
 * but before they have been packed into the package grid below it.
 */
const autoPackAll = () => {
    // Select the "Pack all" button.
    const packAllButton = document.querySelector('button[ngbtooltip="Pack all"]');

    // Find the product grid (top) and package grid (bottom).
    const productGrid = document.querySelector('.tms-shipment-product');
    const packageGrid = document.querySelector('.py-shipment-package-grid');

    if (!packAllButton || !productGrid || !packageGrid) {
        // If essential elements aren't on the page, do nothing.
        return;
    }

    // Check for data rows in the product grid (top grid).
    const productGridRows = productGrid.querySelectorAll('.ag-row:not(.ag-row-pinned)');

    // Check for data rows in the package grid (bottom grid).
    const packageGridRows = packageGrid.querySelectorAll('.ag-row:not(.ag-row-pinned)');

    // Conditions to trigger the click:
    // 1. The "Pack all" button must be present.
    // 2. The product grid must have items.
    // 3. The package grid must be empty (meaning we haven't packed yet).
    if (packAllButton && productGridRows.length > 0 && packageGridRows.length === 0) {
        console.log('Piyovi Enhancement Suite: Auto-clicking "Pack all".');
        packAllButton.click();
    }
};

/**
 * Populates the phone number field with a default value if the carrier is UPS and the field is empty.
 */
const populateUpsPhoneNumber = (defaultPhoneNumber) => {
    // Find the carrier input field. It's an input inside a div with class 'ng-input'.
    const carrierInput = document.querySelector('.ng-input input[aria-autocomplete="list"]');

    // The carrier name is often in the first span inside the combobox, if a selection has been made.
    const carrierDisplay = document.querySelector('div[role="combobox"] .ng-value-label');

    // Check if the displayed carrier is 'UPS'.
    if (carrierDisplay && carrierDisplay.textContent.trim() === 'UPS') {
        // Find the phone number input field.
        const phoneInput = document.querySelector('input[formcontrolname="PhoneNumber1"]');

        // Check if the phone number field exists and is empty.
        if (phoneInput && phoneInput.value.trim() === '') {
            console.log(`Piyovi Enhancement Suite: Setting UPS phone number to ${defaultPhoneNumber}.`);
            phoneInput.value = defaultPhoneNumber;

            // Dispatch an 'input' event to ensure Angular recognizes the change.
            const event = new Event('input', { bubbles: true });
            phoneInput.dispatchEvent(event);
        }
    }
};


const observeDOMChanges = (settings) => {
    const targetNode = document.body;
    const config = { childList: true, subtree: true };

    const callback = (mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                if (settings.isHighlightingEnabled) highlightRows();
                if (settings.isRepositioningEnabled) repositionNotesBox();
                if (settings.isNotesHighlightEnabled) stylePopulatedNotes();
                if (settings.isPackAllProminent) prominentPackAll();
                if (settings.isAutoPackEnabled) autoPackAll();
                if (settings.isUpsPhoneEnabled) populateUpsPhoneNumber(settings.upsPhoneNumber);
                break;
            }
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
};


// Main execution block for the content script.
chrome.storage.sync.get(['isHighlightingEnabled', 'isNotesHighlightEnabled', 'isRepositioningEnabled', 'isPackAllProminent', 'isAutoPackEnabled', 'isUpsPhoneEnabled', 'upsPhoneNumber'], (settings) => {
    // Set default values for any settings that might be undefined.
    const defaults = {
        isHighlightingEnabled: true,
        isNotesHighlightEnabled: true,
        isRepositioningEnabled: true,
        isPackAllProminent: true,
        isAutoPackEnabled: false,
        isUpsPhoneEnabled: true,
        upsPhoneNumber: '111-111-1111'
    };
    const activeSettings = { ...defaults, ...settings };

    // Run initial functions based on settings.
    if (activeSettings.isHighlightingEnabled) highlightRows();
    if (activeSettings.isRepositioningEnabled) repositionNotesBox();
    if (activeSettings.isNotesHighlightEnabled) stylePopulatedNotes();
    if (activeSettings.isPackAllProminent) prominentPackAll();
    // No initial run for auto-pack or phone number as they depend on dynamic conditions.

    // Set up the observer if any feature that depends on it is active.
    observeDOMChanges(activeSettings);
});

// Listen for changes from the options page.
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync') {
        // A simple reload is the most reliable way to apply all state changes.
        window.location.reload();
    }
});
