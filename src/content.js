"use strict";

import './style.scss';
import { ItemScraper } from './modules/ItemScraper.js'
import { ItemList } from './modules/ItemList.js'

console.log('content.js');

const itemList = new ItemList();

function main(){
  // 商品リストをappend
  addItemList();

  // 商品ページならAddButtonを追加
  const $content = document.querySelector('#maincontents');
  if($content){
    // 商品データをscrape
    const item = getItem($content);
    console.log(item);

    // Addボタンを追加
    addButton($content, itemList, item);
  }
}

function getItem($content){
  const scraper = new ItemScraper($content);
  return scraper.item;
}

function addButton($content, itemList, item){
  const $title = $content.querySelector('.cart_table h6');
  const $button = document.createElement('button');
  $button.textContent = '+';
  $title.appendChild($button);

  $button.addEventListener('click', e=>{
    itemList.add(item);
  });
  
}

async function addItemList(){
  const $div = document.createElement('div');
  $div.classList.add('akizuki-permanent-list');

  const $ul = await itemList.init();
  $div.appendChild($ul);
  document.body.appendChild($div);
}

main();

