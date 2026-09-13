document.getElementById("start-extension").addEventListener("click", async () => {
  const currentTab = await chrome.tabs.getCurrent();

  if (currentTab?.id !== undefined) {
    await chrome.tabs.remove(currentTab.id);
    return;
  }

  window.location.href = chrome.runtime.getURL("popup.html");
});