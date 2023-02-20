"use strict";

import './css/style.scss';

import { Bookmark } from './modules/Bookmark'
import { ItemListPanel } from './modules/ItemListPanel'
import { PageDetail } from './pages/PageDetail'
import { PageList } from './pages/PageList'
import { Header } from './modules/Header'
import { Config } from './modules/Config'


async function main(){
  // セッションが切れてたらリロード
  const $notice = document.querySelector('notice_');
  if($notice && $notice.textContent.includes('セッションの有効期間')){
    location.reload();
  }

  const config = await Config.load();
  if(config.larger_width){
    document.body.classList.add('larger_width');
  }
  
  const bookmark = new Bookmark();
  await bookmark.load();






  const $header = document.querySelector('#header');
  if($header){
    const header = new Header(config);
    header.replace();
    // showItemList(bookmark);
  }

  // 詳細ページ
  const $maincontents = document.querySelector('#maincontents');
  if($maincontents){
    const pageDetail = new PageDetail($maincontents, bookmark, config);
    pageDetail.init();
  }

  // 一覧ページ
  const $mainframe = document.querySelector('.mainframe_');
  if($mainframe){
    const pageList = new PageList($mainframe, bookmark, config);
    pageList.init();
  }
}

async function showItemList(bookmark){
  const itemListPanel = new ItemListPanel(bookmark);
  const $elem = await itemListPanel.load();
  document.body.appendChild($elem);
}

main();


