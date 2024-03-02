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
    // console.log(parent.childNodes)
    let canHighlight = false; 
    for(let i = 0; i < parent.childNodes.length; i++){
        if(parent.childNodes[i].contains(start)){
            canHighlight = true; 
        }
        if(canHighlight){
            console.log(getTextNodes(parent.childNodes[i])); 
            let textNodes = getTextNodes(parent.childNodes[i]); 
            for(let i = 0; i <textNodes.length; i++){
                surroundNode(textNodes[i]); 
            }
        }
        if(parent.childNodes[i].contains(end)){
            canHighlight = false; 
        }
    }
    // console.log(range.commonAncestorContainer)
})

// returns array of all descending text nodes from a node
function getTextNodes(node, textNodes = []){
    //loop through all nodes
    //if it is a text node add it to the array
    // return array once all have been looped through
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
    parent.replaceChild(newNode, node); 
    newNode.appendChild(node); 
}
