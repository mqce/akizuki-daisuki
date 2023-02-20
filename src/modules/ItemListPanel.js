"use strict";

import axios from 'axios';
import Storage from './StorageLocal.js'
import { zenToHan, formatNumber } from '../modules/Util'

const sanitizer = new Sanitizer();// https://developer.mozilla.org/ja/docs/Web/API/Element/setHTML
const storage = new Storage();

export class ItemListPanel {
  DEFAULT_WIDTH = 400;
  DEFAULT_HEIGHT = 'auto';
  CLASSNAME = 'akizuki-permanent-list';
  html = `
  <header>
    <div class="apl-header-icon"></div>
    <div class="apl-header-length"></div>
  </header>
  <div class="apl-body">
    <form method="POST" action="/catalog/cart/cart.aspx">
      <input type="hidden" name="input_type" value="True">
      <div class="apl-list">
        <ul></ul>
      </div>
      <div class="apl-empty">
        <span class="apl-add-icon"></span>をクリックしてブックマーク
      </div>
      <footer>
        <button type="button" class="apl-clear-button">クリア</button>
        <button type="submit" class="apl-cart-button">全てかごに入れる</button>
      </footer>
    </form>
  </div>
  `;
  constructor(bookmark) {
    this.bookmark = bookmark;
    this.width = this.DEFAULT_WIDTH;
    this.height = this.DEFAULT_HEIGHT;

    // ページ離脱前にサイズを保存
    window.addEventListener('beforeunload', async (e)=>{
      e.preventDefault();
      await this.#saveBodySize();
      e.returnValue = '';
    });
  }
  // chrome.storageに保存されているデータをロードしてリストDOMを生成
  async load(){
    // DOMを初期化
    this.#init();

    // データをロード
    this.list = this.bookmark.items || [];
    console.log(this.list)

    // DOM更新
    this.#update();

    // サイズをロードして適用
    await this.#loadBodySize();
    this.#setBodySize();

    return this.$elem;
  }
  async clear(){
    await this.bookmark.clear();
    this.list = this.bookmark.items || [];
    this.#update();
  }
  async add(item){
    await this.bookmark.add(item.id);
    this.list = this.bookmark.items || [];
    console.log(this.list);
    this.#update();
  }
  #init(){
    // DOMを初期化
    this.$elem = document.createElement('div');
    this.$elem.classList.add(this.CLASSNAME);
    this.$elem.setHTML(this.html, sanitizer);
    this.$body = this.$elem.querySelector('.apl-body');
    this.#addEvents();
  }
  #update(){
    // 件数バッジを更新
    this.$elem.querySelector('.apl-header-length').textContent = this.list.length;

    // リストが空の場合
    if(this.list.length === 0){
      // デフォルトのサイズに戻す
      this.#resetBodySize();
      this.$elem.classList.add('apl-is-empty');
    }else{
      this.$elem.classList.remove('apl-is-empty');
    }

    // リストを更新
    const $ul = this.$elem.querySelector('.apl-list>ul');
    $ul.innerHTML = "";
    this.list.map(item=>{
      const $li = this.#li(item);
      $ul.appendChild($li);
    });
  }
  #resetBodySize(){
    this.width = this.DEFAULT_WIDTH;
    this.height = this.DEFAULT_HEIGHT;
    this.#setBodySize();
  }
  #setBodySize(){
    this.$body.style.width = this.width === 'auto' ? 'auto' : this.width + 'px';
    this.$body.style.height = this.height === 'auto' ? 'auto' : this.height + 'px';
  }
  async #loadBodySize(){
    this.width = await storage.get('bodyWidth') || this.DEFAULT_WIDTH;
    // this.height = await storage.get('bodyHeight') || this.DEFAULT_HEIGHT;
    // heightはautoが良い
    this.height = this.DEFAULT_HEIGHT;
  }
  async #saveBodySize(){
    await storage.set('bodyWidth', this.width);
    // await storage.set('bodyHeight', this.height);
  }

  #addEvents(){
    // パネル開閉
    this.$elem.querySelector('header').addEventListener('click', e => {
      this.$body.classList.toggle('apl-is-active');
    });

    // リストをクリア
    this.$elem.querySelector('.apl-clear-button').addEventListener('click', async e=>{
      if(confirm('リストをクリアします')){
        await this.clear();
        return true;
      }else{
        e.preventDefault();
      }
    });

    // カートに入れる
    this.$elem.querySelector('.apl-cart-button').addEventListener('click', e => {
      if(confirm('全てカートに入れます')){
        return true;
      }else{
        e.preventDefault();
      }
    });

    this.#attachResizeEvent();
  }
  // apl-bodyのcss-resizeを拾う
  #attachResizeEvent(){
    const $elem = this.$body;
    const observer = new MutationObserver(() => {
      this.width = $elem.getBoundingClientRect().width
      this.height = $elem.getBoundingClientRect().height
    })
    observer.observe($elem, {
      attriblutes: true,
      attributeFilter: ["style"]
    })
  }
  // 商品一件分のHTMLを生成
  #li(item){
    const name = zenToHan(item.name);
    const price = formatNumber(item.price);

    const $li = document.createElement('li');
    const html = `
    <input type="hidden" name="goods" value="${item.id}">
    <input type="hidden" name="${item.id}_qty" value="1">
    <div class="apl-item-remove" title="削除"></div>
    <img class="apl-item-thumb" src="${item.image}">
    <a href="${item.url}" class="apl-item-name" title="${name}">${name}</a>
    <span class="apl-item-price">&yen;${price}</span>
    <span class="apl-item-cart" title="カートに入れる"></span>
    `;
    $li.setHTML(html, sanitizer);
  
    // 削除ボタン
    $li.querySelector('.apl-item-remove').addEventListener('click', async e=>{
      await this.bookmark.remove(item.id);
      this.list = this.bookmark.items || [];
      this.#update();
    });

    // カートに入れるボタン
    $li.querySelector('.apl-item-cart').addEventListener('click', async e=>{
      this.#addSingleItemToCart(e.target, item.id);
    });  
    return $li;
  }
  async #addSingleItemToCart($elem, id){
    $elem.classList.remove('apl-done');
    try {
      const url = '/catalog/cart/cart.aspx';
      const data = new FormData();
      data.append('goods', id);
      data.append(id + '_qty', 1);
      const response = await axios.post(url, data);

      // カートに入れた動きをつける
      if(response.status == 200){
        $elem.classList.add('apl-done');
      }

      // カートページにいる場合はリロードする
      if(location.href.includes(url)){
        location.href = url;
      }
    } catch (e) {
      console.error(e);
    }
  }
}