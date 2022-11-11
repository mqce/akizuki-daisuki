"use strict";

import './style.scss';
import { ItemListPanel } from './modules/ItemListPanel.js'
import { ItemScraper } from './modules/ItemScraper.js'
import { ItemScraperRelated } from './modules/ItemScraperRelated.js'

console.log('content.js');

const ItemListPanel = new ItemListPanel();

function main(){
  // 欲しいものリストを表示
  showItemList();

  // 商品ページならAddButtonを追加
  const $content = document.querySelector('#maincontents');
  if($content){
    // リストに追加するボタンを挿入
    addButton();

    // リストに追加するボタンを挿入(関連商品)
    addButtonsRelated();
  }
}

async function showItemList(){
  const $div = document.createElement('div');
  $div.classList.add('akizuki-permanent-list');

  const $elem = await ItemListPanel.load();
  $div.appendChild($elem);
  document.body.appendChild($div);
}


function addButton(){
  const $content = document.querySelector('#maincontents');
  // 商品データをscrape
  const scraper = new ItemScraper($content);
  const item = scraper.item;
  console.log(item);

  // 追加ボタンを描画
  if(item){
    const $parent = $content.querySelector('.cart_table h6');
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

function appendAddButton($parent, item){
  const $button = document.createElement('div');
  $button.classList.add('apl-save-button');
  $button.addEventListener('click', e=>{
    itemList.add(item);
  });
  $parent.appendChild($button);
}

main();


