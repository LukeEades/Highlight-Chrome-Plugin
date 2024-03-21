chrome.runtime.onMessage.addListener((message) => {
    let range = window.getSelection().getRangeAt(0); 
    let jsonRange = JSON.stringify(RangeStorage.JsonRange(range)); 
    let key = String(window.location.href); 
    // chrome.storage.local.clear(); 
    // console.log(jsonRange); 
    let range2 = RangeStorage.getRangeFromJson(JSON.parse(jsonRange)); 
    // console.log(range2); 
    chrome.storage.local.get([key]).then((value)=>{
        let newVal = value[key]?[...value[key]]: []; 
        newVal.push(jsonRange); 
        // chrome.storage.local.set({[key]: newVal}).then(()=>{
        //     console.log("set"); 
        //     // console.log(value[key]); 
        // })
    })
})
let body = document.querySelector('body'); 
window.onload = showStoredRanges(String(document.location.href))

let icon = document.createElement('div'); 
let centerIcon = document.createElement('div'); 
body.appendChild(centerIcon); 
centerIcon.classList.add('center-icon'); 
icon.classList.add("highlight-icon"); 
centerIcon.appendChild(icon); 
let colorOptions = document.createElement('div'); 
let colors = ["red", "orange", "yellow", "green", "blue", "purple"]; 
for(let i = 0; i < colors.length; i++){
    let temp = document.createElement('input'); 
    temp.type = "radio"; 
    temp.id = colors[i]; 
    if(colors[i] == "yellow"){
        temp.checked = true; 
    }
    temp.name = "colorChoice"; 
    temp.classList.add("color-icon");    
    temp.style.backgroundColor = colors[i]; 
    colorOptions.appendChild(temp); 
}

icon.appendChild(colorOptions); 
let menuOut = false; 
icon.addEventListener('mouseenter', (e)=>{
    icon.classList.toggle('icon-show'); 
})
icon.addEventListener('mouseleave', (e)=>{
    icon.classList.toggle('icon-show'); 
})

function showStoredRanges(url){
    chrome.storage.local.get([url]).then((val)=>{
        if(val[url]){
            let ranges = val[url]; 
            for(let i = 0; i < ranges.length; i++){
                let parsed = JSON.parse(ranges[i]); 
                console.log("parsed: ", parsed); 
                let range = RangeStorage.getRangeFromJson(parsed); 
                console.log(range); 
                highlightRange(RangeStorage.getRangeFromJson(JSON.parse(ranges[i]))); 
            }

        }
    })
}

// Returns array of all descending text nodes from a node
function getTextNodes(node, textNodes = []){
    for(let i = 0; i < node.childNodes.length; i++){
        let type = node.childNodes[i].nodeType; 
        if(type != 3){
            if(node.childNodes[i].nodeName == "IMG"){
                continue; 
            }
            getTextNodes(node.childNodes[i], textNodes); 
        }
        if(type == 3 && node.childNodes[i].nodeValue != "\n"){
            textNodes.push(node.childNodes[i]); 
        }
    }
    return textNodes; 
}

// Surrounds a text area, defined by start and end, with a highlight node of specified color
function surroundNode(node, start, end, color = "yellow"){
    // Notes: Consider TextNode splitText function
    let parent = node.parentNode; 
    let newNode = document.createElement("mark"); 
    newNode.style.backgroundColor = color; 
    let text = node.textContent; 
    let before = document.createTextNode(text.slice(0, start)); 
    let middle = document.createTextNode(text.slice(start, end)); 
    let after = document.createTextNode(text.slice(end, text.length));
    newNode.innerHTML = middle.textContent; 
    parent.insertBefore(before, node); 
    parent.insertBefore(newNode, node); 
    parent.insertBefore(after, node); 
    parent.removeChild(node);  
    return; 
}

// Highlights a range of text with specified color
function highlightRange(range, color){
    let parent = range.commonAncestorContainer; 
    let start = range.startContainer; 
    let end = range.endContainer; 
    let startOffset = range.startOffset; 
    let endOffset = range.endOffset; 
    let canHighlight = false; 

    if(parent.childNodes.length == 0){
        surroundNode(parent, startOffset, endOffset, color)
        return; 
    }
    let nodes = parent.childNodes; 
    for(let i = 0; i < nodes.length; i++){
        if(nodes[i].nodeName != "#text"){
            let textNodes = getTextNodes(nodes[i]); 
            for(let j =0; j< textNodes.length; j++){
                if(textNodes[j] == end){
                    canHighlight = false; 
                    surroundNode(textNodes[j], 0, endOffset, color); 
                    j += 2; 
                    return; 
                }
                else if(canHighlight){
                    surroundNode(textNodes[j], 0, textNodes[j].length, color); 
                    j+= 2; 
                }
                else if(textNodes[j] == start){
                    canHighlight = true; 
                    surroundNode(textNodes[j], startOffset, textNodes[j].length, color); 
                    j+= 2; 
                }
            }
        }
        else{
            if(nodes[i] == end){
                canHighlight = false; 
                surroundNode(nodes[i], 0, endOffset, color); 
                i += 2; 
                return; 
            }
            else if(canHighlight){
                surroundNode(nodes[i], 0, nodes[i].length, color); 
                i+= 2; 
            }
            else if(nodes[i] == start){
                canHighlight = true; 
                surroundNode(nodes[i], startOffset, nodes[i].length, color); 
                i+= 2; 
            } 
        }        
    }
}