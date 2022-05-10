const url = 'http://localhost:8080/'
const sendButton = document.querySelector('#search');
const hoursInput = document.querySelector('#hours');
const keywordsInput = document.querySelector('#words');
const errMsg = document.querySelector('#errMsg');
const newsBlock = document.querySelector('.news');
const bar = document.querySelector('.meter');
hideBar();

sendButton.addEventListener('click', async () => {
    errMsg.textContent = '';
    newsBlock.replaceChildren();
    bar.classList.remove('hide');
    const data = {};
    const keywordsString = keywordsInput.value;

    if (keywordsString.length === 0) {
        return;
    }
    data.hours = hoursInput.value;
    data.keywords = keywordsString.split(',');

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            const json = await response.json();
            if (json.length == 0) {
                hideBar();
                errMsg.textContent = 'Nothing found!'
            }
            await showNews(json);
        } else {
            hideBar();
            errMsg.textContent = 'Invalid values';
        }

    } catch (error) {
        hideBar();
        console.log(error);
        errMsg.textContent = 'An error occurred in server during the request!';
    }
});

function showNews(news) {
    if (Array.isArray(news)) {
        errMsg.textContent = 'Found ' + news.length + ' news';
        hideBar();
        news.forEach((el) => {
            const post = document.createElement('div');
            const title = '<h5>' + el.title + '</h5>';
            const date = '<div>' + el.date + '</div>';
            const desc = '<div>' + el.desc + '</div>';
            const link = '<a href="' + el.link + '">Read more..</a>';
            post.className = 'post';
            post.innerHTML = title + date + desc + link;
            newsBlock.appendChild(post);
        });
        return;
    }
    errMsg.textContent = 'Bad response';
}

function hideBar() {
    bar.classList.add('hide');
}
