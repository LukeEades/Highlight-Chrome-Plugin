document.addEventListener('keydown', ()=>{
    let selected = window.getSelection(); 
    let range = selected.getRangeAt(0); 
    highlightRange(range, "red"); 
})    

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
    let parent = node.parentNode; 
    let newNode = document.createElement("highlight"); 
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