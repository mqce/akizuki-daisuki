"use strict";
/**
 * Bookmark
 * 
 * 削除時にブックマーク固有IDが必要なため、メモリ上だけで追加・削除を処理することが不可能
 * 追加する度にbookmarkページをscrapeしてIDを取得する必要がある。
 * 
 */

import axios from 'axios';
import { ItemScraperBookmark } from './ItemScraper.js'
const sanitizer = new Sanitizer();
const URL_BOOKMARK = '/catalog/customer/bookmark.aspx';

export class Bookmark {
  #items = [];
  constructor() {
  }
  async init(){
    return await this.getItems();
  }
  // ブックマークページから商品情報を取得
  async getItems(){
    const data = await this.#get();

    if(data){
      this.#items = this.#parse(data);
      return true;
    }else{
      return false;
    }
  }
  find(id){
    return this.#items.find(item => item.id === id);
  }
  async add(id){
    // 存在確認
    if(this.find(id)) return false;

    // 都度リクエストを投げる
    const data = await this.#get({
      goods : id
    });

    if(data){
      this.#items = this.#parse(data);// this.#itemsを更新
      return true;
    }else{
      return false;
    }
  }
  async remove(id){
    // 存在確認
    const item = this.find(id);
    if(!item || !item.bookmarkId) return false;

    // 都度リクエストを投げる
    // 削除時はブックマークIDと削除キーのペアが必要
    const deleteKey = 'del_' + item.bookmarkId;
    const data = await this.#post({
      [deleteKey] : true,
      'bookmark' : item.bookmarkId,
      'update.x': '更新・削除'// 削除ボタンのnameとvalue
    });

    if(data){
      this.#items = this.#parse(data);// this.#itemsを更新
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
    const $tmp = document.createElement('div');
    $tmp.setHTML(html, sanitizer);
    const $items = $tmp.querySelectorAll('.bookmark_');
    $items.forEach($item => {
      const scraper = new ItemScraperBookmark($item);
      if(scraper.item){
        items.push(scraper.item);
      }
    });
    console.log('bookmark items', items);
    return items;
  }
  async #get(params){
    let data = null;
    try{
      const response = await axios.get(URL_BOOKMARK, {
        params : params
      });
      if(response.status == 200){
        data = response.data;
        if(data.includes('ログインしてください')){
          data = null;
        }
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
      const response = await axios.post(URL_BOOKMARK, form);
      if(response.status == 200){
        data = response.data;
        if(data.includes('ログインしてください')){
          data = null;
        }
      }
    }catch(e){
      console.error(e);
    }
    return data;
  }
}