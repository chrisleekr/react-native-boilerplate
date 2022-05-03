const reactNativeBootsplashMock = {
  hide: jest.fn().mockResolvedValueOnce(),
  show: jest.fn().mockResolvedValueOnce(),
  getVisibilityStatus: jest.fn().mockResolvedValue('hidden')
};

module.exports = reactNativeBootsplashMock;
