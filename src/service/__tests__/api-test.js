const mockCreate = jest.fn();
jest.mock('axios', () => ({
  create: mockCreate
}));

let api;
describe('api', () => {
  beforeEach(() => {
    api = require('../api');
  });

  it('creates axios instance', () => {
    expect(mockCreate).toHaveBeenCalledWith({
      baseURL: 'https://nvm-boilerplate.chrislee.kr/api',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  });

  it('returns instance', () => {
    expect(api).toBeDefined();
  });
});
