"use strict";


export class BookmarkButton {
  constructor(item, bookmark) {
    this.item = item;
    this.bookmark = bookmark;
    this.isBookmarked = false;
  }
  create(){
    const $elem = this.#createDom();
    this.#addEvent($elem);
    return $elem;
  }
  #createDom(){
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
  #addEvent($elem){
    $elem.addEventListener('click', e=>{
      if(this.isBookmarked){
        this.bookmark.remove(this.item.id);
        $elem.classList.remove('active');
        this.isBookmarked = false;
      }else{
        this.bookmark.add(this.item.id);
        $elem.classList.add('active');
        this.isBookmarked = true;
      }
    });
  }
}