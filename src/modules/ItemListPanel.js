"use strict";

import interact from 'interactjs'
import { Storage } from './Storage.js'
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
      await storage.set('bodyWidth', this.bodyWidth);
      await storage.set('bodyHeight', this.bodyHeight);
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
    this.bodyWidth = this.DEFAULT_WIDTH;
    this.bodyHeight = this.DEFAULT_HEIGHT;
    this.setBodySize();
  }
  add(item){
    this.list = this.itemListData.add(item);
    this.update();
  }
  build(isActive){
    const length = this.list.length || 0;

    const html = `
    <header>
      <div class="apl-header-icon"></div>
      <div class="apl-header-length">${length}</div>
    </header>
    <div class="apl-body">
      <form method="POST" action="/catalog/cart/cart.aspx">
        <input type="hidden" name="input_type" value="True">
        <div class="apl-list"></div>
        <footer>
          <button type="button" class="apl-clear-button">クリア</button>
          <button type="submit" class="apl-cart-button">全てかごに入れる</button>
        </footer>
      </form>
    </div>
    `;

    this.$elem.setHTML(html, sanitizer);
    this.$body = this.$elem.querySelector('.apl-body');
    this.$list = this.$elem.querySelector('.apl-list');

    const $ul = this.ul();
    this.$list.appendChild($ul);

    // bodyのサイズを復元
    this.setBodySize();
    this.interactable(this.$body);

    if(isActive){
      this.$body.classList.add('apl-active');
    }
    this.addEvents();

    return this.$elem;
  }
  setBodySize(){
    this.$body.style.width = this.bodyWidth === 'auto' ? 'auto' : this.bodyWidth + 'px';
    this.$body.style.height = this.bodyHeight === 'auto' ? 'auto' : this.bodyHeight + 'px';
  }
  addEvents(){
    const $body = this.$elem.querySelector('.apl-body');

    // パネル開閉
    this.$elem.querySelector('header').addEventListener('click', e => {
      $body.classList.toggle('apl-active');
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
    <div class="apl-item-remove"></div>
    <img class="apl-item-thumb" src="${item.image}">
    <a href="${item.url}" class="apl-item-name" title="${name}">${name}</a>
    <span class="apl-item-price">&yen;${price}</span>
    <input type="hidden" name="goods" value="${item.id}">
    <input type="hidden" name="${item.id}_qty" value="1">
    `;
    $li.setHTML(html, sanitizer);
  
    // 削除ボタン
    $li.querySelector('.apl-item-remove').addEventListener('click', e=>{
      this.list = this.itemListData.remove(item.id);
      this.update();
    });
    
    /*
    // リンクは新規タブで開く
    $li.querySelector('.apl-item-name').addEventListener('click', e=>{
      chrome.tabs.create({url:item.url});
    });
    */
  
    return $li;
  }
  interactable($elem){
    const self = this;
    interact($elem)
    .resizable({
      edges: { top: false, left: false, bottom: true, right: true },
      listeners: {
        move (event) {
          let { x, y } = event.target.dataset

          self.bodyWidth = event.rect.width;
          self.bodyHeight = event.rect.height;

          x = (parseFloat(x) || 0) + event.deltaRect.left
          y = (parseFloat(y) || 0) + event.deltaRect.top

          Object.assign(event.target.style, {
            width: `${event.rect.width}px`,
            height: `${event.rect.height}px`,
            transform: `translate(${x}px, ${y}px)`
          })

          Object.assign(event.target.dataset, { x, y })
        }
      }
    })
    return $elem;
  }
}
