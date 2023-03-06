"use strict";
/**
 * CartButton
 * 商品ページ、一覧ページに表示する、カートに追加・削除ボタン
 */
import cart from '@/modules/Cart'
import header from '@/modules/Header'

export class CartButton {
  constructor(item) {
    this.item = item;
    this.exists = false;
  }
  create(){
    const $elem = this.#createElem();
    this.#addEvent($elem);
    return $elem;
  }
  // ボタンのDOM
  #createElem(){
    const $elem = document.createElement('div');
    $elem.classList.add('cart-button');

    if(cart.find(this.item.id)){
      $elem.classList.add('active');
      this.exists = true;
    }else{
      $elem.classList.remove('active');
      this.exists = false;
    }
    return $elem;
  }
  // ボタンクリックで登録状態をtoggleする
  #addEvent($elem){
    let isBusy = false;
    $elem.addEventListener('click', async e=>{
      if(isBusy) return;// 連打対策
      isBusy = true;
      if(this.exists){
        if(await cart.remove(this.item.id)){
          header.updateCartCount(cart.length);
          $elem.classList.remove('active');
          this.exists = false;
        }
      }else{
        if(await cart.add(this.item.id)){
          header.updateCartCount(cart.length);
          $elem.classList.add('active');
          this.exists = true;
        }
      }
      isBusy = false;
    });
  }
}