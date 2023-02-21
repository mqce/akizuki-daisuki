"use strict";

/**
 * config.htmlの設定値をStorageに読み書きする
 */
class Config {
  items = {};
  async load(){
    const defaults = {
      larger_width : true,
      zen_to_han : true,
      show_warehouse_info : true,
      slim_header : false,
    };
    const items = await chrome.storage.sync.get();
    Object.keys(defaults).forEach( key => {
      if(!(key in items)){
        // storageにキーが無い場合は初期値を書き込む
        items[key] = defaults[key];
        this.set(key, defaults[key]);
      }
    });
    this.items = items;
    return items;
  }
  async set(key, value){
    return await chrome.storage.sync.set({[key]: value});
  }
}

const config = new Config();
export default config;