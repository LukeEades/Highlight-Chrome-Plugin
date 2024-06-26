const DomStorage = (function(){
    // Constructs a valid Xpath to an element in the DOM
    const makeXpath = (element) => {
        let path = "";
        let elementNames = []; 
        while(element != document.body){
            const arr = [...element.parentNode.childNodes];
            let tempArr = arr.filter((item)=>item.nodeName == element.nodeName); 
            let num = tempArr.indexOf(element); 
                        
            let textName = `/${element.nodeName}` + ((num != -1 && tempArr.length > 1)? `[${num + 1}]`: ``); 
            if(element.nodeName == "#text"){
                textName = `/text()[${num + 1}]`
            }
            elementNames.push(textName); 
            element = element.parentNode; 
        }
        elementNames.push('/BODY', '/HTML'); 
        while(elementNames.length){
            path += `${elementNames.pop()}`; 
        }
        return path;
    }

    // Returns a node from a given valid Xpath
    const getNodeFromPath = (path) => {
        let element = document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        return element.singleNodeValue; 
    }
    return {makeXpath, getNodeFromPath}
})(); 

const RangeStorage = (function(){
    // Constructs a psuedo-range JSON valid object from a valid range
    const JsonRange = (range) => {
        return {
           commonAncestorContainer : DomStorage.makeXpath(range.commonAncestorContainer),
           startContainer : DomStorage.makeXpath(range.startContainer),
           startOffset : range.startOffset,
           endContainer : DomStorage.makeXpath(range.endContainer), 
           endOffset : range.endOffset,
           collapsed : range.collapsed 
        }
    }
    // Re-creates a range object from a json-ified(parsed) range object
    const getRangeFromJson = (rangeObject)=>{
        let range = new Range(); 
        range.setStart(DomStorage.getNodeFromPath(rangeObject.startContainer), rangeObject.startOffset); 
        range.setEnd(DomStorage.getNodeFromPath(rangeObject.endContainer), rangeObject.endOffset);  
        range.collapsed = rangeObject.collapsed; 
        return range; 
    }
    return {JsonRange, getRangeFromJson}
})(); 