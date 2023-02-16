"use strict";

import { BookmarkButton } from '../modules/BookmarkButton'
import { ItemScraperListPage } from '../modules/ItemScraper.js'

export class PageList {
  constructor($contents, bookmark) {
    this.$contents = $contents;
    this.bookmark = bookmark;
  }
  init(){
    const $items = document.querySelectorAll('.thumbox');
    $items.forEach($item => {
      // 商品データをscrape
      const scraper = new ItemScraperListPage($item);
      const item = scraper.item;
  
      // 追加ボタンを描画
      if(item){
        const $parent = $item;
        this.appendAddButton($parent, item);
      }
    })
  }
  appendAddButton($parent, item){
    const button = new BookmarkButton(item, this.bookmark);
    const $button = button.create();
    $parent.appendChild($button);
  }
}