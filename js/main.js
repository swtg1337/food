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

    class MenuCard {
        constructor(src, alt, title, description, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.description = description;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
            this.classes = classes;
            this.transfer = 50;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.price*this.transfer
        }

        render () {
            const element = document.createElement('div');
            
            if (this.classes.length === 0) {
                this.element = '.menu__item'
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
        }

    }

    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        '.menu .container',
        'menu__item',
    ).render();

    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум”',
        'В меню “Премиум” мы     всячески  полезно       используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        20,
        '.menu .container',
        'menu__item'
    ).render();

    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        18,
        '.menu .container',
        'menu__item'
    ).render();

     //Forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        succes: 'Спасибо! Скоро мы c вами свяжемся',
        failrue: 'Что-то пошло не так...'
    };
    
    forms.forEach(item => {                 //привязываю обработчик  к формам
        postData(item);
    })

    function postData (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();                           //обнуляю поведение браузера при отправке формы

            const statusMessage = document.createElement('img');         //создаю ответ для пользователя
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);                                //добавляю ответ к форме

            
            const formData = new FormData (form);

            const object = {};
            formData.forEach( (value,key) => {                 //перевод в formdata в json
                object[key] = value;
            });

            fetch('server.php', {
                method: 'POST',
                header: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(object)
            })
            .then (data => data.text())
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

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
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
});

