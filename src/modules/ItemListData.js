"use strict";
/*
  別タブでデータが変更されている可能性があるので、
  改変する際は必ず先にstorage.localからロードする
*/
import Storage from './StorageLocal.js'

const storage = new Storage();

export class ItemListData {
  constructor() {
  }
  async load(){
    const list = await storage.get('list') || [];
    console.log('ItemListData::load',list);
    return list;
  }
  async save(list){
    await storage.set('list', list);
    console.log('ItemListData::save',list);
    return list;
  }
  async find(id){
    const list = await this.load();
    return list.find(item => item.id === id);
  }
  async add(item){
    const list = await this.load();
    const found = await this.find(item.id);
    if(!found){
      list.push(item);
      await this.save(list);
    }
    return list;
  }
  async remove(id){
    let list = await this.load();
    list = list.filter(item => item.id !== id);
    await this.save(list);
    return list;
  }
  async clear(){
    const empty = [];
    await this.save(empty);
    return empty;
  }
}
