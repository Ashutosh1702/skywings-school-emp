// Lightweight Axios-compliant HTTP client polyfill
// Ensures zero-dependency execution if npm install has not yet downloaded Axios to node_modules

class InterceptorManager {
  constructor() {
    this.handlers = [];
  }
  use(fulfilled, rejected) {
    this.handlers.push({ fulfilled, rejected });
    return this.handlers.length - 1;
  }
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }
}

class AxiosInstance {
  constructor(defaultConfig = {}) {
    this.defaults = {
      baseURL: '',
      headers: {
        'Content-Type': 'application/json',
      },
      ...defaultConfig,
    };
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager(),
    };
  }

  async request(config) {
    let mergedConfig = {
      ...this.defaults,
      ...config,
      headers: {
        ...this.defaults.headers,
        ...(config.headers || {}),
      },
    };

    // Run request interceptors
    for (const handler of this.interceptors.request.handlers) {
      if (handler && handler.fulfilled) {
        try {
          mergedConfig = (await handler.fulfilled(mergedConfig)) || mergedConfig;
        } catch (err) {
          if (handler.rejected) return handler.rejected(err);
          throw err;
        }
      }
    }

    const fullUrl = mergedConfig.baseURL
      ? `${mergedConfig.baseURL.replace(/\/+$/, '')}/${(mergedConfig.url || '').replace(/^\/+/, '')}`
      : mergedConfig.url;

    // Build URL with query params
    let urlWithParams = fullUrl;
    if (mergedConfig.params) {
      const searchParams = new URLSearchParams();
      Object.entries(mergedConfig.params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, val);
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        urlWithParams += (urlWithParams.includes('?') ? '&' : '?') + queryString;
      }
    }

    const fetchOptions = {
      method: (mergedConfig.method || 'GET').toUpperCase(),
      headers: mergedConfig.headers,
    };

    if (mergedConfig.data && !['GET', 'HEAD'].includes(fetchOptions.method)) {
      fetchOptions.body =
        typeof mergedConfig.data === 'string'
          ? mergedConfig.data
          : JSON.stringify(mergedConfig.data);
    }

    let response;
    try {
      const res = await fetch(urlWithParams, fetchOptions);
      const data = await res.json().catch(() => ({}));

      response = {
        data,
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
        config: mergedConfig,
        request: {},
      };

      if (!res.ok) {
        const error = new Error(data.message || `Request failed with status ${res.status}`);
        error.response = response;
        error.config = mergedConfig;
        error.isAxiosError = true;
        throw error;
      }
    } catch (err) {
      // Run response interceptor error handlers
      for (const handler of this.interceptors.response.handlers) {
        if (handler && handler.rejected) {
          return handler.rejected(err);
        }
      }
      throw err;
    }

    // Run response interceptors fulfilled
    for (const handler of this.interceptors.response.handlers) {
      if (handler && handler.fulfilled) {
        response = (await handler.fulfilled(response)) || response;
      }
    }

    return response;
  }

  get(url, config = {}) {
    return this.request({ ...config, method: 'GET', url });
  }

  delete(url, config = {}) {
    return this.request({ ...config, method: 'DELETE', url });
  }

  head(url, config = {}) {
    return this.request({ ...config, method: 'HEAD', url });
  }

  options(url, config = {}) {
    return this.request({ ...config, method: 'OPTIONS', url });
  }

  post(url, data, config = {}) {
    return this.request({ ...config, method: 'POST', url, data });
  }

  put(url, data, config = {}) {
    return this.request({ ...config, method: 'PUT', url, data });
  }

  patch(url, data, config = {}) {
    return this.request({ ...config, method: 'PATCH', url, data });
  }
}

const axios = new AxiosInstance();
axios.create = (config) => new AxiosInstance(config);
axios.isAxiosError = (err) => !!(err && err.isAxiosError);

export default axios;
export { AxiosInstance };

