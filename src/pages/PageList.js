"use strict";

import { ItemScraperListPage } from '../modules/ItemScraper.js'

export class PageList {
  constructor($contents) {
    this.$contents = $contents;
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
    const $button = document.createElement('div');
    $button.classList.add('apl-save-button');
    $button.addEventListener('click', e=>{
      //itemListPanel.add(item);
      alert('TODO')
    });
    $parent.appendChild($button);
  }
}