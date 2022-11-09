"use strict";

export class ItemScraper {
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
        url : location.href,
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
  getPrice(){
    let price = 0;
    this.$content.querySelectorAll(".order_g span").forEach($elem=>{
      const text = $elem.textContent;
      const match = text.trim().match(/^￥([0-9,]+)$/);
      if(match){
        price = parseInt(match[1].replace(/,/g, ''));
      }
    })
    return price;
  }
  getImage(){
    // メイン画像のurlからサムネ画像のurlに変換
    const url = this.$content.querySelector('#imglink').href;
    return url.replace(/\/goods\/\w\//, '/goods/S/');
  }
}
