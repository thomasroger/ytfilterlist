chrome.action.onClicked.addListener(filterList)

function filterList(tab) {
    let msg = { action: "refresh" }

    if (tab.url === 'https://www.youtube.com/') {
        chrome.tabs.sendMessage(tab.id, msg)
    }
}