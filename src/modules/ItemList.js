"use strict";

import { ItemListData } from './ItemListData.js'

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

export class ItemList {
  constructor() {
    this.itemListData = new ItemListData();
  }
  async init(){
    this.list = await this.itemListData.load();
    this.$ul = document.createElement('ul');
    return this.update(this.list);
  }
  update(list){
    const $ul = this.$ul;
    $ul.innerHTML = "";
    list.forEach(item=>{
      const $li = this.li(item);
      $ul.appendChild($li);
    });
    return this.$ul;
  }
  add(item){
    const list = this.itemListData.add(item);
    this.update(list);
  }
  li(item){
    const $li = document.createElement('li');

    // format text
    const formatter = new Intl.NumberFormat('ja-JP');
    item.name = replaceFullToHalf(item.name);
    item.price = formatter.format(item.price);

    const html = `
    <button>✖</button>
    <img class="thumb" src="${item.image}">
    <a href="${item.url}" class="name" title="${item.name}">${item.name}</a>
    <span class="price">${item.price}</span>
    `;
    // https://developer.mozilla.org/ja/docs/Web/API/Element/setHTML
    const sanitizer = new Sanitizer();
    $li.setHTML(html, sanitizer);
  
    // 削除ボタン
    $li.querySelector('button').addEventListener('click', e=>{
      const list = this.itemListData.remove(item.id);
      this.update(list);
    });
  
    // リンクは新規タブで開く
    $li.querySelector('.name').addEventListener('click', e=>{
      chrome.tabs.create({url:item.url});
    });
  
    return $li;
  }
}
