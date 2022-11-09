console.log("Background Script")

chrome.runtime.onInstalled.addListener(() => {
  // chrome.tabs.create({ url: chrome.runtime.getURL("/pages/help.html")});
});
