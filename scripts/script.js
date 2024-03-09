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
    let startOffset = range.startOffset; 
    let canHighlight = false; 
    console.log(parent.childNodes); 
    if(parent.childNodes.length == 0){
        let node = parent; 
        let newNode = document.createElement("highlight"); 
        newNode.style.backgroundColor = "yellow"; 

        let text = parent.textContent; 
        let before = document.createTextNode(text.slice(0, startOffset)); 
        let middle = document.createTextNode(text.slice(startOffset, endOffset)); 
        let after = document.createTextNode(text.slice(endOffset, text.length -1));
        newNode.innerHTML = middle.textContent; 
        node.parentNode.insertBefore(before, node); 
        node.parentNode.insertBefore(newNode, node); 
        node.parentNode.insertBefore(after, node); 
        node.parentNode.removeChild(node); 
        // console.log("before: ", before, "; highlight: ", highlight, "; after: ", after); 
        // parent.textContent = `${before}<highlight style="background-color: yellow">${highlight}</highlight>${after}`;  
        return; 
    }

    let nodes = parent.childNodes; 
    for(let i = 0; i < nodes.length; i++){
        if(nodes[i].nodeName != "#text"){
            let textNodes = getTextNodes(nodes[i]); 
            for(let j = 0; j < textNodes.length; j++){
                if(checkNode(textNodes[j])){
                    return; 
                } 
            }
        }
        else{
            console.log("end node: ", end); 
            if(nodes[i] == end){
                console.log("end: ", nodes[i]); 
                canHighlight = false; 
                let text = end; 
                let afterOffset = text.splitText(range.endOffset);
                let replaceText = `<highlight style= "background-color: yellow;">${text.textContent}</highlight>${afterOffset.textContent}`
                text.parentNode.innerHTML = text.parentNode.innerHTML.replace(text.textContent, replaceText); 
                break;  
            }else if(canHighlight){
                console.log("middle f: ", nodes[i])
                // surroundNode(nodes[i]); 
            }
            else if(nodes[i] == start){
                console.log("start: ", nodes[i]); 
                canHighlight = true; 
                let text = start; 
                let afterOffset = text.splitText(range.startOffset); 
                text.parentNode.innerHTML = text.parentNode.innerHTML.replace(text.textContent, `<highlight style= "background-color: yellow;">${afterOffset.textContent}</highlight>`); 
                continue;  
            }
        }
        
    }
    function checkNode(node){
        if(node == end){
            console.log("end: ", node); 
            canHighlight = false; 
            let text = end; 
            let afterOffset = text.splitText(range.endOffset);
            let replaceText = `<highlight style= "background-color: yellow;">${text.textContent}</highlight>${afterOffset.textContent}`
            text.parentNode.innerHTML = text.parentNode.innerHTML.replace(text.textContent, replaceText); 
            return true; 
        }else if(canHighlight){
            console.log("middle: ", node); 
            // surroundNode(node); 
        }
        else if(node == start){
            console.log("start: ", node); 
            canHighlight = true; 
            let text = start; 
            let afterOffset = text.splitText(range.startOffset); 
            text.parentNode.innerHTML.replace(text.textContent, `<highlight style= "background-color: yellow;">${afterOffset.textContent}</highlight>`); 
        } 
    }

})    

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
    parent.insertBefore(newNode, node); 
    parent.removeChild(node); 
    newNode.appendChild(node); 
    return parent; 
}
