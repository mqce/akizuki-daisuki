"use strict";
/**
 * BookmarkButton
 * 商品ページ、一覧ページに表示するブックマーク追加・削除ボタン
 */
export class BookmarkButton {
  constructor(item, bookmark) {
    this.item = item;
    this.bookmark = bookmark;
    this.isBookmarked = false;
  }
  create(){
    const $elem = this.#createElem();
    this.#addEvent($elem);
    return $elem;
  }
  // ブックマークボタンのDOM
  #createElem(){
    const $elem = document.createElement('div');
    $elem.classList.add('apl-save-button');

    if(this.bookmark.find(this.item.id)){
      $elem.classList.add('active');
      this.isBookmarked = true;
    }else{
      $elem.classList.remove('active');
      this.isBookmarked = false;
    }
    return $elem;
  }
  // ボタンをクリックでブックマーク状態をtoggleする
  #addEvent($elem){
    let isBusy = false;
    $elem.addEventListener('click', async e=>{
      if(isBusy) return;// 連打対策
      isBusy = true;
      if(this.isBookmarked){
        if(await this.bookmark.remove(this.item.id)){
          $elem.classList.remove('active');
          this.isBookmarked = false;
        }else{
          this.#requireLogin();
        }
      }else{
        if(await this.bookmark.add(this.item.id)){
          $elem.classList.add('active');
          this.isBookmarked = true;
        }else{
          this.#requireLogin();
        }
      }
      isBusy = false;
    });
  }
  #requireLogin(){
    alert('ログインが必要です');
  }
}