function tabs(tabsSelector, tabsContentSelector, tabsParentSelector, activeClass) {

    const tabs = document.querySelectorAll(tabsSelector),
    tabsContent = document.querySelectorAll(tabsContentSelector),
    tabsParent = document.querySelector(tabsParentSelector);

    function hideContent() {
        tabsContent.forEach((item) => {
            item.classList.add("hide");
            item.classList.remove("show");
        });

        tabs.forEach((item) => {
            item.classList.remove(activeClass);
        });
    }

    function showContent(i = 0) {
        tabsContent[i].classList.remove('hide');
        tabsContent[i].classList.add('show');
        tabs[i].classList.add(activeClass);
    }

    hideContent();
    showContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains(tabsSelector.slice(1))) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideContent();
                    showContent(i);
                }
            });
        }
    });
}

export default tabs;