"use strict";

/*
  商品ページ下部の「関連商品」や「この商品を購入した方は～」に出てくる商品
*/
export class ItemScraperRelated {
  constructor($content) {
    this.$content = $content;
  }
  get item(){
    return this.exec();
  }
  exec(){
    let item = null;
    try{
      item = {
        name : this.getName(),
        id : this.getId(),
        url : this.getUrl(),
        price : this.getPrice(),
        image : this.getImage(),
      };
    }catch(e){

    }
    return item;
  }
  getName(){
    return this.$content.querySelector('.syosai a').title;
  }
  getId(){
    return this.$content.querySelector('input[name="goods"]').value;
  }
  getUrl(){
    return this.$content.querySelector('.syosai a').href;
  }
  getPrice(){
    let price = 0;

    const elems = this.$content.querySelectorAll(".f14b");
    for(let i=0; i<elems.length; i++){
      const $elem = elems[i];
      const text = $elem.textContent;
      const match = text.trim().match(/^￥([0-9,]+)$/);
      if(match){
        price = parseInt(match[1].replace(/,/g, ''));
        break;
      }
    }
    return price;
  }
  getImage(){
    return this.$content.querySelector('.syosai img').src;
  }
}
