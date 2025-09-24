from playwright.sync_api import sync_playwright, expect
import os

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Navigate to the local options page
        options_path = os.path.abspath('options.html')
        page.goto(f'file://{options_path}')

        # Wait for the page to load
        expect(page.locator('.header h1')).to_have_text('Piyovi Enhancement Suite')

        # Take a screenshot of the initial state
        page.screenshot(path='jules-scratch/verification/01_initial_state.png')

        # Find the "Default UPS Phone Number" toggle's label and click it
        ups_phone_toggle_label = page.locator('.toggle-switch:has(input#enable-ups-phone-toggle)')
        ups_phone_toggle_label.click()

        # Verify that the nested card is now visible
        nested_card = page.locator('#custom-ups-phone-container')
        expect(nested_card).to_be_visible()

        # Take a screenshot of the page with the nested card visible
        page.screenshot(path='jules-scratch/verification/02_nested_card_visible.png')

        # Click the toggle again to hide the card
        ups_phone_toggle_label.click()

        # Verify that the nested card is now hidden
        expect(nested_card).to_be_hidden()

        # Take a screenshot of the page with the nested card hidden again
        page.screenshot(path='jules-scratch/verification/03_nested_card_hidden.png')

        browser.close()

if __name__ == '__main__':
    run_verification()