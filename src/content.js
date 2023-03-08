"use strict";

import '@/css/style.scss';

import config from '@/modules/Config'
import bookmark from '@/modules/Bookmark'
import cart from '@/modules/Cart'
import header from '@/modules/Header'

import { PageDetail } from '@/pages/PageDetail'
import { PageList } from '@/pages/PageList'
import { PageBookmark } from '@/pages/PageBookmark'

window.addEventListener('DOMContentLoaded', (event) => {
  main();
});

async function main(){

  checkSessionState();

  await config.load();

  // 大きめの画面に
  if(config.items.larger_width){
    document.body.classList.add('larger_width');
  }

  // ヘッダーの差し替えはなるはやで
  header.init();

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
    const pageList = new PageList();
    pageList.init();
  }

  // お気に入りページ
  if(location.href.includes('/catalog/customer/bookmark.aspx')){
    const pageBookmark = new PageBookmark();
    pageBookmark.init();
  }
}
function checkSessionState(){
  // セッションが切れてたらリロード
  const $notice = document.querySelector('.notice_');
  if($notice && $notice.innerHTML.includes('セッションの有効期間')){
    location.reload();
  }
}