chrome.runtime.onMessage.addListener((message) => {
    let range = window.getSelection().getRangeAt(0); 
    let jsonRange = JSON.stringify(RangeStorage.JsonRange(range)); 
    let key = String(window.location.href); 
    chrome.storage.local.get([key]).then((value)=>{
        let newVal = value[key]?[...value[key]]: []; 
        let index = newVal.length? `highlight-extension${Number(value[key][newVal.length - 1].id[value[key][newVal.length - 1].id.length -1] + 1)}`: `highlight-extension0`; 
        let currentColor = colorOptions.querySelector('input:checked').style.backgroundColor;  
        let dataOb = {id: index, data: jsonRange, color: currentColor, comment: ""}; 
        newVal.push(dataOb); 
        chrome.storage.local.set({[key]: newVal}).then(()=>{
            highlightRange(range, dataOb.color, dataOb.id); 
        })
    })
})

let url = String(document.location.href); 
let body = document.querySelector('body'); 
let currentColor = "yellow"; 
chrome.storage.local.get(["color"]).then((item)=>{
    currentColor = item["color"]? item["color"]: "yellow"; 
    colorOptions.querySelector(`input[id =${currentColor}]`).checked = true; 
})
window.onload = ()=>{
    showStoredRanges(url)
}
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
    temp.name = "colorChoice"; 
    temp.classList.add("color-icon");    
    temp.style.backgroundColor = colors[i]; 
    temp.addEventListener('click', ()=>{
        chrome.storage.local.set({["color"]: colors[i]}).then(()=>{
        })
    })
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

// Fetches and displays highlights that were stored from past visits to url
function showStoredRanges(url){
    chrome.storage.local.get([url]).then((val)=>{
        if(val[url]){
            let ranges = val[url]; 
            for(let i = 0; i < ranges.length; i++){
                let parsed = JSON.parse(ranges[i].data); 
                try{
                    let range = RangeStorage.getRangeFromJson(parsed); 
                    highlightRange(range, ranges[i].color, ranges[i].id); 
                }catch(error){
                    console.log("Highlighted element no longer exists"); 
                }
            }

        }
    })
}

// Returns array of all descending text nodes from a node
function getTextNodes(node, textNodes = []){
    for(let i = 0; i < node.childNodes.length; i++){
        let type = node.childNodes[i].nodeType; 
        if(type != 3){
            if(node.childNodes[i].nodeName == "IMG" || node.childNodes[i].nodeName == "MARK"){
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
function surroundNode(node, start, end, color = "yellow", id){
    // Notes: Consider TextNode splitText function
    let parent = node.parentNode; 
    let newNode = document.createElement("mark"); 
    newNode.style.backgroundColor = color; 
    newNode.id = id;
    let text = node.textContent; 
    let before = document.createTextNode(text.slice(0, start)); 
    let middle = document.createTextNode(text.slice(start, end)); 
    let after = document.createTextNode(text.slice(end, text.length));
    newNode.innerHTML = middle.textContent; 
    newNode.classList.add('highlight-plugin-mark'); 
    addHoverUI(newNode); 
    parent.insertBefore(before, node); 
    parent.insertBefore(newNode, node); 
    parent.insertBefore(after, node); 
    parent.removeChild(node) 
}
function addHoverUI(node){
    let temp = document.createElement('div'); 
    let remove = document.createElement('button'); 
    let comment = document.createElement('textarea');
    remove.textContent = "x";
    remove.classList.add('highlight-plugin-hover-remove'); 
    comment.classList.add('highlight-plugin-hover-comment');
    temp.append(remove, comment);  
    temp.classList.add('highlight-plugin-hover', 'highlight-plugin-hover-hide'); 
    node.appendChild(temp); 
    chrome.storage.local.get([url]).then((val)=>{
        let values = val[url]; 
        let obj = values.find((item)=>item.id == node.id); 
        comment.value = obj.comment; 
    })
    remove.addEventListener('click', ()=>{
        chrome.storage.local.get([url]).then((val)=>{
            let values = val[url]; 
            let newArr = values.filter((item)=>item.id != node.id); 
            chrome.storage.local.set({[url]: newArr}).then(()=>{
            })
        })
        let tempNode = node.querySelector('div[class="highlight-plugin-hover"]'); 
        node.removeChild(tempNode); 
        node.outerHTML = node.innerHTML; 
    })
    let doRemove = false; 
    node.addEventListener('mouseenter', (e)=>{
        temp.classList.remove('highlight-plugin-hover-hide'); 
        let tempHover = node.querySelector('div:hover')
        if(!tempHover){
            temp.style.left = `${e.layerX - temp.offsetWidth/2}px`; 

        }
        chrome.storage.local.get([url]).then((val)=>{
            let values = val[url]; 
            let newArr = [...values];
            let obj = newArr.find((item)=>item.id == node.id);
            comment.value = obj.comment; 
        })
        doRemove = true; 
    })
    node.addEventListener('mouseleave',(e)=>{
        doRemove = false; 
        setTimeout(() => {
            if(!doRemove){
                temp.classList.add('highlight-plugin-hover-hide');
            }
        }, 300);
        chrome.storage.local.get([url]).then((val)=>{
            let values = val[url]; 
            let newArr = [...values]; 
            let obj = newArr.find((item)=>item.id == node.id); 
            newArr[newArr.indexOf(obj)].comment = comment.value? comment.value: "";
            chrome.storage.local.set({[url]:newArr}).then(()=>{
            })
    })
    })
}

// Highlights a range of text with specified color
function highlightRange(range, color, id){
    let parent = range.commonAncestorContainer; 
    let start = range.startContainer; 
    let end = range.endContainer; 
    let startOffset = range.startOffset; 
    let endOffset = range.endOffset; 
    let canHighlight = false;
    
    
    if(parent.childNodes.length == 0){
        surroundNode(parent, startOffset, endOffset, color, id)
        return; 
    }
    let nodes = [...parent.childNodes]; 
    for(let i = 0; i < nodes.length; i++){
        if(nodes[i].nodeName != "#text"){
            let textNodes = getTextNodes(nodes[i]); 
            for(let j =0; j< textNodes.length; j++){
                if(textNodes[j] == end){
                    surroundNode(textNodes[j], 0, endOffset, color, id); 
                    canHighlight = false; 
                }
                else if(canHighlight){
                    console.log(textNodes[j]); 
                    surroundNode(textNodes[j], 0, textNodes[j].length, color, id); 
                }
                else if(textNodes[j] == start){
                    surroundNode(textNodes[j], startOffset, textNodes[j].length, color, id); 
                    canHighlight = true; 
                }
            }
        }
        else{
            if(nodes[i] == end){
                canHighlight = false; 
                surroundNode(nodes[i], 0, endOffset, color, id); 
            }
            else if(canHighlight){
                surroundNode(nodes[i], 0, nodes[i].length, color, id); 
            }
            else if(nodes[i] == start){
                canHighlight = true; 
                surroundNode(nodes[i], startOffset, nodes[i].length, color, id); 
            }
        } 
    }
}