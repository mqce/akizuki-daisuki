"use strict";

class ItemScraper {
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
    return this.$content.querySelector('.cart_table h6').textContent;
  }
  getId(){
    return this.$content.querySelector('.order_g .valiationlist_>input').value;
  }
  getUrl(){
    return location.href;
  }
  searchPriceFromElements(elems){
    let price = 0;
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
  getPrice(){
    const elems = this.$content.querySelectorAll(".order_g span");
    return this.searchPriceFromElements(elems);
  }
  getImage(){
    // メイン画像のurlからサムネ画像のurlに変換
    const url = this.$content.querySelector('#imglink').href;
    return url.replace(/\/goods\/\w\//, '/goods/S/');
  }
}

/*
  商品ページ下部の「関連商品」や「この商品を購入した方は～」に出てくる商品
*/
class ItemScraperRelated extends ItemScraper {
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
    const elems = this.$content.querySelectorAll(".f14b");
    return this.searchPriceFromElements(elems);
  }
  getImage(){
    return this.$content.querySelector('.syosai img').src;
  }
}

/*
  商品一覧ページ
  「サムネイル」モードのみ対応
*/
class ItemScraperListPage extends ItemScraper {
  getName(){
    return this.$content.querySelector('.thumbox_pc .goods_name_').textContent;
  }
  getId(){
    let id = '';
    const src = this.$content.querySelector('.thumbox_img img').src;
    const match = src.match(/\/([^\/]+)\.\w+?$/);
    if(match){
      id = match[1];
    }
    return id;
  }
  getUrl(){
    return this.$content.querySelector('.goods_name_').href;
  }
  getPrice(){
    const elems = this.$content.querySelectorAll(".f14b");
    return this.searchPriceFromElements(elems);
  }
  getImage(){
    return this.$content.querySelector('.thumbox_img img').src;
  }
}

export {ItemScraper, ItemScraperRelated, ItemScraperListPage}
