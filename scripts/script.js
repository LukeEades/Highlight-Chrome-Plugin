document.addEventListener('keydown', ()=>{
    let node = document.createElement('div'); 
    node.style.backgroundColor = "yellow"; 
    let selected = window.getSelection(); 
    // get parent node
    // if start node = end node just wrap with a tag inside the node
    // split at highlighted point
    // loop between start and end nodes
    // traverse down to text node
    // if start or end, find offset inside of node to highlight at
    // surround highlighted point with tag
    let range = selected.getRangeAt(0); 
    console.log(range);  
    let parent = range.commonAncestorContainer; 
    let start = range.startContainer; 
    let end = range.endContainer; 
    let endOffset = range.endOffset; 
    let canHighlight = false; 
    // if(parent.childNodes.length == 0){
    //     surroundNode(parent); 
    // }
    for(let i = 0; i < parent.childNodes.length; i++){
        if(parent.childNodes[i].contains(start)){
            canHighlight = true; 
            let text = getTextNodes(parent.childNodes[i])[0]; 
            let afterOffset = text.splitText(range.startOffset); 
            parent.childNodes[i].innerHTML = `${text.textContent}<highlight style="background-color: yellow;">${afterOffset.textContent}</hightlight>`; 
            // text.textContent = text + "<highlight>" + afterOffset + "</highlight>";
            console.log(text) 
            console.log(afterOffset)
        }
        else if(canHighlight){
            console.log(getTextNodes(parent.childNodes[i])); 
            let textNodes = getTextNodes(parent.childNodes[i]); 
            for(let i = 0; i <textNodes.length; i++){
                surroundNode(textNodes[i]); 
            }
        }
        if(parent.childNodes[i].contains(end)){
            canHighlight = false; 
            let text = getTextNodes(parent.childNodes[i])[0]; 
            let afterOffset = text.splitText(endOffset); 
            parent.childNodes[i].innerHTML = `<highlight style="background-color: yellow">${text.textContent}</highlight>${afterOffset.textContent}`; 
            break; 
        }
    }
    // console.log(range.commonAncestorContainer)
})

// returns array of all descending text nodes from a node
function getTextNodes(node, textNodes = []){
    for(let i = 0; i < node.childNodes.length; i++){
        let type = node.childNodes[i].nodeType; 
        if(type != 3){
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
