"use strict";

import config from '../modules/Config'
const sanitizer = new Sanitizer();

class Header {
  constructor() {
    /*
    DOMContentLoadedの前にインスタンス化される可能性があるので
    ここではDOM操作をしない
    */
  }
  init(){
    this.isLoggedIn = /ログアウト/.test(document.querySelector('#header').innerHTML);

    const $header = document.querySelector('#header');
    const $newHeader = document.createElement('header');
    if(config.items.slim_header){
      $newHeader.classList.add('header-slim');
      $newHeader.setHTML(this.slimHtml, sanitizer);
    }else{
      $newHeader.classList.add('header');
      $newHeader.setHTML(this.html, sanitizer);
    }
    $header.replaceWith($newHeader);
    this.$elem = $newHeader;
  }
  updateBookmarkCount(n){
    this.#updateCount('.header-bookmark-button', n);
  }
  updateCartCount(n){
    this.#updateCount('.header-cart-button', n);
  }
  #updateCount(selector, n){
    const $button = this.$elem.querySelector(selector);
    let $count = $button.querySelector('.header-count');
    if(n){
      $count.textContent = parseInt(n);
    }else{
      $count.textContent = '';
    }
  }
  get loginHtml(){
    return this.isLoggedIn ? 
    `<a href="/catalog/customer/logout.aspx">ログアウト</a>` :
    `<a href="/catalog/customer/menu.aspx">ログイン</a>`;
  }
  get html(){
    return `
    <div>
      <div class="header-main">
        <div class="logo"><a href="/catalog/top.aspx"><img src="/img/usr/logo4.gif" alt="秋月電子通商" width="300" height="64"></a></div>
        <nav>
          <a href="/catalog/customer/menu.aspx" title="マイページ"><img src="/img/usr/bt_top03.gif" alt="マイページ"></a>
          <a href="/catalog/contents2/faxbuy.aspx#form" title="注文書"><img src="/img/usr/bt_top01.gif" alt="注文書"></a>
          <a href="/catalog/contents2/contact.aspx" title="お問い合わせ"><img src="/img/usr/bt_top02.gif" alt="お問い合わせ"></a>
          <a class="header-bookmark-button" href="/catalog/customer/bookmark.aspx" title="お気に入り">
            <img src="${chrome.runtime.getURL('img/bookmark.png')}" alt="お気に入り">
            <span class="header-count"></span>
          </a>
          <a class="header-cart-button" href="/catalog/cart/cart.aspx" title="かごの中身">
            <img src="/img/usr/bt_top04.gif" alt="かごの中身">
            <span class="header-count"></span>
          </a>
          <a href="/catalog/contents2/koukoku.aspx" title="広告"><img src="https://akizukidenshi.com/img/usr/bt_top05.gif" alt="広告"></a>
          <a href="/catalog/contents2/kairo.aspx" title="回路図集"><img src="https://akizukidenshi.com/img/usr/bt_top06.gif" alt="回路図集"></a>
        </nav>
        <div class="quickorder"><a href="/catalog/quickorder/quickorder.aspx">クイック注文</a></div>
      </div>
      <div class="header-sub">
        <nav>
          <a href="/catalog/">トップページ</a>
          <a href="/catalog/c/c/">商品カタログ</a>
          <a href="/catalog/e/enewall_dT/">新商品</a>
          <a href="/catalog/contents2/news.aspx">お知らせ</a>
          <a href="/catalog/contents2/buy.aspx">注文方法</a>
          <a href="/catalog/contents2/furikomisaki.aspx">振込先</a>
          <a href="/catalog/contents2/faq3.aspx">よくある質問</a>
          <a href="/catalog/contents2/down.aspx">ダウンロード</a>
          <a href="/catalog/contact/order.aspx">配送状況確認</a>
          ${this.loginHtml}
        </nav>
        <form action="/catalog/goods/search.aspx" method="get" name="frmSearch">
          <input type="hidden" name="search" value="x">
          <input name="keyword" type="text" class="keyword_" id="keyword" tabindex="1" value="" size="16">
          <input name="image" type="submit" class="stylebtn40" value="検索">
        </form>
      </div>
    </div>
    `;
  }
  get slimHtml(){
    return `
    <div>
      <div class="header-main">
        <a class="logo" href="/catalog/top.aspx">秋月電子通商</a>
        <div class="header-menu">
          <form action="/catalog/goods/search.aspx" method="get" name="frmSearch">
            <input type="hidden" name="search" value="x">
            <input name="keyword" type="text" id="keyword" tabindex="1" value="">
            <input type="submit" value="検索">
          </form>
          <nav>
            ${this.loginHtml}
            <a href="/catalog/customer/menu.aspx" title="マイページ">マイページ</a>
            <a href="/catalog/contents2/contact.aspx" title="お問い合わせ">お問い合わせ</a>
          </nav>
          <div class="header-buttons">
            <a class="header-bookmark-button" href="/catalog/customer/bookmark.aspx" title="お気に入り">
              <img src="${chrome.runtime.getURL('img/bookmarks.svg')}" alt="お気に入り">
              <span class="header-count"></span>
            </a>
            <a class="header-cart-button" href="/catalog/cart/cart.aspx" title="かごの中身">
              <img src="${chrome.runtime.getURL('img/cart.svg')}" alt="かごの中身">
              <span class="header-count"></span>
            </a>
          </div>
        </div>

      </div>
      <div class="header-sub">
        <a href="/catalog/">トップページ</a>
        <a href="/catalog/c/c/">商品カタログ</a>
        <a href="/catalog/e/enewall_dT/">新商品</a>
        <a href="/catalog/contents2/news.aspx">お知らせ</a>
        <a href="/catalog/contents2/faq3.aspx">よくある質問</a>
        <a href="/catalog/contents2/down.aspx">ダウンロード</a>
        <a href="/catalog/contact/order.aspx">配送状況確認</a>

        <a href="/catalog/contents2/buy.aspx">注文方法</a>
        <a href="/catalog/contents2/furikomisaki.aspx">振込先</a>
        <a href="/catalog/contents2/faxbuy.aspx#form">注文書</a>
        <a href="/catalog/quickorder/quickorder.aspx">クイック注文</a>
        <a href="/catalog/contents2/koukoku.aspx">トラ技広告</a>
        <a href="/catalog/contents2/kairo.aspx">回路図集</a>
      </div>
    </div>
    `
  }
}

const header = new Header();
export default header;