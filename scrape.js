(function () {
    const countClass = '.p-customize_emoji_wrapper__count';
    const imgClass = '.p-customize_emoji_list__image';
    const nameClass = 'b.black';

    let $scroll = $('[data-qa="slack_kit_scrollbar"]');
    let $count = $($(countClass).get(0));
    let count = parseInt($count.text(), 10);
    let data = {};
    let scrollTop = 0;
    let scrollIncr = 20;

    let interval = setInterval(scroll, 100);

    let $progress = $('<div><div class="pbar">&nbsp;</div></div>');
    $('body').append($progress);
    $progress.css({
        'position': 'fixed',
        'top': '20px',
        'right': '20px',
        'width': '200px',
        'height': '40px',
        'z-index': 99999,
        'background-color': 'white',
        'padding': '5px',
        'border': '1px solid gray',
    });
    $progress.find('.pbar').css({
        'width': 0,
        'background-color': 'red',
        'height': '100%',
    });

    function updateProgress($element, total, current) {
        $element.find('.pbar').css({
            'width': ((current / total) * 100).toString() + '%'
        });
    }

    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    function scroll() {
        scrollTop += scrollIncr;
        $scroll.scrollTop(scrollTop);

        data = grabData($scroll, data);
        updateProgress($progress, count, Object.keys(data).length);
    }

    function grabData($scroll, data) {
        let $rows = $('.c-virtual_list__item');

        $rows.each((index, row) => {
            let $row = $(row);
            const id = row.id;

            if (!data.hasOwnProperty(id)) {
                console.log(id);
                let $image = $row.find(imgClass);
                let $name = $row.find(nameClass);
                let $author = $row.find('.p-customize_emoji_list__author');
                data[id] = {
                    'name': $name.text(),
                    'src': $image.attr('src'),
                    'author': $author.text(),
                }
                hadNew = true;
            }

            if (getIdNum(id) >= count - 1) {
                download('emojis.json', JSON.stringify(data));
                window.clearInterval(interval);
            }
        });

        return data;
    }

    function getIdNum(id) {
        let num = id.replace(/[^0-9]/g, '');
        return parseInt(num, 10);
    }
})();
