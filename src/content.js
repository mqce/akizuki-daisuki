"use strict";

import './style.scss';

import { Bookmark } from './modules/Bookmark'
import { ItemListPanel } from './modules/ItemListPanel'
import { PageDetail } from './pages/PageDetail'
import { PageList } from './pages/PageList'
import { Config } from './modules/Config'




// セッションが切れてたらリロード
const $notice = document.querySelector('notice_');
if($notice && $notice.textContent.includes('セッションの有効期間')){
  location.reload();
}


async function main(){
  const config = await Config.load();
  console.log(config);
  if(config.larger_width){
    document.body.classList.add('larger_width');
  }
  
  const bookmark = new Bookmark();
  await bookmark.init();

  // 欲しいものリストを表示
  // pdfやポップアップなどヘッダーのないページには表示しない
  const $header = document.querySelector('#header');
  if($header){
    showItemList();
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
    const pageList = new PageList($mainframe, bookmark);
    pageList.init();
  }
}

async function showItemList(){
  const itemListPanel = new ItemListPanel();
  const $elem = await itemListPanel.load();
  document.body.appendChild($elem);
}

main();


