const DomStorage = (function(){
    const makeXpath = (element) => {
        // ERRORS: still having some problems with parsing to and from json
        let path = "/";
        let elementNames = []; 
        while(element != document.body){
            let textName = `/${element.tagName}`; 
            if(element.nodeName == "#text"){
                textName = `[contains(text(), "${element.textContent}")]/text()`
            }
            elementNames.push(textName); 
            element = element.parentNode; 
        }
        while(elementNames.length){
            path += `${elementNames.pop()}`; 
        }
        return path;
    }
    const getNodeFromPath = (path) => {
        let element = document.evaluate(path, document, null, XPathResult.ANY_TYPE, null); 
        return element.iterateNext(); 
    }
    return {makeXpath, getNodeFromPath}
})(); 

const RangeStorage = (function(){
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
    const getRangeFromJson = (rangeObject)=>{
        let range = new Range(); 
        range.setStart(DomStorage.getNodeFromPath(rangeObject.startContainer), rangeObject.startOffset, rangeObject.endOffset); 
        // range.commonAncestorContainer = DomStorage.getNodeFromPath(rangeObject.commonAncestorContainer); 
        range.setEnd(DomStorage.getNodeFromPath(rangeObject.endContainer), rangeObject.endOffset);  
        range.collapsed = rangeObject.collapsed; 
        return range; 
    }
    return {JsonRange, getRangeFromJson}
})(); 