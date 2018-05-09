class Card {
  constructor(field, skirt) {
    this.field = document.querySelector('#field');
    this.el = this.field.appendChild(document.createElement('div'));
    this.el.classList.add('card');
    this.el.classList.add('blink__container');
    this.back = this.el.appendChild(document.createElement('div'));
    this.back.classList.add('card-back');
    this.backImage = this.back.appendChild(document.createElement('img'));
    this.backImage.setAttribute("alt", "back");
    this.backImage.setAttribute("src", "img/backs/" + skirt + ".png");
    this.uniqueId = 0;
    this.isTurned = false;
  }
  
  setUniqueId(num) {
    this.uniqueId = num;
    this.setFace(num);
    return this.uniqueId;
  }
  
  setFace(num) {
    let front = this.el.appendChild(document.createElement('div'));
    front.classList.add('card-front');
    let face = front.appendChild(document.createElement('img'));
    face.setAttribute("alt", "Face");
    face.setAttribute('src', 'img/faces/' + num + '.png');   
  };
  
  turnCard(elem) {
    let that = this;
    let el = this.el;
    let turned = that.isTurned;
    
    return function(e) {
      e.preventDefault();
      elem.classList.toggle('turned-back');
      turned = !turned;
      global__count++; 
      
      if (global__count === 1) {
        global__previousCardID = that.uniqueId;
        global__previousCard = elem;
      }
      
      if (global__count === 2) {  
        if (elem === global__previousCard) {
          global__previousCard = undefined;
          global__previousCardID = 0;
          elem.classList.remove('turned-back');
        } else {
          that.watch();
          if (!global__match) {
            setTimeout(function() {
              global__previousCard.classList.remove('turned-back');
              elem.classList.remove('turned-back');
              global__previousCard = undefined;
              global__previousCardID = 0;
            }, 500);
          }
        }
        
        global__count = 0; 
        global__match = false;
      }
    }
  }
  
  watch() {
    if (this.uniqueId === global__previousCardID) {
      global__match = true;
      this.destroy(this.el);
      this.destroy(global__previousCard);      
    }
  }
  
  destroy(elem) {
    global__matchWatch();
    
    let backSide = elem.querySelectorAll('.card-back')[0];
    let backSideImg = backSide.querySelector('img');
    setTimeout(function() {
      elem.removeEventListener('click', Card.turnCard);
      backSide.remove();
      backSideImg.remove();
      elem.classList.remove('visible');
    }, 570);
  }
}

