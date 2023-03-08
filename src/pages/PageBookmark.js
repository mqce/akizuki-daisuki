"use strict";

import config from '@/modules/Config'
import { CartButton } from '@/modules/CartButton'
import { BookmarkButton } from '@/modules/BookmarkButton'
import { itemScraperBookmark } from '@/modules/ItemScraper.js'
import { zenToHan } from '@/modules/Util'

export class PageBookmark {
  constructor() {
  }
  init(){
    const $items = document.querySelectorAll('.bookmark_');
    $items.forEach($item => {
      // 商品データをscrape
      const item = itemScraperBookmark($item);
  
      // 追加ボタンを描画
      if(item.name){
        if(config.items.zen_to_han){
          $item.querySelector('.goods_name_').textContent = zenToHan(item.name);
        }
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