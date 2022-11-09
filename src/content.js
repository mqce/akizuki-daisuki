"use strict";

import './style.scss';
import { ItemScraper } from './modules/ItemScraper.js'
import { ItemList } from './modules/ItemList.js'

console.log('content.js');

const itemList = new ItemList();

function main(){
  // 欲しいものリストを表示
  showItemList();

  // 商品ページならAddButtonを追加
  const $content = document.querySelector('#maincontents');
  if($content){
    // 商品データをscrape
    const item = getItemData($content);
    console.log(item);

    // 追加ボタンを描画
    showAddButton($content, item);
  }
}

function getItemData($content){
  const scraper = new ItemScraper($content);
  return scraper.item;
}

function showAddButton($content, item){
  const $title = $content.querySelector('.cart_table h6');
  const $button = document.createElement('div');
  $button.classList.add('apl-save-button');
  $title.appendChild($button);

  $button.addEventListener('click', e=>{
    itemList.add(item);
  });
  
}

async function showItemList(){
  const $div = document.createElement('div');
  $div.classList.add('akizuki-permanent-list');

  const $elem = await itemList.load();
  $div.appendChild($elem);
  document.body.appendChild($div);
}


main();


