"use strict";

import axios from 'axios';

import config from '../modules/Config'
import { BookmarkButton } from '../modules/BookmarkButton'
import { CartButton } from '../modules/CartButton'
import { ItemScraper, ItemScraperRelated } from '../modules/ItemScraper'
import { zenToHan } from '../modules/Util'
import  Loupe  from '../modules/Loupe'
const sanitizer = new Sanitizer();

export class PageDetail {
  constructor($contents) {
    this.$contents = $contents;
  }
  init(){
    // 商品データをscrape
    const scraper = new ItemScraper(this.$contents);
    const item = scraper.item;

    // ブックマークに追加するボタンを挿入
    this.addButton(item);

    // ブックマークに追加するボタンを挿入(関連商品)
    this.addButtonsRelated();

    // 大きい商品画像を表示
    if(config.items.larger_width){
      this.enlargeImages();
    }

    // 画面を大きくしていない場合は拡大鏡を適用
    if(!config.items.larger_width){
      this.applyLoupe();
    }

    // 在庫情報を追加
    if(config.items.show_warehouse_info){
      this.showWarehouseInfo(item.id);
    }

    // やたら大きい文字の注意事項を小さい文字に
    this.killLargeTexts();
  }
  // 商品名の横にボタンを追加
  addButton(item){
    if(item){
      const $parent = document.querySelector('.cart_table h6');
      // 商品名を半角に
      if(config.items.zen_to_han){
        $parent.textContent = zenToHan(item.name);
      }
      this.appendBookmarkAndCartButtons($parent, item);
    }
  }
  // 関連商品にボタンを追加
  addButtonsRelated(){
    const $items = document.querySelectorAll('.kanren form>table');
    $items.forEach($item => {
      // 商品データをscrape
      const scraper = new ItemScraperRelated($item);
      const item = scraper.item;

      // 追加ボタンを描画
      if(item){
        // 商品名を半角に
        if(config.items.zen_to_han){
          $item.querySelector('h6 a').textContent = zenToHan(item.name);
        }
        const $parent = $item.querySelector('h6');
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

  enlargeImages(){
    const $img = document.querySelector('.syosai #imglink img');
    $img.src = $img.src.replace('/img/goods/L/', '/img/goods/C/');
  }

  // 商品画像に拡大鏡を表示
  applyLoupe(){
    const $container = document.querySelector('.syosai #imglink');
    const loupe = new Loupe();
    loupe.applyTo($container);
  }

  // 店舗在庫表示
  async showWarehouseInfo(id){
    try{
      // 本来ポップアップで開く画面のhtmlを非同期で取得
      const url = '/catalog/goods/warehouseinfo.aspx';
      const response = await axios.get(url, {
        params: {
          goods: id
        }
      });
      if(response.status == 200){
        const html = response.data;
        const $tmp = document.createElement('div');
        $tmp.setHTML(html, sanitizer);
    
        // 「店舗情報を取得」の下に在庫表を表示 
        const $table = $tmp.querySelector('#detail_stockinfo table');
        document.querySelector('.detail_stocktitle_').append($table);
      }
    }catch(e){
      console.error(e);
    }
  }

  killLargeTexts(){
    const $elem = document.querySelector('span[style="font-size:21px"]');
    $elem.innerHTML = $elem.innerHTML.replace(/<br>\n<br>/g, '<br>');
    $elem.style.fontSize = 'inherit';
  }
}