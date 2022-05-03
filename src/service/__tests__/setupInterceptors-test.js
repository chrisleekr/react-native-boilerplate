import api from '../api';

import setupInterceptors from '../setupInterceptors';
import TokenService from '../tokenService';

let mockRequestUse = jest.fn();
let mockResponseUse = jest.fn();

jest.mock('../api');
let mockPost;

let response;
let error;

describe('setupInterceptors', () => {
  beforeEach(() => {
    TokenService.getRefreshToken = jest.fn().mockImplementation(() => {
      return Promise.resolve('my-refresh-token');
    });

    TokenService.updateToken = jest.fn().mockImplementation(() => {
      return Promise.resolve(true);
    });

    mockResponseUse = jest.fn((fn, _error) => fn());

    jest
      .spyOn(api.interceptors.response, 'use')
      .mockImplementation(mockResponseUse);
  });

  describe('interceptors.request.use', () => {
    describe('success', () => {
      describe('getAccessToken returns token', () => {
        beforeEach(async () => {
          mockRequestUse = jest.fn((fn, _error) => fn());

          jest
            .spyOn(api.interceptors.request, 'use')
            .mockImplementation(mockRequestUse);

          TokenService.getAccessToken = jest.fn().mockImplementation(() => {
            return Promise.resolve('my-token');
          });

          // Setup interceptors. This is just initialisation
          setupInterceptors({});

          // This is actual test.
          response = await mockRequestUse.mock.calls[0][0]({
            headers: {Authorization: ''}
          });
        });

        it('triggers requestUse', () => {
          expect(mockRequestUse).toHaveBeenCalled();
        });

        it('triggers TokenService.getAccessToken', () => {
          expect(TokenService.getAccessToken).toHaveBeenCalled();
        });

        it('returns expected response', () => {
          expect(response).toStrictEqual({
            headers: {Authorization: 'my-token'}
          });
        });
      });

      describe('getAccessToken returns undefined', () => {
        beforeEach(async () => {
          mockRequestUse = jest.fn((fn, _error) => fn());

          jest
            .spyOn(api.interceptors.request, 'use')
            .mockImplementation(mockRequestUse);

          TokenService.getAccessToken = jest.fn().mockImplementation(() => {
            return Promise.resolve(undefined);
          });

          // Setup interceptors. This is just initialisation
          setupInterceptors({});

          // This is actual test.
          response = await mockRequestUse.mock.calls[0][0]({
            headers: {Authorization: ''}
          });
        });

        it('triggers requestUse', () => {
          expect(mockRequestUse).toHaveBeenCalled();
        });

        it('triggers TokenService.getAccessToken', () => {
          expect(TokenService.getAccessToken).toHaveBeenCalled();
        });

        it('returns expected response', () => {
          expect(response).toStrictEqual({
            headers: {Authorization: ''}
          });
        });
      });
    });

    describe('error', () => {
      beforeEach(async () => {
        mockRequestUse = jest.fn((fn, _error) => fn());

        jest
          .spyOn(api.interceptors.request, 'use')
          .mockImplementation(mockRequestUse);

        TokenService.getAccessToken = jest.fn().mockImplementation(() => {
          return Promise.resolve(undefined);
        });

        // Setup interceptors. This is just initialisation
        setupInterceptors({});

        // This is actual test.
        try {
          response = await mockRequestUse.mock.calls[0][1](new Error('error'));
        } catch (e) {
          error = e;
        }
      });

      it('triggers requestUse', () => {
        expect(mockRequestUse).toHaveBeenCalled();
      });

      it('returns expected response', () => {
        expect(error).toStrictEqual(new Error('error'));
      });
    });
  });

  describe('interceptors.response.use', () => {
    describe('success', () => {
      beforeEach(async () => {
        mockResponseUse = jest.fn((fn, _error) => fn());

        jest
          .spyOn(api.interceptors.response, 'use')
          .mockImplementation(mockResponseUse);

        // Setup interceptors. This is just initialisation
        setupInterceptors({});

        // This is actual test.
        response = await mockResponseUse.mock.calls[0][0]({
          my: 'response'
        });
      });

      it('triggers responseUse', () => {
        expect(mockResponseUse).toHaveBeenCalled();
      });

      it('returns expected response', () => {
        expect(response).toStrictEqual({
          my: 'response'
        });
      });
    });

    describe('error', () => {
      describe('when url is  /user/login', () => {
        beforeEach(async () => {
          mockResponseUse = jest.fn((fn, _error) => fn());

          jest
            .spyOn(api.interceptors.response, 'use')
            .mockImplementation(mockResponseUse);

          // Setup interceptors. This is just initialisation
          setupInterceptors({});

          // This is actual test.
          try {
            response = await mockResponseUse.mock.calls[0][1]({
              config: {
                url: '/user/login'
              }
            });
          } catch (e) {
            error = e;
          }
        });

        it('triggers responseUse', () => {
          expect(mockResponseUse).toHaveBeenCalled();
        });

        it('returns expected response', () => {
          expect(error).toStrictEqual({
            config: {
              url: '/user/login'
            }
          });
        });
      });

      describe('when url is not /user/login', () => {
        describe('when response does not exist', () => {
          describe('when url is  /user/login', () => {
            describe('when response is not defined', () => {
              beforeEach(async () => {
                mockResponseUse = jest.fn((fn, _error) => fn());

                jest
                  .spyOn(api.interceptors.response, 'use')
                  .mockImplementation(mockResponseUse);

                // Setup interceptors. This is just initialisation
                setupInterceptors({});

                // This is actual test.
                try {
                  response = await mockResponseUse.mock.calls[1][1]({
                    config: {
                      url: '/me'
                    },
                    response: undefined
                  });
                } catch (e) {
                  error = e;
                }
              });

              it('returns expected response', () => {
                expect(error).toStrictEqual({
                  config: {
                    url: '/me'
                  },
                  response: undefined
                });
              });
            });

            describe('when response is defined', () => {
              describe('when status is not 401', () => {
                beforeEach(async () => {
                  mockResponseUse = jest.fn((fn, _error) => fn());

                  jest
                    .spyOn(api.interceptors.response, 'use')
                    .mockImplementation(mockResponseUse);

                  // Setup interceptors. This is just initialisation
                  setupInterceptors({});

                  // This is actual test.
                  try {
                    response = await mockResponseUse.mock.calls[1][1]({
                      config: {
                        url: '/me'
                      },
                      response: {
                        status: 201,
                        data: {result: true}
                      }
                    });
                  } catch (e) {
                    error = e;
                  }
                });

                it('returns expected response', () => {
                  expect(error).toStrictEqual({
                    config: {
                      url: '/me'
                    },
                    response: {
                      status: 201,
                      data: {result: true}
                    }
                  });
                });
              });

              describe('when status is 401', () => {
                describe('when retry is true', () => {
                  beforeEach(async () => {
                    mockResponseUse = jest.fn((fn, _error) => fn());

                    jest
                      .spyOn(api.interceptors.response, 'use')
                      .mockImplementation(mockResponseUse);

                    // Setup interceptors. This is just initialisation
                    setupInterceptors({});

                    // This is actual test.
                    try {
                      response = await mockResponseUse.mock.calls[1][1]({
                        config: {
                          url: '/me',
                          _retry: true
                        },
                        response: {
                          status: 401,
                          data: {result: true}
                        }
                      });
                    } catch (e) {
                      error = e;
                    }
                  });

                  it('returns expected response', () => {
                    expect(error).toStrictEqual({
                      config: {
                        url: '/me',
                        _retry: true
                      },
                      response: {
                        status: 401,
                        data: {result: true}
                      }
                    });
                  });
                });

                describe('when retry is false', () => {
                  describe('when /refresh-token is successful', () => {
                    beforeEach(async () => {
                      mockResponseUse = jest.fn((fn, _error) => fn());

                      jest
                        .spyOn(api.interceptors.response, 'use')
                        .mockImplementation(mockResponseUse);

                      mockPost = jest.fn().mockResolvedValue({
                        data: {
                          status: 200,
                          data: {
                            auth_key: 'new-access-token',
                            refresh_auth_key: 'new-refresh-tken'
                          }
                        }
                      });
                      jest.spyOn(api, 'post').mockImplementation(mockPost);

                      // Setup interceptors. This is just initialisation
                      setupInterceptors({});

                      // This is actual test.
                      response = await mockResponseUse.mock.calls[1][1]({
                        config: {
                          url: '/me',
                          _retry: false
                        },
                        response: {
                          status: 401,
                          data: {result: true}
                        }
                      });
                    });

                    it('triggers TokenService.getRefreshToken', () => {
                      expect(TokenService.getRefreshToken).toHaveBeenCalled();
                    });

                    it('triggers TokenService.updateToken', () => {
                      expect(TokenService.updateToken).toHaveBeenCalled();
                    });
                  });

                  describe('when /refresh-token is failed', () => {
                    beforeEach(async () => {
                      mockResponseUse = jest.fn((fn, _error) => fn());

                      jest
                        .spyOn(api.interceptors.response, 'use')
                        .mockImplementation(mockResponseUse);

                      mockPost = jest.fn().mockRejectedValue({
                        data: {
                          status: 500,
                          data: {msg: 'error'}
                        }
                      });
                      jest.spyOn(api, 'post').mockImplementation(mockPost);

                      // Setup interceptors. This is just initialisation
                      setupInterceptors({});

                      // This is actual test.
                      try {
                        response = await mockResponseUse.mock.calls[1][1]({
                          config: {
                            url: '/me',
                            _retry: false
                          },
                          response: {
                            status: 401,
                            data: {result: true}
                          }
                        });
                      } catch (e) {
                        error = e;
                      }
                    });

                    it('returns expected error', () => {
                      expect(error).toStrictEqual({
                        data: {
                          status: 500,
                          data: {msg: 'error'}
                        }
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
