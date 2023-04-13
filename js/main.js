window.addEventListener("load", () => {
    const tabs = document.querySelectorAll(".tabheader__item"),
        tabsContent = document.querySelectorAll(".tabcontent"),
        tabsParent = document.querySelector(".tabheader__items");

    function hideContent() {
        tabsContent.forEach((item) => {
            item.classList.add("hide");
            item.classList.remove("show");
        });

        tabs.forEach((item) => {
            item.classList.remove("tabheader__item_active");
        });
    }

    function showContent(i = 0) {
        tabsContent[i].classList.remove("hide");
        tabsContent[i].classList.add("show");
        tabs[i].classList.add("tabheader__item_active");
    }

    hideContent();
    showContent();

    tabsParent.addEventListener("click", (event) => {
        const target = event.target;

        if (target && target.classList.contains("tabheader__item")) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideContent();
                    showContent(i);
                }
            });
        }
    });

    //timer

    const deadline = "2023-05-20 00:00";

    function knowTime(time) {
        const t = Date.parse(time) - Date.parse(new Date()),
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / (1000 * 60 * 60)) % 24),
            minutes = Math.floor((t / (1000 * 60)) % 60),
            seconds = Math.floor((t / 1000) % 60);

        return {
            total: t,
            days,
            hours,
            minutes,
            seconds,
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        }
        return num;
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector);
        (days = timer.querySelector("#days")),
            (hours = timer.querySelector("#hours")),
            (minutes = timer.querySelector("#minutes")),
            (seconds = timer.querySelector("#seconds")),
            (startTimer = setInterval(updateClock, 1000));

        updateClock();

        function updateClock() {
            const t = knowTime(deadline);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(startTimer);
            }
        }
    }
    setClock(".timer", deadline);

    //modal

    const modalTrigger = document.querySelectorAll("[data-modal]"),
        modal = document.querySelector(".modal");

    function openModal() {
        modal.classList.add("show");
        modal.classList.remove("hide");
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimer);
        window.removeEventListener('scroll', showModalByScroll);
    };
    
    modalTrigger.forEach((el) => {
        el.addEventListener("click", openModal);
    });


    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
            closeModal();
        }
    })

    function closeModal() {
        modal.classList.add("hide");
        modal.classList.remove("show");
        document.body.style.overflow = '';
    };

    const modalTimer = setTimeout(openModal, 50000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

//Menu

    class MenuCard {                                                                                        //класс для создания карточки в меню
        constructor(src, alt, title, description, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.description = description;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
            this.classes = classes;
            this.transfer = 80;
            this.changeToRUB();
        }

        changeToRUB() {
            this.price = this.price*this.transfer
        }

        render () {
            const element = document.createElement('div');
            
            if (this.classes.length === 0) {
                this.element = 'menu__item'
                element.classList.add(this.element)
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }

            element.innerHTML = ` 
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.description}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
                </div> 
            `;
            this.parent.append(element);
        };
    };

    const getResource = async (url) => {                                                            //запрос данных из бд с карточками для меню
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status ${res.status}`);                        //поимка ошибки
        }

        return await res.json();
    };

    getResource('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {                                  
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        });

     //Forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        succes: 'Спасибо! Скоро мы c вами свяжемся',
        failrue: 'Что-то пошло не так...'
    };
    
    forms.forEach(item => {                 //привязывается обработчик  к формам
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {                                                      //функция отправки данных в бд
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json();
    }

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
        openModal();

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
            closeModal();
        }, 4000);
    }

    //slider

    const slides = document.querySelectorAll('.offer__slide'),
          slider = document.querySelector('.offer__slider'),
          prev = document.querySelector('.offer__slider-prev'),
          next = document.querySelector('.offer__slider-next'),
          total = document.querySelector('#total'),
          current = document.querySelector('#current'),
          slidesWrapper = document.querySelector('.offer__slider-wrapper'),
          slidesField = document.querySelector('.offer__slider-inner'),
          width = window.getComputedStyle(slidesWrapper).width;
    let slideIndex = 1;
    let offset = 0;

    if (slides.length < 10){
        total.textContent = `0${slides.length}`;
        current.textContent = `0${slideIndex}`;
    } else {
        total.textContent = slides.length;
        current.textContent = slideIndex;
    }

    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';
    
    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
        slide.style.width = width;
    });

    slider.style.position = 'relative';

    const indicators = document.createElement('ol'),
          dots = [];
    indicators.classList.add('carousel-indicators');
    slider.append(indicators);

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.classList.add('dot');
        if (i == 0) {
            dot.style.opacity = 1;
        }
        indicators.append(dot);
        dots.push(dot);
    }

    const currentIndex = () => {
        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }
    };

    const currentDot = () => {
        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = 1;
    }

    function deleteNotDigits (str) {
        return +str.replace(/\D/g, '');
    }

    next.addEventListener('click', () => {
        if (offset == deleteNotDigits(width) * (slides.length - 1)){
            offset = 0;
        } else {
            offset += deleteNotDigits(width);                  //сдвигается на ширину слайда вправо
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        currentIndex();

        currentDot();
    });

    prev.addEventListener('click', () => {
        if (offset == 0){
             offset = deleteNotDigits(width) * (slides.length - 1);
        } else {
            offset -= deleteNotDigits(width);                  //сдвигается на ширину слайда влево
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }

        currentIndex();

        currentDot();
    });

    dots.forEach(dot => {
        dot.addEventListener('click', e => {
            const slideTo = e.target.getAttribute('data-slide-to');

            slideIndex = slideTo;
            offset = offset = deleteNotDigits(width) * (slideTo - 1);

            slidesField.style.transform = `translateX(-${offset}px)`;

            currentIndex();

            currentDot();
        })
    })
    
});


