"use strict";
/*

*/
import { Storage } from './Storage.js'

const storage = new Storage();

export class ItemListData {
  constructor() {
    this.list = [];
  }
  async load(){
    this.list = await storage.getArray('list') || [];
    return this.list;
  }
  async save(){
    await storage.setArray('list', this.list);
  }
  find(id){
    return this.list.find(item => item.id === id);
  }
  add(item){
    if(!this.find(item.id)){
      this.list.push(item);
      this.save();
    }
    return this.list;
  }
  remove(id){
    this.list = this.list.filter(item => item.id !== id);
    this.save();
    return this.list;
  }
  clear(){
    this.list = [];
    this.save();
    return this.list;
  }
}
