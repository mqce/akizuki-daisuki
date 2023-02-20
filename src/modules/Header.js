"use strict";

const sanitizer = new Sanitizer();

const isLoggedIn = /ログアウト/.test(document.querySelector('#header').innerHTML);
const loginHtml = isLoggedIn ? 
  `<a href="/catalog/customer/logout.aspx">ログアウト</a>` :
  `<a href="/catalog/customer/menu.aspx">ログイン</a>`;

const html = `
<div>
  <div class="header_main">
    <div class="logo"><a href="/catalog/top.aspx"><img src="/img/usr/logo4.gif" alt="秋月電子通商" width="300" height="64"></a></div>
    <nav>
      <a href="/catalog/customer/menu.aspx" title="マイページ"><img src="/img/usr/bt_top03.gif" alt="マイページ"></a>
      <a href="/catalog/contents2/faxbuy.aspx#form" title="注文書"><img src="/img/usr/bt_top01.gif" alt="注文書"></a>
      <a href="/catalog/contents2/contact.aspx" title="お問い合わせ"><img src="/img/usr/bt_top02.gif" alt="お問い合わせ"></a>
      <a href="/catalog/customer/bookmark.aspx" title="お気に入り"><img src="${chrome.runtime.getURL('img/bookmark.png')}" alt="お気に入り"></a>
      <a href="/catalog/cart/cart.aspx" title="かごの中身"><img src="/img/usr/bt_top04.gif" alt="かごの中身"></a>
      <a href="/catalog/contents2/koukoku.aspx" title="広告"><img src="https://akizukidenshi.com/img/usr/bt_top05.gif" alt="広告"></a>
      <a href="/catalog/contents2/kairo.aspx" title="回路図集"><img src="https://akizukidenshi.com/img/usr/bt_top06.gif" alt="回路図集"></a>
    </nav>
    <div class="quickorder"><a href="/catalog/quickorder/quickorder.aspx">クイック注文</a></div>
  </div>
  <div class="header_sub">
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
      ${loginHtml}
    </nav>
    <form action="/catalog/goods/search.aspx" method="get" name="frmSearch">
      <input type="hidden" name="search" value="x">
      <input name="keyword" type="text" class="keyword_" id="keyword" tabindex="1" value="" size="16">
      <input name="image" type="submit" class="stylebtn40" value="検索">
    </form>
  </div>
</div>
`;

const slim = `
<div>
  <div class="logo"><a href="/catalog/top.aspx">秋月電子通商</a></div>
  
</div>
`

export class Header {
  constructor(config) {
    this.config = config;
  }
  replace(){
    const $header = document.querySelector('#header');
    $header.setHTML(html, sanitizer);
  }
}