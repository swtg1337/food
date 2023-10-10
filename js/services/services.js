const postData = async (url, data) => {
    const res = await fetch(url, {                                                      //функция отправки данных в бд
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: data
    });

    return await res.json();
};

async function getResource(url) {                                                            //запрос данных из бд с карточками для меню
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Could not fetch ${url}, status ${res.status}`);                        //поимка ошибки
    }

    return await res.json();
};

export {postData};
export {getResource};