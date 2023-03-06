"use strict";

import config from '@/modules/Config'
import { CartButton } from '@/modules/CartButton'
import { BookmarkButton } from '@/modules/BookmarkButton'
import { ItemScraperListPage } from '@/modules/ItemScraper.js'
import { zenToHan } from '@/modules/Util'

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
        if(config.items.zen_to_han){
          $item.querySelector('.thumbox_pc .goods_name_').textContent = zenToHan(item.name);
        }
        $item.innerHTML = $item.innerHTML.replace(/<br>.?\(税込\)/, '(税込)');
        const $parent = $item;
        this.appendBookmarkAndCartButtons($parent, item);
      }
    })
  }
  appendBookmarkAndCartButtons($parent, item){
    const $elem = document.createElement('div');
    $elem.classList.add('action-buttons');
    $parent.appendChild($elem);
    this.appendBookmarkButton($elem, item);
    this.appendCartButton($elem, item);
  }

  appendBookmarkButton($parent, item){
    const button = new BookmarkButton(item);
    const $button = button.create();
    $parent.appendChild($button);
  }

  appendCartButton($parent, item){
    const button = new CartButton(item);
    const $button = button.create();
    $parent.appendChild($button);
  }
}