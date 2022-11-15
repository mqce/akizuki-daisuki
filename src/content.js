"use strict";

import './style.scss';
import { ItemListPanel } from './modules/ItemListPanel.js'
import { ItemScraper, ItemScraperRelated, ItemScraperListPage } from './modules/ItemScraper.js'


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
    // リストに追加するボタンを挿入
    addButton();

    // リストに追加するボタンを挿入(関連商品)
    addButtonsRelated();
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

function addButton(){
  const $content = document.querySelector('#maincontents');
  // 商品データをscrape
  const scraper = new ItemScraper($content);
  const item = scraper.item;

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

main();


