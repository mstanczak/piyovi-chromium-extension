# Piyovi Enhancement Suite

Piyovi Enhancement Suite is a browser extension for Google Chrome designed to improve the user experience on `piyovi.io`. It adds several quality-of-life features to the interface, making it easier to manage and view important information at a glance.

## Key Features

- **Row Highlighting**: Automatically highlights rows that have a "Yes" value in the "DG" column, making them stand out.
- **Notes Box Repositioning**: Moves the "Notes" input box to appear directly after the "Tax ID" field for a more logical workflow.
- **Populated Notes Styling**: Adds a distinct visual style to the "Notes" box when it contains text, ensuring you don't miss important information.
- **Automatic Carrier Phone Number**: For shipments with UPS or FedEx, this feature automatically populates the phone number field with a default value if it's empty.

## Installation

To install the Piyovi Enhancement Suite, follow these steps:

1.  Clone or download this repository to your local machine.
2.  Open Google Chrome and navigate to `chrome://extensions`.
3.  Enable "Developer mode" using the toggle switch in the top-right corner.
4.  Click the "Load unpacked" button.
5.  Select the directory where you cloned or downloaded the extension.

## Configuration

All features can be configured from the extension's options page. To access it:

1.  Click the puzzle piece icon in your Chrome toolbar to open the extensions menu.
2.  Find "Piyovi Enhancement Suite" and click the three-dots menu next to it.
3.  Select "Options".

From the options page, you can enable or disable each feature individually using the toggle switches. You can also set a custom phone number to be used for the automatic carrier phone number feature.

## For Developers

This project is a standard Chrome extension. Below is a brief overview of the key files:

-   `manifest.json`: The core configuration file for the Chrome extension. It defines permissions, content scripts, and other metadata.
-   `content.js`: This is the main script that runs on `piyovi.io` pages. It contains all the logic for DOM manipulation, such as highlighting rows and repositioning elements.
-   `background.js`: The service worker for the extension. It currently handles the initialization of default settings on installation.
-   `options.html`: The structure for the extension's options page.
-   `options.js`: Contains the logic for the options page, including saving and loading user settings.
-   `options.css`: Styles for the options page.
-   `custom_styles.css`: This file is injected into `piyovi.io` pages to apply custom styles.