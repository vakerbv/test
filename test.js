let startR = 0;
let colorsR = [];
while (startR <= 185) {
  colorsR.push(startR++);
}
let startB = 255;
let colorsB = [];
while (startB >= 70) {
  colorsB.push(startB--);
}

let r = 0, g = 0, b = 0;

setInterval(function() {
  let color = 'rgb(' + colorsR[r] + ',' + g + ',' + colorsB[b] + ')';
  document.body.style.backgroundColor = color;
  listLngIn.style.color = color;
  listLngOut.style.color = color;
  textArea.style.color = color;
  document.querySelector('.clear-area').style.color = color;
  if ((r += 2) && (b += 2) >= 185) {
    r = 1;
    b = 1;
    colorsR.reverse();
    colorsB.reverse();
  }
}, 1000);

let listLngIn = document.querySelector('#in-lng');
let listLngOut = document.querySelector('#out-lng');
let textArea = document.querySelector('textarea');
let translateArea = document.querySelector('.translate');

textArea.focus()

window.onload = function() {
  this.fetch('https://translate.yandex.net/api/v1.5/tr.json/getLangs?key=trnsl.1.1.20200511T104047Z.59acc9a93d746900.237106414337a7d8d6d3a861df0ea5d3715bb232&ui=ru')
    .then(function(response) {
      return response.json()
    })
    .then(function(response){
      console.log(response)
      for (let key in response.langs) {
        let optionIn = document.createElement('option');
        optionIn.setAttribute('index', key);
        optionIn.innerHTML = response.langs[key];
        listLngIn.append(optionIn);
        listLngIn.selectedIndex = 17;
        let optionOut = optionIn.cloneNode(true);
        listLngOut.append(optionOut);
        listLngOut.selectedIndex = 70
      }
    })
  
  document.addEventListener('keydown', function(ev) {
    if (!ev.shiftKey && ev.keyCode === 13) {
      ev.preventDefault()
      translate()
    }
  })

  document.addEventListener('keyup', function(ev) {
    if (textArea.value !== "") {
      ev.preventDefault()
      translate()
    }
  })

  function translate() {
    let text = textArea.value.replace(/\n/g,'<br/>');
    let lngIn = listLngIn.childNodes[listLngIn.selectedIndex].getAttribute('index');
    let lngOut = listLngOut.childNodes[listLngOut.selectedIndex].getAttribute('index');
    detect(text);
    fetch(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20200511T104047Z.59acc9a93d746900.237106414337a7d8d6d3a861df0ea5d3715bb232&text=${text}&lang=${lngIn}-${lngOut}&format=html`)
      .then(function(response) {
        return response.json()
      })
      .then(function(response) {
        console.log(response.text);
        translateArea.innerHTML = response.text.join('<br>');
        document.querySelector('.input-area').style.height = window.getComputedStyle(translateArea).height;

        if (response.code !== 200) {
          translate.innerHTML = 'Произошла ошибка при получении ответа от сервера:\n\n' + response.message;
          return;
        }
    
        if (response.text.length === 0) {
          translate.innerHTML = 'К сожалению, перевод для данного слова не найден';
          return;
        }
      })
  }

  function detect(text) {
    fetch(`https://translate.yandex.net/api/v1.5/tr.json/detect?key=trnsl.1.1.20200511T104047Z.59acc9a93d746900.237106414337a7d8d6d3a861df0ea5d3715bb232&text=${text}`)
      .then(function(response) {
        return response.json()
      })
      .then(function(response) {
        console.log(response.lang);
        for (let i = 1; listLngIn.children[i-1].getAttribute('index') != response.lang; i++){
            listLngIn.selectedIndex = i
        }
        if (listLngIn.selectedIndex === 70) {
          listLngOut.selectedIndex = 17
        }
        if (listLngIn.selectedIndex !== 70) {
          listLngOut.selectedIndex = 70
        }
      })
  }


  document.querySelector('.change-lng').onclick = changeLng

  function changeLng() {
    let firstLng = listLngIn.selectedIndex;
    let secondLng = listLngOut.selectedIndex;
    listLngIn.selectedIndex = secondLng;
    listLngOut.selectedIndex = firstLng
  }

  document.querySelector('.clear-area').onclick = clearInputArea

  function clearInputArea() {
    textArea.value = '';
    translateArea.textContent = '';
    document.querySelector('.input-area').style.height = '200px'
  }
}
