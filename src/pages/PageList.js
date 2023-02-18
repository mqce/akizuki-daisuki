"use strict";

import { BookmarkButton } from '../modules/BookmarkButton'
import { ItemScraperListPage } from '../modules/ItemScraper.js'
import { zenToHan } from '../modules/Util'

export class PageList {
  constructor($contents, bookmark, config) {
    this.$contents = $contents;
    this.bookmark = bookmark;
    this.config = config;
  }
  init(){
    const $items = document.querySelectorAll('.thumbox');
    $items.forEach($item => {
      // 商品データをscrape
      const scraper = new ItemScraperListPage($item);
      const item = scraper.item;
  
      // 追加ボタンを描画
      if(item){
        if(this.config.zen_to_han){
          $item.querySelector('.thumbox_pc .goods_name_').textContent = zenToHan(item.name);
        }
        $item.innerHTML = $item.innerHTML.replace(/<br>.?\(税込\)/, '(税込)');
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