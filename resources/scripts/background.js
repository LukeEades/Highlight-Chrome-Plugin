let current; 
chrome.tabs.onActivated.addListener((info)=>{
    console.log(info); 
    current = info.tabId; 
})
chrome.runtime.onInstalled.addListener((details)=>{
    chrome.contextMenus.create({
        id: "select-menu", 
        title: "does a thing",
        contexts: ["selection"]
    })

})
chrome.runtime.onMessage.addListener((request, response)=>{
    // console.log(window); 
})
chrome.contextMenus.onClicked.addListener((info,tab)=>{
    if(info.menuItemId == "select-menu"){
        chrome.tabs.sendMessage(current, {stat: true});  
    }
})