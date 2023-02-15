"use strict";

import axios from 'axios';
import { ItemScraperBookmark } from './ItemScraper.js'
const sanitizer = new Sanitizer();

export class Bookmark {

  constructor() {

  }
  // ブックマークページから商品情報を取得
  async scrape(){
    const data = await this.fetch();
    if(data){
      const items = this.parse(data);
      console.log(items);
    }

  }
  // ブックマークページのHTMLを非同期で取得
  async fetch(){
    let data = null;
    try{
      const url = '/catalog/customer/bookmark.aspx';
      const response = await axios.get(url);
      console.log(response);
      if(response.status == 200){
        data = response.data;
      }
    }catch(e){
      console.error(e);
    }
    return data;
  }
  // HTMLをparseして商品情報を取得
  parse(html){
    let items = [];
    const $tmp = document.createElement('div');
    $tmp.setHTML(html, sanitizer);
    const $items = $tmp.querySelectorAll('.bookmark_');
    $items.forEach($item => {
      const scraper = new ItemScraperBookmark($item);
      items.push(scraper.item);
    });
    return items;
  }

}