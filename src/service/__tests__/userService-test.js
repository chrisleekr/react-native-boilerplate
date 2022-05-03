import api from '../api';
import userService from '../userService';

let expectedResponse;
let response;
let mockGet;
let mockPost;

describe('userService', () => {
  beforeEach(() => {
    expectedResponse = {
      status: 200,
      data: {
        result: true
      }
    };
    mockGet = jest.fn().mockResolvedValue({
      data: expectedResponse
    });
    mockPost = jest.fn().mockResolvedValue({
      data: expectedResponse
    });

    jest.spyOn(api, 'get').mockImplementation(mockGet);
    jest.spyOn(api, 'post').mockImplementation(mockPost);
  });

  describe('me', () => {
    beforeEach(async () => {
      response = await userService.me();
    });

    it('triggers mockGet', () => {
      expect(mockGet).toHaveBeenCalledWith('/me', {});
    });

    it('returns expected response', () => {
      expect(response).toStrictEqual(expectedResponse);
    });
  });

  describe('updateMe', () => {
    beforeEach(async () => {
      response = await userService.updateMe({
        email: 'my-email',
        password: 'my-password',
        firstName: 'first-name',
        lastName: 'last-name'
      });
    });

    it('triggers mockPost', () => {
      expect(mockPost).toHaveBeenCalledWith('/me', {
        email: 'my-email',
        password: 'my-password',
        first_name: 'first-name',
        last_name: 'last-name'
      });
    });

    it('returns expected response', () => {
      expect(response).toStrictEqual(expectedResponse);
    });
  });
});
