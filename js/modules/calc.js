function calc() {

     const result = document.querySelector('.calculating__result span');
     let sex, weight, height, age, ratio;
 
     if (localStorage.getItem('sex')) {
         sex = localStorage.getItem('sex');
     } else {
         sex = 'female';
         localStorage.setItem('sex', sex);
     }
 
     if (localStorage.getItem('data-ratio')) {
         ratio = localStorage.getItem('data-ratio');
     } else {
         ratio = 1.375
         localStorage.setItem('data-ratio', ratio);
     }
  
     function calcTotal(){
         if (!sex || !weight || !height || !age || !ratio) {
             result.textContent = '____';
             return;
         }
 
         if (sex === 'female') {
             result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
         } else {
             result.textContent =  Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
         }
     }
 
     calcTotal();
 
     function initLocalSettings(selector, activeClass) {
         const elements = document.querySelectorAll(selector);
 
         elements.forEach(e => {
             e.classList.remove(activeClass);
             if (e.getAttribute('id') === localStorage.getItem('sex')) {
                 e.classList.add(activeClass);
             }
             if (e.getAttribute('data-ratio') === localStorage.getItem('data-ratio')) {
                 e.classList.add(activeClass);
             }
         });
     }
 
     initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');
     initLocalSettings('#gender div', 'calculating__choose-item_active');
 
     function getStaticInformation(selector, activeClass) {
         const elements = document.querySelectorAll(selector);
 
         elements.forEach(elem => {
             elem.addEventListener('click', (e) => {
                 if (e.target.getAttribute('data-ratio')) {
                     ratio = +e.target.getAttribute('data-ratio');
                     localStorage.setItem('data-ratio', ratio);
                 } else {
                     sex = e.target.getAttribute('id');
                     localStorage.setItem('sex', sex);
                 }
     
                 elements.forEach(elem => {
                     elem.classList.remove(activeClass);
                 });
     
                 e.target.classList.add(activeClass);
     
                 calcTotal();
             });
         });      
     }
     
     getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');
     getStaticInformation('#gender div', 'calculating__choose-item_active');
 
     function getDynamicInformation(selector) {
         const input = document.querySelector(selector);
 
         input.addEventListener('input', () => {
             if (input.value.match(/\D/g)) {
                 input.style.border = 'red 1px solid'
             } else {
                 input.style.border = 'none'
             }
 
             switch (input.getAttribute('id')){
                 case 'age':
                     age = +input.value;
                     break;
                 case 'height':
                     height = +input.value;
                     break;
                 case 'weight':
                     weight = +input.value;
                     break;
             }
             calcTotal();
         })
     }
 
     getDynamicInformation('#height');
     getDynamicInformation('#weight');
     getDynamicInformation('#age');  
}

export default calc;