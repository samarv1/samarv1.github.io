const copyEmailButton = document.querySelector(".identity__copy");
const copyEmailStatus = document.querySelector(".identity__copy-status");
const emailLink = document.querySelector(".identity__email a");
let copyEmailTimeout;

copyEmailButton.addEventListener("click", async () => {
  clearTimeout(copyEmailTimeout);
  copyEmailButton.classList.remove("is-copied");
  copyEmailStatus.textContent = "";

  try {
    await navigator.clipboard.writeText(emailLink.textContent.trim());
    copyEmailButton.classList.add("is-copied");
    copyEmailStatus.dataset.success = "true";
    copyEmailStatus.textContent = "Email address copied.";
    copyEmailTimeout = setTimeout(() => {
      copyEmailButton.classList.remove("is-copied");
      copyEmailStatus.textContent = "";
    }, 2000);
  } catch {
    copyEmailStatus.dataset.success = "false";
    copyEmailStatus.textContent = "Could not copy. Select and copy the email address.";
  }
});

let closeActiveNote;
let activeNotePinned = false;

document.querySelectorAll(".bio-annotation").forEach((annotation) => {
  const trigger = annotation.querySelector("button");
  const note = annotation.querySelector(".bio-annotation__note");
  let pinned = false;

  function hideNote() {
    if (closeActiveNote === hideNote) {
      closeActiveNote = undefined;
      activeNotePinned = false;
    }
    pinned = false;
    trigger.classList.remove("is-pinned");
    note.hidden = true;
  }

  function showNote() {
    if (closeActiveNote && closeActiveNote !== hideNote) closeActiveNote();
    closeActiveNote = hideNote;
    activeNotePinned = pinned;
    note.hidden = false;
    const triggerBounds = trigger.getBoundingClientRect();
    const { width: noteWidth, height: noteHeight } = note.getBoundingClientRect();
    note.classList.toggle("is-below", note.id === "films-note" || triggerBounds.top < noteHeight + 16);
    const left = Math.max(16, Math.min(triggerBounds.left, document.documentElement.clientWidth - noteWidth - 16));
    note.style.left = `${left - triggerBounds.left}px`;
    note.style.setProperty("--annotation-pointer", `${triggerBounds.left + triggerBounds.width / 2 - left - 4}px`);
  }

  annotation.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse" && !activeNotePinned) showNote();
  });
  annotation.addEventListener("pointerleave", () => {
    if (!pinned && !trigger.matches(":focus-visible")) hideNote();
  });
  trigger.addEventListener("focus", () => {
    if (trigger.matches(":focus-visible")) showNote();
  });
  trigger.addEventListener("blur", () => {
    if (!pinned) hideNote();
  });
  trigger.addEventListener("click", () => {
    if (pinned) {
      hideNote();
    } else {
      pinned = true;
      trigger.classList.add("is-pinned");
      showNote();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") hideNote();
  });
  document.addEventListener("click", (event) => {
    if (!annotation.contains(event.target)) hideNote();
  });
  window.addEventListener("resize", () => {
    if (!note.hidden) showNote();
  });
  window.addEventListener("scroll", () => {
    if (!note.hidden) showNote();
  }, { passive: true });
});

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
let openingRequest = 0;

function showImage(index) {
  currentImageIndex = (index + storyImages.length) % storyImages.length;
  const selectedImage = storyImages[currentImageIndex];

  viewerImage.src = selectedImage.currentSrc || selectedImage.src;
  viewerImage.alt = selectedImage.alt;
  viewerCaption.textContent = selectedImage.alt;
}

async function openImage(index) {
  const request = ++openingRequest;
  showImage(index);

  try {
    await viewerImage.decode();
  } catch {}

  if (request === openingRequest && !imageViewer.open) {
    imageViewer.showModal();
  }
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
