"use strict";
/*
chrome.storage.syncのアイテムごとの容量(QUOTA_BYTES_PER_ITEM)が少ないので、
配列は子要素を1アイテムとして登録する

saveArray('item',[x,y,z]);
->
item1:x,
item2:y,
item3:z

chrome.storage.sync limitations
https://developer.chrome.com/docs/extensions/reference/storage/#property-sync

MAX_ITEMS
512
MAX_WRITE_OPERATIONS_PER_HOUR
1800
MAX_WRITE_OPERATIONS_PER_MINUTE
120
QUOTA_BYTES
102400
QUOTA_BYTES_PER_ITEM
8192
*/
export class Storage {
  constructor() {
    this.storage = chrome.storage.sync;// chrome.storage.local
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
  async getArray(key){
    let arr = [];
    const storage = await this.storage.get();
    Object.keys(storage).forEach( storageKey=> {
      // 引数keyから始まるキーのエントリーを抽出
      const regex = new RegExp("^" + key + "[0-9]+$");
      if(regex.test(storageKey)){
        const item = storage[storageKey];
        arr.push(item);
      }
    });
    return arr;
  }
  async setArray(key, arr){
    const storage = await this.storage.get();

    // 引数keyから始まるキーのエントリーを一度全部削除
    const removeKeys = Object.keys(storage).filter((storageKey) => {
      const regex = new RegExp("^" + key + "[0-9]+$");
      return regex.test(storageKey);
    })
    await this.storage.remove(removeKeys);

    // 配列の各要素に「引数key＋連番」で登録する
    // key="item"の場合：{item1:x, item2:y, ... }
    const obj = this.arrayToSequentialObject(arr, key);
    return await this.storage.set(obj);
  }
  arrayToSequentialObject(arr, key){
    let obj = {};
    let index = 1;
    arr.map(item => {
      obj[key + index] = item;
      index++;
    });
    return obj;
  }
}

