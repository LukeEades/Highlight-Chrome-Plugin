function StoreDom(){
    this.makeXpath = (element) => {
        let path = "/";
        let elementNames = []; 
        while(element != document.body){
            let textName = `/${element.tagName}`; 
            if(element.nodeName == "#text"){
                textName = `[contains(text(), "${element.textContent}")]`
            }
            elementNames.push(textName); 
            element = element.parentNode; 
        }
        while(elementNames.length){
            path += `${elementNames.pop()}`; 
        }
        return path; 
    }
    this.getNodeFromPath = (path) => {
        let element = document.evaluate(path, document, null, XPathResult.ANY_TYPE, null); 
        return element.iterateNext(); 
    }
}