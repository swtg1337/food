import tabs from './modules/tabs';
import calc  from './modules/calc';
import cards  from './modules/cards';
import forms  from './modules/forms';
import slider  from './modules/slider';
import timer  from './modules/timer';
import modal  from './modules/modal';
import { openModal } from './modules/modal';

window.addEventListener("load", () => {
        const modalTimer = setTimeout(() => openModal('.modal', modalTimer), 50000);

        tabs('.tabheader__item', '.tabcontent', '.tabheader__items', 'tabheader__item_active');
        calc();
        cards();
        forms('form', modalTimer);
        slider({
                container: '.offer__slider',
                nextArrow: '.offer__slider-next',
                prevArrow: '.offer__slider-prev',
                slide: '.offer__slide', 
                totalCounter: '#total',
                currentCounter: '#current',
                field: '.offer__slider-inner',
                wrapper: '.offer__slider-wrapper',
        });
        timer('.timer', '2023-12-12');
        modal('[data-modal]', '.modal', modalTimer);
});
