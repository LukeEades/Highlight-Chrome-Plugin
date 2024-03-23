let current; 
chrome.tabs.onActivated.addListener((info)=>{
    current = info.tabId; 
})
chrome.runtime.onInstalled.addListener((details)=>{
    chrome.contextMenus.create({
        id: "select-menu", 
        title: "Highlight",
        contexts: ["selection"]
    })

})
chrome.contextMenus.onClicked.addListener((info,tab)=>{
    if(info.menuItemId == "select-menu"){
        chrome.tabs.query({active: true, windowType: "normal", currentWindow: true}, (e)=>{
            chrome.tabs.sendMessage(e[0].id, {stat: true});  
        })
    }
})