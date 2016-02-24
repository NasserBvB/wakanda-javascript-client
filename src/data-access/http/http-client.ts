interface RequestOption {
  uri: string;
}

interface GetRequestOption extends RequestOption {
  params?: any;
}

interface PostRequestOption extends RequestOption {
  data?: any;
  binary?: boolean;
}

type RequestInterceptor<T extends RequestOption> = (options: T) => any;
type ResponseInterceptor = (promise: Promise) => Promise;

class HttpClient {

  public prefix: string;
  
  private _getRequestInterceptors: RequestInterceptor<GetRequestOption>[];
  private _postRequestInterceptors: RequestInterceptor<PostRequestOption>[];
  private _getResponseInterceptors: ResponseInterceptor[];
  private _postResponseInterceptors: ResponseInterceptor[];

  constructor({apiPrefix}) {
    this.prefix = apiPrefix;

    this._getRequestInterceptors = [];
    this._postRequestInterceptors = [];
    this._getResponseInterceptors = [];
    this._postResponseInterceptors = [];
  }

  public get(options: GetRequestOption) {
    for (let i = 0; i < this._getRequestInterceptors.length; i++) {
      let interceptor = this._getRequestInterceptors[i];
      let res = interceptor(options);

      if (res !== null && (typeof res !== 'undefined')) {
        return res;
      }
    }

    return null;
  }

  public post(options: PostRequestOption) {
    for (let i = 0; i < this._postRequestInterceptors.length; i++) {
      let interceptor = this._postRequestInterceptors[i];
      let res = interceptor(options);

      if (res !== null && (typeof res !== 'undefined')) {
        return res;
      }
    }

    return null;
  }
  
  /**
   * @return {Promise} Returns either the underlying HTTP request result, or the promise returned by the interceptor if any
   */
  protected responseGet(promise: Promise): Promise {
    //Execute response interceptors

    for(let interceptor of this._getResponseInterceptors) {
      let res = interceptor(promise);
      
      if (res) {
        return res;
      }
    }
    
    return promise;
  }
  
  /**
   * @return {Promise} Returns either the underlying HTTP request result, or the promise returned by the interceptor if any
   */
  protected responsePost(promise: Promise) {
    //Execute response interceptors
    for(let interceptor of this._postResponseInterceptors) {
      let res = interceptor(promise);
      
      if (res) {
        return res;
      }
    }
    
    return promise;
  }

  /**
   * @param {array|string} type - HTTP verb of the request to intercept
   * @param {function} callback - The interceptor function to execute before HTTP request. If it returns something different than null, the underlying HTTP request won't be executed
   * @returns {null|object} Returns null or an object, if an object is returned, the underlying HTTP request won't be executed
   */
  public registerRequestInterceptor(type: string|string[], callback: RequestInterceptor<RequestOption>) {

    let interceptorType = this._interceptorTypeToArray(type);

    interceptorType.forEach(t => {
      if (t === 'get') {
        this._getRequestInterceptors.push(callback);
      }
      else if(t === 'post') {
        this._postRequestInterceptors.push(callback);
      }
    });
  }
  
  public registerResponseInterceptor(type: string|string[], callback: ResponseInterceptor) {
    
    let interceptorType = this._interceptorTypeToArray(type);

    interceptorType.forEach(t => {
      if (t === 'get') {
        this._getResponseInterceptors.push(callback);
      }
      else if(t === 'post') {
        this._postResponseInterceptors.push(callback);
      }
    });
  }

  private _interceptorTypeToArray(type: string|string[]): string[] {
    let interceptorType: string[] = [];

    if (typeof type === 'string') {
      if (!this._isValidInterceptorType(type.toLowerCase())) {
        throw new Error('HttpClient.registerInterceptor: invalid interceptor type');
      }
      else {
        interceptorType.push(type.toLowerCase());
      }
    }
    else if (Array.isArray(type)) {
      type.forEach(t => {
        if (!this._isValidInterceptorType(t.toLowerCase())) {
          throw new Error('HttpClient.registerInterceptor: invalid interceptor type');
        }
        else {
          interceptorType.push(t.toLowerCase());
        }
      });
    }
    else {
      throw new Error('HttpClient.registerInterceptor: type must be a string or an array');
    }

    return interceptorType;
  }

  private _isValidInterceptorType(type: string): boolean {
    let validTypes = ['get', 'post'];

    return validTypes.indexOf(type) !== -1;
  }
}

export default HttpClient;
