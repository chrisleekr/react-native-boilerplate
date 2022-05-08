/* eslint-disable no-undef */
describe('01-onboarding', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      delete: true // Delete and Reinstall Application Before Launching
    });
  });

  afterAll(async () => {
    await device.terminateApp();
  });

  describe('onboarding page 1', () => {
    it('shows skip button', async () => {
      await expect(element(by.text('Skip'))).toBeVisible();
    });

    it('shows next button', async () => {
      await expect(element(by.text('Next'))).toBeVisible();
    });

    it('clicks next button', async () => {
      await element(by.text('Next')).tap();
    });
  });

  describe('onboarding page 2', () => {
    it('shows skip button', async () => {
      await expect(element(by.text('Skip'))).toBeVisible();
    });

    it('shows next button', async () => {
      await expect(element(by.text('Next'))).toBeVisible();
    });

    it('clicks next button', async () => {
      await element(by.text('Next')).tap();
    });
  });

  describe('onboarding page 3', () => {
    it('shows skip button', async () => {
      await expect(element(by.text('Skip'))).toBeVisible();
    });

    it('shows done button', async () => {
      await expect(element(by.text('Done'))).toBeVisible();
    });

    it('clicks done button', async () => {
      await element(by.text('Done')).tap();
    });

    it('shows home page title', async () => {
      await expect(element(by.text('Starter screen'))).toBeVisible();
    });
  });
});
