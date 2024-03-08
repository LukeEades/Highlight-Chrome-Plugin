document.addEventListener('keydown', ()=>{
    let node = document.createElement('div'); 
    node.style.backgroundColor = "yellow"; 
    let selected = window.getSelection(); 
    let range = selected.getRangeAt(0); 
    console.log(range);  
    let parent = range.commonAncestorContainer; 
    let start = range.startContainer; 
    let end = range.endContainer; 
    let endOffset = range.endOffset; 
    let canHighlight = false; 
    console.log(parent.childNodes); 
    if(parent.childNodes.length == 0){
        let textHighlight = parent.textContent.slice(range.startOffset, range.endOffset); 
        // Try checking for right location later; currently is taking first match
        parent.parentNode.innerHTML = parent.parentNode.innerHTML.replace(textHighlight, `<highlight style="background-color: yellow">${textHighlight}</highlight>`); 
        return; 
    }

    let nodes = parent.childNodes; 
    for(let i = 0; i < parent.childNodes.length; i++){
        if(nodes[i].contains(end)){
            if(end.nodeType != "#text"){
                break; 
            }
            canHighlight = false; 
            let textNodes = getTextNodes(nodes[i]); 
            for(let i = 0; i < textNodes.length; i++){
                // ERROR: Messing with child node in here somewhere
                if(textNodes[i] == end){
                    let text = end; 
                    let afterOffset = text.splitText(range.endOffset);
                    // text.parentNode.innerHTML = `<highlight style= "background-color: yellow;">${text.textContent}</highlight>${afterOffset.textContent}`
                    text.parentNode.innerHTML = text.parentNode.innerHTML.replace(text.textContent, `<highlight style= "background-color: yellow;">${text.textContent}</highlight>`); 
                    break; 
                }
                surroundNode(textNodes[i]); 
                
            }
            break; 
        }
        else if(canHighlight){
            // console.log("hell")
            if(nodes[i].nodeName == "#text"){
                surroundNode(nodes[i]); 
                continue; 
            }
            let textNodes = getTextNodes(nodes[i]); 
            for(let i = 0; i < textNodes.length; i++){
                surroundNode(textNodes[i]); 
            }
        }
        else if(nodes[i].contains(start)){
            canHighlight = true; 
            if(start.nodeName != "#text"){
                continue; 
            }
            if(nodes[i] == start){
                console.log(nodes[i].parentNode)
                // console.log("hello")
                let text = start; 
                let afterOffset = text.splitText(range.startOffset); 
                text.parentNode.innerHTML.replace(text.textContent, `<highlight style= "background-color: yellow;">${afterOffset.textContent}</highlight>`); 
            }
            let textNodes = getTextNodes(nodes[i]); 
            for(let i = 0; i < textNodes.length; i++){
                if(textNodes[i] == start){
                    let text = start; 
                    let afterOffset = text.splitText(range.startOffset); 
                    text.parentNode.innerHTML.replace(text.textContent, `<highlight style= "background-color: yellow;">${afterOffset.textContent}</highlight>`); 
                    continue; 
                }
                surroundNode(textNodes[i]); 
            }
        }
        
    // selected.collapseToEnd(); 
}})

// returns array of all descending text nodes from a node
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

function surroundNode(node){
    let parent = node.parentNode; 
    let newNode = document.createElement("highlight");
    newNode.style.backgroundColor = "yellow"; 
    // newNode.innerHTML = node.textContent; 
    // parent.insertBefore(newNode, node); 
    // parent.removeChild(node); 
    parent.removeChild(node); 
    parent.appendChild(newNode); 
    newNode.appendChild(node); 
    return node; 
}
