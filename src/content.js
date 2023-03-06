"use strict";

import '@/css/style.scss';

import config from '@/modules/Config'
import bookmark from '@/modules/Bookmark'
import cart from '@/modules/Cart'
import header from '@/modules/Header'

import { PageDetail } from '@/pages/PageDetail'
import { PageList } from '@/pages/PageList'


window.addEventListener('DOMContentLoaded', (event) => {
  main();
});

async function main(){
  // セッションが切れてたらリロード
  const $notice = document.querySelector('.notice_');
  if($notice && $notice.innerHTML.includes('セッションの有効期間')){
    location.reload();
  }

  await config.load();
  if(config.items.larger_width){
    document.body.classList.add('larger_width');
  }

  // ヘッダーの差し替えはなるはやで
  const $header = document.querySelector('#header');
  if($header){
    header.init();
  }

  await bookmark.load();
  header.updateBookmarkCount(bookmark.length);

  await cart.load();
  header.updateCartCount(cart.length);

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
