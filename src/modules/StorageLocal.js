"use strict";
/*
chrome.storage.local

QUOTA_BYTES
5,242,880
*/
export default class StorageLocal {
  constructor() {
    this.storage = chrome.storage.local;// chrome.storage.local
  }
  async get(key){
    const data = await this.storage.get(key);
    const value = data ? data[key] : null;
    return value;
  }
  async set(key, value){
    let obj = {};
    obj[key] = value;
    return await this.storage.set(obj);
  }
}

