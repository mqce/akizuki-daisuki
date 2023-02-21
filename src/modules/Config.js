"use strict";

/**
 * config.htmlの設定値をStorageに読み書きする
 */
export class Config {
  static async load(){
    const defaults = {
      larger_width : true,
      zen_to_han : true,
      show_warehouse_info : true,
      slim_header : false,
    };
    const storageData = await chrome.storage.sync.get();
    Object.keys(defaults).forEach( key => {
      if(!(key in storageData)){
        // storageにキーが無い場合は初期値を書き込む
        storageData[key] = defaults[key];
        this.set(key, defaults[key]);
      }
    });
    return storageData;
  }
  static async set(key, value){
    return await chrome.storage.sync.set({[key]: value});
  }
}