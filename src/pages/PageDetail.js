"use strict";

import axios from 'axios';
import { ItemScraper, ItemScraperRelated } from '../modules/ItemScraper.js'
import  Loupe  from '../modules/Loupe.js'
const sanitizer = new Sanitizer();

export class PageDetail {
  constructor($contents) {
    this.$contents = $contents;
  }
  init(){
    // 商品データをscrape
    const scraper = new ItemScraper(this.$contents);
    const item = scraper.item;

    // リストに追加するボタンを挿入
    this.addButton(item);

    // リストに追加するボタンを挿入(関連商品)
    this.addButtonsRelated();

    // 大きい商品画像を表示
    this.enlargeImages();

    // 拡大鏡を適用
    this.applyLoupe();

    // 在庫情報を追加
    this.showWarehouseInfo(item.id);
  }
  addButton(item){
    // 追加ボタンを描画
    if(item){
      const $parent = document.querySelector('.cart_table h6');
      this.appendAddButton($parent, item);
    }
  }
  addButtonsRelated(){
    const $items = document.querySelectorAll('.kanren form>table');
    $items.forEach($item => {
      // 商品データをscrape
      const scraper = new ItemScraperRelated($item);
      const item = scraper.item;

      // 追加ボタンを描画
      if(item){
        const $parent = $item.querySelector('h6');
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
}