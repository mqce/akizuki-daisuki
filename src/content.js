"use strict";

import './style.scss';

import { Bookmark } from './modules/Bookmark'
import { ItemListPanel } from './modules/ItemListPanel'
import { PageDetail } from './pages/PageDetail'
import { PageList } from './pages/PageList'

function main(){
  // 欲しいものリストを表示
  // pdfやポップアップなどヘッダーのないページには表示しない
  const $header = document.querySelector('#header');
  if($header){
    showItemList();


    const b = new Bookmark();
    b.scrape();
  }

  // 詳細ページ
  const $maincontents = document.querySelector('#maincontents');
  if($maincontents){
    const pageDetail = new PageDetail($maincontents);
    pageDetail.init();
  }

  // 一覧ページ
  const $mainframe = document.querySelector('.mainframe_');
  if($mainframe){
    const pageList = new PageList($mainframe);
    pageList.init();
  }
}

async function showItemList(){
  const itemListPanel = new ItemListPanel();
  const $elem = await itemListPanel.load();
  document.body.appendChild($elem);
}

main();


