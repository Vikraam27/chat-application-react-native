import Token from '../utils/AsyncStorage';

/* eslint-disable no-undef */
const baseUrl = 'https://mychat-api-dev.herokuapp.com';
const newsApiUrl = 'https://newsdata.io/api/1/news?apikey=pub_24158c526e30588218db835c18587093386b&country=us';

class FetchAPI {
  static async fetchApi(path, settings, accessToken, contentType = 'application/json') {
    const response = await fetch(`${baseUrl}${path}`, {
      headers: {
        Accept: 'application/json, */*',
        'Content-Type': contentType,
        Authorization: `Bearer ${accessToken}`,
      },
      ...settings,
    });

    return response.json();
  }

  static async generateNewAccessToken() {
    const refreshToken = await Token.Get('refreshToken');
    const res = await this.fetchApi('/auth', {
      method: 'PUT',
      body: JSON.stringify({
        refreshToken,
      }),
    });
    await Token.Set('accessToken', res.data.accessToken);
    return res.data.accessToken;
  }

  static async registerUser(data) {
    const res = await this.fetchApi('/register', {
      method: 'POST',
      body: JSON.stringify({
        username: data.username,
        fullname: data.fullname,
        email: data.email,
        gender: data.gender,
        status: data.status,
        password: data.password,
      }),
    });

    return res;
  }

  static async reqOtp(token) {
    const res = await this.fetchApi('/req-otp', {
      method: 'POST',
      body: JSON.stringify({
        token,
      }),
    });

    return res;
  }

  static async login(data) {
    const res = await this.fetchApi('/auth', {
      method: 'POST',
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    return res;
  }

  static async verifyOtp(otp, token) {
    const res = await this.fetchApi('/verifyotp', {
      method: 'POST',
      body: JSON.stringify({
        otp,
        token,
      }),
    });

    return res;
  }

  static async logOut(refreshToken) {
    const res = await this.fetchApi('/auth', {
      method: 'DELETE',
      body: JSON.stringify({
        refreshToken,
      }),
    });

    return res;
  }

  static async getUserProfile(accessToken) {
    const res = await this.fetchApi('/profile', {
      method: 'GET',
    }, accessToken);

    if (res.message === 'Token maximum age exceeded') {
      const newAccessToken = await this.generateNewAccessToken();
      const newRes = await this.fetchApi('/profile', {
        method: 'GET',
      }, newAccessToken);

      return newRes;
    }
    return res;
  }

  static async updateProfilePicture(data, accessToken) {
    const request = await this.fetchApi('/upload-profile-pict', {
      method: 'POST',
      body: data,
    }, accessToken, 'multipart/form-data');

    if (request.message === 'Token maximum age exceeded') {
      const newAccessToken = await this.generateNewAccessToken();
      const newRequest = await this.fetchApi('/upload-profile-pict', {
        method: 'POST',
        body: data,
      }, newAccessToken, 'multipart/form-data');

      return newRequest;
    }

    return request;
  }

  static async updateProfileInformation(data, accessToken) {
    const request = await this.fetchApi('/profile', {
      method: 'PUT',
      body: JSON.stringify({
        fullname: data.fullname,
        gender: data.gender,
        status: data.status,
      }),
    }, accessToken);

    if (request.message === 'Token maximum age exceeded') {
      const newAccessToken = await this.generateNewAccessToken();
      const newRequest = await this.fetchApi('/profile', {
        method: 'PUT',
        body: JSON.stringify({
          fullname: data.fullname,
          gender: data.gender,
          status: data.status,
        }),
      }, newAccessToken);

      return newRequest;
    }

    return request;
  }

  static async searchUser(query, accessToken) {
    const res = await this.fetchApi(`/search-user?q=${query.toLowerCase()}`, {
      method: 'GET',
    }, accessToken);

    if (res.message === 'Token maximum age exceeded') {
      const newAccessToken = await this.generateNewAccessToken();
      const newRes = await this.fetchApi(`/search-user?q=${query}`, {
        method: 'GET',
      }, newAccessToken);

      return newRes;
    }
    return res;
  }

  static async createRoom(participant, accessToken) {
    const request = await this.fetchApi('/room', {
      method: 'POST',
      body: JSON.stringify({
        participant,
      }),
    }, accessToken);

    if (request.message === 'Token maximum age exceeded') {
      const newAccessToken = await this.generateNewAccessToken();
      const newRequest = await this.fetchApi('/room', {
        method: 'POST',
        body: JSON.stringify({
          participant,
        }),
      }, newAccessToken);

      return newRequest;
    }

    return request;
  }

  static async getRoomDetails(roomId, accessToken) {
    const res = await this.fetchApi(`/room/${roomId}`, {
      method: 'GET',
    }, accessToken);

    if (res.message === 'Token maximum age exceeded') {
      const newAccessToken = await this.generateNewAccessToken();
      const newRes = await this.fetchApi(`/room/${roomId}`, {
        method: 'GET',
      }, newAccessToken);

      return newRes;
    }
    return res;
  }

  static async getAllRooms(accessToken) {
    const res = await this.fetchApi('/room', {
      method: 'GET',
    }, accessToken);

    if (res.message === 'Token maximum age exceeded') {
      const newAccessToken = await this.generateNewAccessToken();
      const newRes = await this.fetchApi('/room', {
        method: 'GET',
      }, newAccessToken);

      return newRes;
    }
    return res;
  }

  static async postMessage(message, messageType, roomId, accessToken) {
    const request = await this.fetchApi(`/room/${roomId}/message`, {
      method: 'POST',
      body: JSON.stringify({
        message,
        messageType,
      }),
    }, accessToken);

    if (request.message === 'Token maximum age exceeded') {
      const newAccessToken = await this.generateNewAccessToken();
      const newRequest = await this.fetchApi(`/room/${roomId}/message`, {
        method: 'POST',
        body: JSON.stringify({
          message,
          messageType,
        }),
      }, newAccessToken);

      return newRequest;
    }

    return request;
  }

  static async uploadPictureMessage(data, roomId, accessToken) {
    const request = await this.fetchApi(`/room/${roomId}/message/image`, {
      method: 'POST',
      body: data,
    }, accessToken, 'multipart/form-data');

    if (request.message === 'Token maximum age exceeded') {
      const newAccessToken = await this.generateNewAccessToken();
      const newRequest = await this.fetchApi(`/room/${roomId}/message/image`, {
        method: 'POST',
        body: data,
      }, newAccessToken, 'multipart/form-data');

      return newRequest;
    }

    return request;
  }

  static async uploadDocumentMessage(data, roomId, accessToken) {
    const request = await this.fetchApi(`/room/${roomId}/message/document`, {
      method: 'POST',
      body: data,
    }, accessToken, 'multipart/form-data');

    if (request.message === 'Token maximum age exceeded') {
      const newAccessToken = await this.generateNewAccessToken();
      const newRequest = await this.fetchApi(`/room/${roomId}/message/document`, {
        method: 'POST',
        body: data,
      }, newAccessToken, 'multipart/form-data');

      return newRequest;
    }

    return request;
  }

  static async getAllNews(category, page) {
    const request = await fetch(`${newsApiUrl}${category === 'all' ? '' : `&category=${category}`}&page=${page}`);

    return request.json();
  }
}

export default FetchAPI;
