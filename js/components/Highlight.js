class Highlight {
  constructor(nodeList) {
    this.nodes = nodeList;
    this.init();
  }
  
  init() {
    let nodes = this.nodes;
    nodes.forEach(node => {
      node.classList.remove('blink__container');
      let container = node.appendChild(document.createElement('div'));
      container.classList.add('blink__container');
      let blinkNode = container.appendChild(document.createElement('div'));
      blinkNode.classList.add('highlight');
    });
    
  }  
}
