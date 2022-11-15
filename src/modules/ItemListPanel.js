"use strict";

import axios from 'axios';
import Storage from './StorageLocal.js'
import { ItemListData } from './ItemListData.js'

// https://developer.mozilla.org/ja/docs/Web/API/Element/setHTML
const sanitizer = new Sanitizer();
const storage = new Storage();

// 全角to半角
function replaceFullToHalf(str){
  const half = str.replace(/[！-～]/g, (s)=>{
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
  return half.replace(/”/g, "\"")
  .replace(/’/g, "'")
  .replace(/‘/g, "`")
  .replace(/￥/g, "\\")
  .replace(/　/g, " ")
  .replace(/〜/g, "~");
}

export class ItemListPanel {
  DEFAULT_WIDTH = 400;
  DEFAULT_HEIGHT = 'auto';
  constructor() {
    this.itemListData = new ItemListData();

    // ページ離脱前にサイズを保存
    window.addEventListener('beforeunload', async (e)=>{
      e.preventDefault();
      await this.saveBodySize();
      e.returnValue = '';
    });
  }
  // chrome.storageに保存されているデータをロードしてリストDOMを生成
  async load(){
    this.list = await this.itemListData.load();

    // サイズをロード
    this.bodyWidth = await storage.get('bodyWidth') || this.DEFAULT_WIDTH;
    this.bodyHeight = await storage.get('bodyHeight') || this.DEFAULT_HEIGHT;

    // .akizuki-permanent-list直下に置くdivを作る
    this.$elem = document.createElement('div');
    return this.update();
  }
  // updateの度に全部書き換える
  update(){
    // active状態を維持する
    const isActive = this.$elem.querySelector('.apl-active') !== null;

    this.$elem.innerHTML = "";
    return this.build(isActive);
  }
  async clear(){
    this.list = await this.itemListData.clear();
    this.update();
  }
  async add(item){
    this.list = await this.itemListData.add(item);
    this.update();
  }
  html(){
    const length = this.list.length || 0;

    const footer = length ? `
    <footer>
      <button type="button" class="apl-clear-button">クリア</button>
      <button type="submit" class="apl-cart-button">全てかごに入れる</button>
    </footer>
    ` : ``;

    const html = `
    <header>
      <div class="apl-header-icon"></div>
      <div class="apl-header-length">${length}</div>
    </header>
    <div class="apl-body">
      <form method="POST" action="/catalog/cart/cart.aspx">
        <input type="hidden" name="input_type" value="True">
        <div class="apl-list"></div>
        ${footer}
      </form>
    </div>
    `;

    return html;
  }
  build(isActive){
    const html = this.html();
    this.$elem.setHTML(html, sanitizer);

    const $body = this.$elem.querySelector('.apl-body');
    const $list = this.$elem.querySelector('.apl-list');
    this.addHeaderEvents();

    if(this.list.length > 0){
      // リストが空でない場合
      const $ul = this.ul();
      $list.appendChild($ul);
      this.addButtonEvents();
    }else{
      // リストが空の場合
      const $list = this.$elem.querySelector('.apl-list');
      $list.innerHTML =  `
      <div class="apl-empty">
        <span class="apl-add-icon"></span>をクリックして商品を追加
      </div>
      `;
      // デフォルトのサイズに戻す
      this.bodyWidth = this.DEFAULT_WIDTH;
      this.bodyHeight = this.DEFAULT_HEIGHT;
    }

    // bodyの開閉状態・サイズを復元
    this.setBodySize($body);
    if(isActive){
      $body.classList.add('apl-active');
    }

    return this.$elem;
  }
  setBodySize($body){
    $body.style.width = this.bodyWidth === 'auto' ? 'auto' : this.bodyWidth + 'px';
    $body.style.height = this.bodyHeight === 'auto' ? 'auto' : this.bodyHeight + 'px';
  }
  async saveBodySize(){
    const $body = this.$elem.querySelector('.apl-body');
    await storage.set('bodyWidth', $body.clientWidth);
    await storage.set('bodyHeight', $body.clientHeight);
  }
  addHeaderEvents(){
    // パネル開閉
    const $body = this.$elem.querySelector('.apl-body');
    this.$elem.querySelector('header').addEventListener('click', e => {
      $body.classList.toggle('apl-active');
    });
  }
  addButtonEvents(){
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
  }
  ul(){
    const $ul = document.createElement('ul');
    this.list.map(item=>{
      const $li = this.li(item);
      $ul.appendChild($li);
    });
    return $ul;
  }
  // 商品一件分のHTMLを生成
  li(item){
    const formatter = new Intl.NumberFormat('ja-JP');
    const name = replaceFullToHalf(item.name);
    const price = formatter.format(item.price);

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
      this.list = await this.itemListData.remove(item.id);
      this.update();
    });

    // カートに入れるボタン
    $li.querySelector('.apl-item-cart').addEventListener('click', async e=>{
      try {
        const url = '/catalog/cart/cart.aspx';
        const data = new FormData();
        data.append("goods", item.id);
        data.append(item.id + '_qty', "1");
        const response = await axios.post(url, data);
        console.log(response)

        if(location.href.includes(url)){
          location.href = url;
        }
      } catch (e) {
        console.error(e);
      }
    });  
    return $li;
  }
}