class Gameplay {
  constructor(field, difficulty) {
    this.el = document.querySelector(field);
    this.difficulty = difficulty;
    this.currentCardsQuantity = 0;
    this.availableCardIDs = [];  
  }
  
  init() {
    switch(this.difficulty) {
      case "easy":
        this.currentCardsQuantity = 8;
        this.el.classList.add('field-easy');
        break;
      case "medium":
        this.currentCardsQuantity = 16;
        this.el.classList.add('field-medium');
        break; 
      case "hard":
        this.currentCardsQuantity = 24;
        this.el.classList.add('field-hard');
        break;
    }
    this.el.classList.add('field-visible');
    this.formAvailableCardIDsArray(this.currentCardsQuantity);
    this.placeCards(this.currentCardsQuantity);
    this.showCards();
  }
  
  showCards() {  
    let query = document.querySelectorAll('.card');
    let suspend = setTimeout(function() {
      query.forEach(e => e.classList.add('visible'))
    }, 1);
  }
  
  placeCards(n) {
    let el = this.el;
    let initCard = this.initCard(el);    
    for (let i = 0; i < n; i++) {
      initCard(el);
    }
  }
  
  initCard(el) {
    let that = this;
    return function() {
      let card = new Card(el, skirt);
      card.setUniqueId(that.setCardId(that.availableCardIDs));
      card.el.addEventListener('click', card.turnCard(card.el));
    }
  }
  
  setCardId(arr) {
    return arr.pop();
  }
  
  formAvailableCardIDsArray(n) {
    for (let i = 0; i < (n / 2); i++) {
      this.availableCardIDs.push(i + 1);
      this.availableCardIDs.push(i + 1);
    }
    this.availableCardIDs.sort((a, b) => Math.random() - 0.5);
  }
  
}


