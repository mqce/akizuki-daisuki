"use strict";
/**
 * Cart
 * 
 */

import axios from 'axios';
import { ItemScraperCart } from './ItemScraper.js'
const sanitizer = new Sanitizer();
const URL = '/catalog/cart/cart.aspx';

class Cart {
  items = [];
  constructor() {
  }
  async load(){
    return await this.getItems();
  }
  // ブックマークページから商品情報を取得
  async getItems(){
    const data = await this.#get();

    if(data){
      this.items = this.#parse(data);
      return true;
    }else{
      return false;
    }
  }
  get length(){
    return this.items.length;
  }
  find(id){
    return this.items.find(item => item.id === id);
  }
  async add(id){
    // 存在確認
    if(this.find(id)) return false;

    // 都度リクエストを投げる
    const data = await this.#post({
      [id + '_qty'] : 1,
      goods : id
    });

    if(data){
      this.items = this.#parse(data);// this.itemsを更新
      return true;
    }else{
      return false;
    }
  }
  async remove(id){
    // 存在確認
    const item = this.find(id);
    if(!item || !item.specificId) return false;

    // 都度リクエストを投げる
    const data = await this.#post({
      ['rowcart'+item.row] : item.specificId,
      ['rowgoods'+item.row] : item.id,
      ['del'+item.row+'.x'] : 1,
      ['del'+item.row+'.y'] : 1,
      'refresh': true,
    });

    if(data){
      this.items = this.#parse(data);// this.itemsを更新
      return true;
    }else{
      return false;
    }
  }
  clear(){

  }
  // HTMLをparseして商品情報を取得
  #parse(html){
    let items = [];
    let i = 0;
    const $items = this.#getItemsDomFromHTML(html);
    $items.forEach($item => {
      if($item.querySelector('.cart_tdcb')){
        const scraper = new ItemScraperCart($item);
        if(scraper.item){
          const item = scraper.item;
          item.row = ++i;
          items.push(item);
        }
      }
    });
    console.log('cart items', items);
    return items;
  }
  #getItemsDomFromHTML(html){
    const $tmp = document.createElement('div');
    $tmp.setHTML(html, sanitizer);

    /*
    // POST用パラメータ
    this.t2 = $tmp.querySelector('input[name="t2"]')?.value;
    this.t3 = $tmp.querySelector('input[name="t3"]')?.value;
    */
    const $items = $tmp.querySelectorAll('.cart_table tr');
    return $items;
  }
  async #get(params){
    let data = null;
    try{
      const response = await axios.get(URL, {
        params : params
      });
      if(response.status == 200){
        data = response.data;
      }
    }catch(e){
      console.error(e);
    }
    return data;
  }
  async #post(params){
    let data = null;
    try{
      const form = new FormData();
      for (let [key, value] of Object.entries(params)) {
        form.append(key, value);
      }
      const response = await axios.post(URL, form);
      if(response.status == 200){
        data = response.data;
      }
    }catch(e){
      console.error(e);
    }
    return data;
  }
}


const cart = new Cart();
export default cart;