import api from '../api';
import todoService from '../todoService';

let expectedResponse;
let response;
let mockGet;
let mockPost;
let mockPatch;
let mockDelete;

describe('todoService', () => {
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
    mockPatch = jest.fn().mockResolvedValue({
      data: expectedResponse
    });
    mockDelete = jest.fn().mockResolvedValue({
      data: expectedResponse
    });

    jest.spyOn(api, 'get').mockImplementation(mockGet);
    jest.spyOn(api, 'post').mockImplementation(mockPost);
    jest.spyOn(api, 'patch').mockImplementation(mockPatch);
    jest.spyOn(api, 'delete').mockImplementation(mockDelete);
  });

  describe('list', () => {
    beforeEach(async () => {
      response = await todoService.list();
    });

    it('triggers mockGet', () => {
      expect(mockGet).toHaveBeenCalledWith('/todo', {
        order_by: 'updated_at_desc'
      });
    });

    it('returns expected response', () => {
      expect(response).toStrictEqual(expectedResponse);
    });
  });

  describe('postOne', () => {
    beforeEach(async () => {
      response = await todoService.postOne({
        name: 'my-name',
        note: 'my-note',
        state: 'ongoing'
      });
    });

    it('triggers mockPost', () => {
      expect(mockPost).toHaveBeenCalledWith('/todo', {
        name: 'my-name',
        note: 'my-note',
        state: 'ongoing'
      });
    });

    it('returns expected response', () => {
      expect(response).toStrictEqual(expectedResponse);
    });
  });

  describe('patchOne', () => {
    beforeEach(async () => {
      response = await todoService.patchOne({
        id: 1,
        name: 'my-name',
        note: 'my-note',
        state: 'ongoing'
      });
    });

    it('triggers mockPatch', () => {
      expect(mockPatch).toHaveBeenCalledWith('/todo/1', {
        name: 'my-name',
        note: 'my-note',
        state: 'ongoing'
      });
    });

    it('returns expected response', () => {
      expect(response).toStrictEqual(expectedResponse);
    });
  });

  describe('deleteOne', () => {
    beforeEach(async () => {
      response = await todoService.deleteOne({
        id: 1
      });
    });

    it('triggers mockDelete', () => {
      expect(mockDelete).toHaveBeenCalledWith('/todo/1');
    });

    it('returns expected response', () => {
      expect(response).toStrictEqual(expectedResponse);
    });
  });
});
