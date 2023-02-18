"use strict";

import { Config } from './modules/Config'

function main(){
  applyConfigData();
  attachEvents();
}

// storageのデータに合わせてチェックボックスをON/OFFする
async function applyConfigData(){
  const config = await Config.load();
  console.log(config);
  const $inputs = document.querySelectorAll('input[name="config"]');
  $inputs.forEach($input => {
    const key = $input.value;
    if(config[key]){
      $input.checked = true;
    }else{
      $input.checked = false;
    }
  });
}

// チェックボックスをクリックするたびに設定を書き換え
function attachEvents(){
  const $inputs = document.querySelectorAll('input[name="config"]');
  $inputs.forEach($input => {
    $input.addEventListener('change', (event) => {
      const key = $input.value;
      const value = $input.checked;
      Config.set(key, value);
    });
  });
}

window.addEventListener('DOMContentLoaded', ()=>{
  main();
});

