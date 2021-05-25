if(window.localStorage.getItem('filterList') === null) {
    window.localStorage.setItem('filterList', JSON.stringify({ content: [] }));
}

window.localStorage.getItem('filterList').length > 100000 && window.localStorage.clear('filterList')

let filterList = JSON.parse(window.localStorage.getItem("filterList"))


if (document.readyState === "complete") {
    window.addEventListener('load', contentHandler)
} else {
    setTimeout(contentHandler, 1500)
}

function getContentList() {

    return new Promise((resolve, reject) => {
        let contents = {
            title: document.querySelectorAll('#dismissible #details #meta.ytd-rich-grid-media'),
            menus : document.querySelectorAll("#dismissible #details #menu.ytd-rich-grid-media button#button yt-icon")
        }

        if(contents) {
            resolve(contents)
        } else {
            reject(undefined)
        }
    })

    .then(contents => {
            let contentList = []
            contents['title'].forEach((contentItem, i) => {
                    let content = contentItem.innerText;
                    let contentFormatted = content.split('\n').slice(0, content.split('\n').length - 2).join(' ');
                    let menuBtn = contents['menus'][i]

                    contentList.push({ content: contentFormatted, menuBtn })
            })    

            return contentList
    })
}

//loop filter list
function getFilteredContent() {
    let list = getContentList()
    
    // loop over filters array and list array for each item
    return list.then((items) => {
            let filteredContent = {oldContent:[], newContent:[]}          

            if(filterList['content'] === null) {
                filteredContent['newContent'] = items
                return filteredContent
            } else {
                items.forEach(listItem => {
                        console.log(listItem)
                        filterList['content'].indexOf(listItem['content']) < 0 ? filteredContent['newContent'].push(listItem): filteredContent['oldContent'].push(listItem);
                })
                return filteredContent
            }

    })

}

function contentHandler() {

    let filterContent = getFilteredContent();
    
    filterContent.then((content) => {   
        let oldContent = content['oldContent'].map(item => { return item['content'] })
        let newContent = content['newContent'].map(item => { return item['content'] })
        let contentList = [...filterList['content'], ...newContent]

        // Remove later
        console.log(oldContent)

        window.localStorage.setItem('filterList', JSON.stringify({ content: contentList }))

        console.log(`${filterList['content'].length} items stored`)

        if (!oldContent.length) {
            console.log("Nothing to remove")
            return;
        } else {
            oldContent.length === 1 ? console.log(`Removing ${oldContent.length} item`) : console.log(`Removing ${oldContent.length} items`);
        }
        
        content['oldContent'].forEach((contentItem, i) => {

            console.log(`${i+1}.  ${contentItem['content']}`)

            setTimeout(() => {

                contentItem['menuBtn'].click()
                setTimeout(() => {
                    document.querySelectorAll('tp-yt-iron-dropdown yt-formatted-string').forEach(item => item.textContent === "Not interested" && item.click())
                }, 100)
            },(i+1)*200)
        })
    })
}
    
chrome.runtime.onMessage.addListener(gotMessage)

function gotMessage(message, sender, sendResponse) {
    console.log(message)
    message.action === "refresh" && contentHandler()
}
