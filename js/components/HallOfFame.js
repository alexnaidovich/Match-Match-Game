class Hall {
  constructor() {
    this.el = document.querySelector('#hall');
    this.nameUl = this.el.querySelector('#hall-name');
    this.timeUl = this.el.querySelector('#hall-time');
    this.swapIndex = -1;
  }
  
  swap(results, objToInsert) {
    let index = this.swapIndex;
    results[9] = undefined;

    for (let i = 8; i >= index; i--) {
      results[i + 1] = results[i];
    }

    results[index] = objToInsert;
    this.writeResult(results);
    this.swapIndex = -1;
    return results;
  }
  
  getResult() {
    let diffResults = JSON.parse(storage.getItem(difficulty + ' results')) || false;
    let temp = 0;

    // If there ARE some results at local storage
    if (diffResults !== false) {
      for (let i = 0; i < 10; i++) {
        let s = diffResults[String(i)]['seconds'];
        if (global__currentGameSeconds <= s) {
          this.swapIndex = i;
          global__currentPlace = i + 1;
          break;
        } else {
          if (!diffResults[String(i + 1)]) {
            temp = i + 1;
            global__currentPlace = temp <= 9 ? temp : 0;
            if (temp > 9) return null;
            break;
          }
          continue;
        }
      }

      if (this.swapIndex >= 0) {        
        this.swap(diffResults, this.setResult(currentPlayer.firstName, currentPlayer.lastName, global__currentFinishTimeString, global__currentGameSeconds)); 
        return;
      } 
      
      // If there were no swapping
      // (player is about to take the last place,
      // but there are less than 10 results at Hall-Of-Fame)
      let result = this.setResult(currentPlayer.firstName, currentPlayer.lastName, global__currentFinishTimeString, global__currentGameSeconds);
      diffResults[temp] = result; 
      storage.setItem(difficulty + ' results', JSON.stringify(diffResults));
      return;
    }
    
    // If there was the first run of this difficulty at this browser
    // and there ARE NO results at local storage
    // (if diffResults === false)
    global__currentPlace = 1;
    storage.setItem(difficulty + ' results', JSON.stringify({"0" : this.setResult(currentPlayer.firstName, currentPlayer.lastName, global__currentFinishTimeString, global__currentGameSeconds)}));
    return;
  }
  
  setResult(name, surname, time, seconds) {
    let obj = {
      'name': name + " " + surname,
      'time': time,
      'seconds': seconds
    }
    return obj;
  }
  
  writeResult(obj) {
    let newResults = JSON.stringify(obj);
    storage.setItem(difficulty + ' results', newResults);
  }
    
  clearResults() {
    let namesList = this.nameUl.querySelectorAll('li');
    if (namesList.length === 0) return null;
    let timesList = this.timeUl.querySelectorAll('li');
    namesList.forEach(li => li.remove());
    timesList.forEach(li => li.remove());
  }

  showTop10ForDiff(difficulty) {
    this.clearResults();

    if (!storage.getItem(difficulty + ' results')) {
      let resultName = this.nameUl.appendChild(document.createElement('li'));
      resultName.innerText = 'No results yet.';

      return null;
    }

    let results = JSON.parse(storage.getItem(difficulty + ' results'));
    let resultsArray = [];
    for (let result in results) {
      resultsArray.push(results[result]);
    }
    for (let i = 0; i < resultsArray.length; i++) {
      let resultName = this.nameUl.appendChild(document.createElement('li'));
      resultName.innerText = resultsArray[i].name;
      let resultTime = this.timeUl.appendChild(document.createElement('li'));
      resultTime.innerText = resultsArray[i].time;
    }
  }
}
