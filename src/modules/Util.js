"use strict";

// 全角文字を半角に変換
function zenToHan(str){
  const result = str.replace(/[！-～]/g, (s)=>{
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
  return result.replace(/”/g, "\"")
  .replace(/’/g, "'")
  .replace(/‘/g, "`")
  .replace(/￥/g, "\\")
  .replace(/　/g, " ")
  .replace(/〜/g, "~");
}

function formatNumber(n){
  const formatter = new Intl.NumberFormat('ja-JP');
  return formatter.format(n);
}


export { zenToHan, formatNumber }