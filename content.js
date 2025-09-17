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
 * Sets up a MutationObserver to watch for changes in the DOM.
 * This is crucial for dynamic web applications where content is loaded asynchronously.
 * The observer will trigger our modification functions whenever new nodes are added.
 */
const observeDOMChanges = (rowHighlightingEnabled, notesHighlightingEnabled, repositioningEnabled) => {
    // The MutationObserver will watch for changes in the entire document body.
    const targetNode = document.body;

    // Configuration for the observer: we care about child nodes being added or removed.
    const config = { childList: true, subtree: true };

    // Callback function to execute when mutations are observed.
    const callback = (mutationsList, observer) => {
        // We are looking for added nodes that might be the rows/elements we want to modify.
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // If new nodes are added, re-run our modification logic based on the settings.
                if (rowHighlightingEnabled) {
                    highlightRows();
                }
                if(repositioningEnabled){
                    repositionNotesBox();
                }
                if (notesHighlightingEnabled) {
                    stylePopulatedNotes();
                }
                // We only need to run this once per batch of mutations, so we can break.
                break;
            }
        }
    };

    // Create an observer instance linked to the callback function.
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations.
    observer.observe(targetNode, config);
};


// Main execution block for the content script.
// First, check the stored setting to see if the features are enabled.
chrome.storage.sync.get(['isHighlightingEnabled', 'isNotesHighlightEnabled', 'isRepositioningEnabled'], (data) => {
    // Determine if each feature is enabled, defaulting to true if not set.
    const rowHighlightingEnabled = data.isHighlightingEnabled !== false;
    const notesHighlightingEnabled = data.isNotesHighlightEnabled !== false;
    const repositioningEnabled = data.isRepositioningEnabled !== false;


    // Run initial functions based on settings.
    if (rowHighlightingEnabled) {
        highlightRows();
    }
    if(repositioningEnabled){
        repositionNotesBox();
    }
    if (notesHighlightingEnabled) {
        stylePopulatedNotes();
    }

    // Only set up the observer if at least one feature is active.
    if (rowHighlightingEnabled || notesHighlightingEnabled || repositioningEnabled) {
        observeDOMChanges(rowHighlightingEnabled, notesHighlightingEnabled, repositioningEnabled);
    }
});

// Listen for changes from the options page.
// If the user toggles a feature, this will reload the page to apply/remove the modifications.
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && (changes.isHighlightingEnabled || changes.isNotesHighlightEnabled || changes.isRepositioningEnabled)) {
        window.location.reload();
    }
});

