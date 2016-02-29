import {Promise} from 'es6-promise';

import CatalogBusiness from './business/catalog-business';
import DirectoryBusiness from './business/directory-business';
import Entity from './presentation/entity';
import Collection from './presentation/collection';
import HttpClient from './data-access/http/http-client';
import Catalog from './presentation/catalog';
import BrowserHttpClient from './data-access/http/browser-http-client';
import NodeHttpClient from './data-access/http/node-http-client';


export interface Directory {
  login(username: string, password: string, duration?: number): Promise<boolean>;
  logout(): Promise<boolean>;
  currentUser(): Promise<any>;
  currentUserBelongsTo(groupName: string): Promise<boolean>;
}

export interface Helper {
  isEntity(object: any): boolean;
  isCollection(object: any): boolean;
}

class WakJSC {
  
  public static HttpClient: typeof BrowserHttpClient|typeof NodeHttpClient;
  
  public _httpClient: HttpClient;
  public directory: Directory;
  public helper: Helper;
  
  constructor(host?: string) {
    this._httpClient = new WakJSC.HttpClient({
      apiPrefix: (host || '') + '/rest'
    });

    let directoryBusiness = new DirectoryBusiness({
      wakJSC: this
    });

    this.directory = {
      login: (username, password, duration) => {
        return directoryBusiness.login(username, password, duration);
      },
      logout: () => {
        return directoryBusiness.logout();
      },
      currentUser: () => {
        return directoryBusiness.currentUser();
      },
      currentUserBelongsTo: (group) => {
        return directoryBusiness.currentUserBelongsTo(group);
      }
    };

    this.helper = {
      isEntity: object => {
        return object instanceof Entity;
      },
      isCollection: object => {
        return object instanceof Collection;
      }
    };
  }

  getCatalog(dataClasses?: string[]): Promise<Catalog> {
    let catalogBusiness = new CatalogBusiness({
      wakJSC: this
    });

    return catalogBusiness.get(dataClasses);
  }

  version(): string {
    return '0.0.1';
  }
}

export default WakJSC;
