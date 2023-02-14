"use strict";

import axios from 'axios';
import './style.scss';

import { ItemListPanel } from './modules/ItemListPanel.js'
import { ItemScraper, ItemScraperRelated, ItemScraperListPage } from './modules/ItemScraper.js'
import  Loupe  from './modules/Loupe.js'

const sanitizer = new Sanitizer();
const itemListPanel = new ItemListPanel();

function main(){
  // 欲しいものリストを表示
  // pdfやポップアップなどヘッダーのないページには表示しない
  const $header = document.querySelector('#header');
  if($header){
    showItemList();
  }

  // 商品ページならAddButtonを追加
  const $maincontents = document.querySelector('#maincontents');
  if($maincontents){
    // 商品データをscrape
    const scraper = new ItemScraper($maincontents);
    const item = scraper.item;

    // リストに追加するボタンを挿入
    addButton(item);

    // リストに追加するボタンを挿入(関連商品)
    addButtonsRelated();

    // 大きい商品画像を表示
    enlargeImages();

    // 拡大鏡を適用
    applyLoupe();

    // 在庫情報を追加
    showWarehouseInfo(item.id);
  }

  // 一覧ページでもAddButtonを追加
  const $mainframe = document.querySelector('.mainframe_');
  if($mainframe){
    addButtonsListPage();
  }
}

async function showItemList(){
  const $elem = await itemListPanel.load();
  document.body.appendChild($elem);
}

function addButton(item){
  // 追加ボタンを描画
  if(item){
    const $parent = document.querySelector('.cart_table h6');
    appendAddButton($parent, item);
  }
}

function addButtonsRelated(){
  const $items = document.querySelectorAll('.kanren form>table');
  $items.forEach($item => {
    // 商品データをscrape
    const scraper = new ItemScraperRelated($item);
    const item = scraper.item;

    // 追加ボタンを描画
    if(item){
      const $parent = $item.querySelector('h6');
      appendAddButton($parent, item);
    }
  })
}

function addButtonsListPage(){
  const $items = document.querySelectorAll('.thumbox');
  $items.forEach($item => {
    // 商品データをscrape
    const scraper = new ItemScraperListPage($item);
    const item = scraper.item;

    // 追加ボタンを描画
    if(item){
      const $parent = $item;
      appendAddButton($parent, item);
    }
  })
}

function appendAddButton($parent, item){
  const $button = document.createElement('div');
  $button.classList.add('apl-save-button');
  $button.addEventListener('click', e=>{
    itemListPanel.add(item);
  });
  $parent.appendChild($button);
}


function enlargeImages(){
  const $img = document.querySelector('.syosai #imglink img');
  $img.src = $img.src.replace('/img/goods/L/', '/img/goods/C/');
}

// 商品画像に拡大鏡を表示
function applyLoupe(){
  const $container = document.querySelector('.syosai #imglink');
  const loupe = new Loupe();
  loupe.applyTo($container);
}

// 店舗在庫表示
async function showWarehouseInfo(id){
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

main();


