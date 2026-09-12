const briefTab = document.querySelector("#brief-tab");
const storyTab = document.querySelector("#story-tab");
const briefPanel = document.querySelector("#brief-panel");
const storyPanel = document.querySelector("#story-panel");

function selectBioPanel(selectedTab, selectedPanel, hiddenTab, hiddenPanel) {
  selectedTab.setAttribute("aria-selected", "true");
  hiddenTab.setAttribute("aria-selected", "false");
  selectedPanel.hidden = false;
  hiddenPanel.hidden = true;
}

briefTab.addEventListener("click", () => {
  selectBioPanel(briefTab, briefPanel, storyTab, storyPanel);
});

storyTab.addEventListener("click", () => {
  selectBioPanel(storyTab, storyPanel, briefTab, briefPanel);
});
