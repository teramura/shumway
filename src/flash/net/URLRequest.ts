/**
 * Copyright 2014 Mozilla Foundation
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// Class: URLRequest
module Shumway.AVMX.AS.flash.net {
  import notImplemented = Shumway.Debug.notImplemented;
  import asCoerceString = Shumway.AVMX.asCoerceString;

  export class URLRequest extends ASObject {
    
    // Called whenever the class is initialized.
    static classInitializer: any = null;
    
    // List of static symbols to link.
    static classSymbols: string [] = null; // [];

    // List of instance symbols to link.
    static bindings: string [] = null;

    constructor (url: string = null) {
      super();
      this._url = asCoerceString(url);
      this._method = 'GET';
      this._data = null;
      this._digest = null;
      this._contentType = 'application/x-www-form-urlencoded';
      this._requestHeaders = [];
      this._checkPolicyFile = true;
    }

    _checkPolicyFile: boolean;

    // JS -> AS Bindings
    
    // AS -> JS Bindings
    
    private _url: string;
    private _data: ASObject;
    private _method: string;
    private _contentType: string;
    private _requestHeaders: any [];
    private _digest: string;
    get url(): string {
      return this._url;
    }
    set url(value: string) {
      value = asCoerceString(value);
      this._url = value;
    }
    get data(): ASObject {
      return this._data;
    }
    set data(value: ASObject) {
      this._data = value;
    }
    get method(): string {
      return this._method;
    }
    set method(value: string) {
      value = asCoerceString(value);
      if (value !== 'get' && value !== 'GET' &&
          value !== 'post' && value !== 'POST') {
        this.securityDomain.throwError('ArgumentError', Errors.InvalidArgumentError);
      }
      this._method = value;
    }
    get contentType(): string {
      return this._contentType;
    }
    set contentType(value: string) {
      value = asCoerceString(value);
      this._contentType = value;
    }
    get requestHeaders(): any [] {
      return this._requestHeaders;
    }
    set requestHeaders(value: any []) {
      if (!Array.isArray(value)) {
        this.securityDomain.throwError('ArgumentError', Errors.InvalidArgumentError, "value");
      }
      this._requestHeaders = value;
    }
    get digest(): string {
      return this._digest;
    }
    set digest(value: string) {
      value = asCoerceString(value);
      this._digest = value;
    }

    _toFileRequest(): any {
      var obj: any = {};
      obj.url = this._url;
      obj.method = this._method;
      obj.checkPolicyFile = this._checkPolicyFile;
      if (this._data) {
        obj.mimeType = this._contentType;
        if (this.securityDomain.flash.utils.ByteArray.axClass.axIsType(this._data)) {
          obj.data = <ASObject><any>
            new Uint8Array((<any> this._data)._buffer, 0, (<any> this._data).length);
        } else {
          var data = this._data.axGetPublicProperty("toString").call(this._data);
          if (this._method === 'GET') {
            var i = obj.url.lastIndexOf('?');
            obj.url = (i < 0 ? obj.url : obj.url.substring(0, i)) + '?' + data;
          } else {
            obj.data = data;
          }
        }
      }
      return obj;
    }

  }
}
