/* eslint-disable no-undef */
describe('06-my-account', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true
    });
  });

  afterAll(async () => {
    await device.terminateApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('says hello react native', async () => {
    await expect(element(by.text('Hello React Native'))).toBeVisible();
  });
});
