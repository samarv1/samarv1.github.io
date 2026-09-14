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

const storyImages = [...document.querySelectorAll("#story-panel .story-media img")];
const imageViewer = document.querySelector(".image-viewer");
const viewerStage = imageViewer.querySelector(".image-viewer__stage");
const viewerMedia = imageViewer.querySelector(".image-viewer__media");
const viewerImage = imageViewer.querySelector(".image-viewer__image");
const viewerCaption = imageViewer.querySelector(".image-viewer__caption");
const previousButton = imageViewer.querySelector(".image-viewer__control--previous");
const nextButton = imageViewer.querySelector(".image-viewer__control--next");
const closeButton = imageViewer.querySelector(".image-viewer__close");
let currentImageIndex = 0;

function showImage(index) {
  currentImageIndex = (index + storyImages.length) % storyImages.length;
  const selectedImage = storyImages[currentImageIndex];

  viewerImage.src = selectedImage.currentSrc || selectedImage.src;
  viewerImage.alt = selectedImage.alt;
  viewerCaption.textContent = selectedImage.alt;
}

function openImage(index) {
  showImage(index);
  imageViewer.showModal();
}

storyImages.forEach((image, index) => {
  image.tabIndex = 0;
  image.setAttribute("role", "button");
  image.draggable = false;

  image.addEventListener("click", () => openImage(index));
  image.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openImage(index);
    }
  });
});

previousButton.addEventListener("click", () => showImage(currentImageIndex - 1));
nextButton.addEventListener("click", () => showImage(currentImageIndex + 1));
closeButton.addEventListener("click", () => imageViewer.close());

viewerMedia.addEventListener("click", (event) => {
  const mediaBounds = viewerMedia.getBoundingClientRect();
  const clickedPreviousSide = event.clientX < mediaBounds.left + mediaBounds.width / 2;

  showImage(currentImageIndex + (clickedPreviousSide ? -1 : 1));
});

imageViewer.addEventListener("click", (event) => {
  if (event.target === imageViewer || event.target === viewerStage) {
    imageViewer.close();
  }
});

imageViewer.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    showImage(currentImageIndex - 1);
  } else if (event.key === "ArrowRight") {
    showImage(currentImageIndex + 1);
  }
});
