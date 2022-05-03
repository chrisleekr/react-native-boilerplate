import api from '../api';
import authService from '../authService';

let response;
let mockPost;

describe('authService', () => {
  beforeEach(() => {
    mockPost = jest.fn().mockResolvedValue({
      data: {
        status: 200,
        data: {
          some: 'data'
        }
      }
    });
    jest.spyOn(api, 'post').mockImplementation(mockPost);
  });

  describe('login', () => {
    beforeEach(async () => {
      response = await authService.login({
        username: 'my-username',
        password: 'my-password'
      });
    });

    it('triggers mockPost', () => {
      expect(mockPost).toHaveBeenCalledWith('/user/login', {
        username: 'my-username',
        password: 'my-password'
      });
    });

    it('returns expected response', () => {
      expect(response).toStrictEqual({
        status: 200,
        data: {some: 'data'}
      });
    });
  });

  describe('register', () => {
    beforeEach(async () => {
      response = await authService.register({
        email: 'my-email',
        username: 'my-username',
        password: 'my-password',
        firstName: 'first-name',
        lastName: 'last-name'
      });
    });

    it('triggers mockPost', () => {
      expect(mockPost).toHaveBeenCalledWith('/user/register', {
        email: 'my-email',
        username: 'my-username',
        password: 'my-password',
        first_name: 'first-name',
        last_name: 'last-name'
      });
    });

    it('returns expected response', () => {
      expect(response).toStrictEqual({
        status: 200,
        data: {some: 'data'}
      });
    });
  });

  describe('password-reset-request', () => {
    beforeEach(async () => {
      response = await authService.passwordResetRequest({
        email: 'my-email'
      });
    });

    it('triggers mockPost', () => {
      expect(mockPost).toHaveBeenCalledWith('/user/password-reset-request', {
        email: 'my-email'
      });
    });

    it('returns expected response', () => {
      expect(response).toStrictEqual({
        status: 200,
        data: {some: 'data'}
      });
    });
  });
});
