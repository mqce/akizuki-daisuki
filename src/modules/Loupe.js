"use strict";
/*
秋月の商品画像はものによってサムネと拡大画像の拡大比率が異なる。
その比率を取得するため、非効率だがmouseoverの度に拡大画像のnaturalWidthを取得する。
*/

import { getImageSize } from './loadImage.js'

export default class Loupe {
  constructor() {
    this.ratio = 1;
  }
  create($container){
    const $elem = document.createElement('div');
    $elem.classList.add('apl-img-loupe');
    $container.appendChild($elem);
    return $elem;
  }
  async applyTo($container){
    this.$elem = this.create($container);
    const $thumb = $container.querySelector('img');
    this.addEvents($thumb);
  }
  addEvents($img){
    $img.addEventListener('mouseover', this.mouseover.bind(this));
    $img.addEventListener('mouseout', this.mouseout.bind(this));
    $img.addEventListener('mousemove', this.mousemove.bind(this));
  }
  async mouseover(e){
    this.$elem.style.display = 'block';
    try{
      // サムネイルは表示サイズを取得
      // 拡大画像はnaturalWidth/Heightを取得
      const $thumb = e.target;
      this.largeSrc = $thumb.src.replace('/img/goods/L/', '/img/goods/C/');
      const {width, height} = await getImageSize(this.largeSrc);
      this.ratio = width / $thumb.width;
    }catch(e){

    }
  }
  mouseout(e){
    this.$elem.style.display = 'none';
  }
  mousemove(e){
    const x = e.offsetX;
    const y = e.offsetY;
    const bgX = -1 * this.ratio * x;
    const bgY = -1 * this.ratio * y;
    this.$elem.style.left = x + 'px';
    this.$elem.style.top = y + 'px';
    this.$elem.style.backgroundImage = `url(${this.largeSrc})`;
    this.$elem.style.backgroundPosition = `${bgX}px ${bgY}px`;
  }

}

