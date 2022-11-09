"use strict";

import './style.scss';
import { ItemList } from './modules/ItemList.js'

async function addItemList(){
  const itemList = new ItemList();
  const $ul = await itemList.init();
  
  const $div = document.querySelector('.akizuki-permanent-list');
  $div.appendChild($ul);
}

addItemList();


