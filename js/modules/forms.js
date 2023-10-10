import { openModal, closeModal } from "./modal";
import { postData } from "../services/services";

function forms(formSelector, modalTimer) {

     const forms = document.querySelectorAll(formSelector);

     const message = {
         loading: 'img/form/spinner.svg',
         succes: 'Спасибо! Скоро мы c вами свяжемся',
         failrue: 'Что-то пошло не так...'
     };
     
     forms.forEach(item => {                 //привязывается обработчик  к формам
         bindPostData(item);
     });
 
     function bindPostData (form) {
         form.addEventListener('submit', (e) => {
             e.preventDefault();                           //обнуляется поведение браузера при отправке формы
 
             const statusMessage = document.createElement('img');         //создается ответ для пользователя
             statusMessage.src = message.loading;
             statusMessage.style.cssText = `
                 display: block;
                 margin: 0 auto;
             `;
             form.insertAdjacentElement('afterend', statusMessage);                                //добавляется ответ к форме
 
             const formData = new FormData (form);
 
             const json = JSON.stringify(Object.fromEntries(formData.entries()));              //из formData в json
 
             postData('http://localhost:3000/requests', json)                    //отправляю данные с формы в базу данных
             .then(data => {
                 console.log(data);
                 showThanksModal(message.succes);
                 statusMessage.remove();
             })
             .catch(() => {
                 showThanksModal(message.failrue);
             })
             .finally(() => {
                 form.reset();
             })
 
         });
      }
 
      function showThanksModal(message) {
         const prevModalDialog = document.querySelector('.modal__dialog');           
 
         prevModalDialog.classList.add('hide');                                      //скрывается модальное окно ввода данных
         openModal('.modal', modalTimer);
 
         const thanksModal = document.createElement('div');                          //формируется новое модальное окно ответа пользователю
         thanksModal.classList.add('modal__dialog');
         thanksModal.innerHTML = `
             <div class="modal__content">
                 <div class="modal__close" data-close>&times;</div>
                 <div class="modal__title">${message}</div>
             </div>
         `;
 
         document.querySelector('.modal').append(thanksModal);                           
         setTimeout(() => {
             thanksModal.remove();
             prevModalDialog.classList.add('show');
             prevModalDialog.classList.remove('hide');
             closeModal('.modal');
         }, 4000);
     }
}

export default forms;