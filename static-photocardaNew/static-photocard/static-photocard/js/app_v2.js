function getBengaliDate() {
  const date = new Date();
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('bn-BD', options);
}

const state = {
  template: "editorial",
  title: "চাঁদা একটি রাজনৈতিক অধিকার",
  subtitle: "স্বরাষ্ট্রমন্ত্রী সায়েদ আল জোহান",
  tag: "বাংলাদেশ",
  tagColor: "#ffffff",
  tagFontSize: 28,
  tagStyle: { bold: false, italic: false, underline: false },
  accent: "#ef6f47",

  // Image properties
  zoom: 1.14,
  imageSrc: "",
  fitMode: "contain",
  photoHeight: 541,
  photoX: 50,
  photoY: 50,
  autoBlur: false,

  // Custom template properties
  customTemplateSrc: "",
  customPhotoX: 12,
  customPhotoY: 14,
  customPhotoSize: 76,
  customTextY: 94,

  // Headline
  titleFontSize: 80,
  titleColor: "#ffffff",
  titleStyle: { bold: true, italic: false, underline: false },

  // Subtitle
  author: "স্বরাষ্ট্রমন্ত্রী সায়েদ আল জোহান",
  subtitleAlign: "distributed",
  subtitleFontSize: 38,
  subtitleColor: "#ffffff",
  subtitleStyle: { bold: true, italic: false, underline: false },

  // News Date
  date: getBengaliDate(),
  dateFontSize: 38,
  dateColor: "#ffffff",
  dateStyle: { bold: true, italic: false, underline: false },

  // TV Branding
  brandingAlign: "distributed",
  tvName: "",
  tvLabel: "tv",
  website: "www.januna.tv",
  facebook: "janunatelevision",
  youtube: "janunatvbd",
  extraText: "",
  watermark: "Januna",
  watermarkOpacity: 0,
  watermarkSize: 300,

  // Background
  bgColor: "#d10000",
  gradientStart: "#d10000",
  gradientEnd: "#990000",
  dottedOverlayOpacity: 60,

  // Advertisement
  hideAdBar: false,
  adMode: "text",
  marquee: "সস্তা বিজ্ঞাপন লাগান- ছবি ও টেক্সট দুইটাই হবে.",

  // Slogan
  hideSloganBar: false,
  slogan: "খবর যেভাবে, জানুন সেভাবে",

  // Visibility toggles
  showDivider: true,
  showLogo: true,
  showFacebook: true,
  showYoutube: true,
  showDottedBg: true,
  showWatermark: true,
  showFooter: false
};

const elements = {
  photoInput: document.querySelector("#photoInput"),
  templateInput: document.querySelector("#templateInput"),
  titleInput: document.querySelector("#titleInput"),
  subtitleInput: document.querySelector("#subtitleInput"),
  tagInput: document.querySelector("#tagInput"),
  tagSizeInput: document.querySelector("#tagSizeInput"),
  tagColorInput: document.querySelector("#tagColorInput"),
  tagBoldBtn: document.querySelector("#tagBoldBtn"),
  tagItalicBtn: document.querySelector("#tagItalicBtn"),
  tagUnderlineBtn: document.querySelector("#tagUnderlineBtn"),
  accentInput: document.querySelector("#accentInput"),
  zoomInput: document.querySelector("#zoomInput"),
  photoXInput: document.querySelector("#photoXInput"),
  photoYInput: document.querySelector("#photoYInput"),
  photoSizeInput: document.querySelector("#photoSizeInput"),
  textYInput: document.querySelector("#textYInput"),
  customControls: document.querySelector("#customControls"),
  editorialControls: document.querySelector("#editorialControls"),
  authorInput: document.querySelector("#authorInput"),
  dateInput: document.querySelector("#dateInput"),
  websiteInput: document.querySelector("#websiteInput"),
  facebookInput: document.querySelector("#facebookInput"),
  youtubeInput: document.querySelector("#youtubeInput"),
  marqueeInput: document.querySelector("#marqueeInput"),
  sloganInput: document.querySelector("#sloganInput"),
  hideSloganBarInput: document.querySelector("#hideSloganBarInput"),
  card: document.querySelector("#photoCard"),
  customTemplateImage: document.querySelector("#customTemplateImage"),
  cardImage: document.querySelector("#cardImage"),
  cardTitle: document.querySelector("#cardTitle"),
  cardSubtitle: document.querySelector("#cardSubtitle"),
  cardTag: document.querySelector("#cardTag"),
  cardAuthor: document.querySelector("#cardAuthor"),
  cardDate: document.querySelector("#cardDate"),
  cardStandardDate: document.querySelector("#cardStandardDate"),
  cardWebsite: document.querySelector("#cardWebsite"),
  cardFacebook: document.querySelector("#cardFacebook"),
  cardYoutube: document.querySelector("#cardYoutube"),
  cardSlogan: document.querySelector("#cardSlogan"),
  cardMarquee: document.querySelector("#cardMarquee"),
  downloadButton: document.querySelector("#downloadButton"),
  topExportBtn: document.querySelector("#topExportBtn"),
  sampleButton: document.querySelector("#sampleButton"),
  resetButton: document.querySelector("#resetButton"),
  topResetBtn: document.querySelector("#topResetBtn"),
  zoomOutBtn: document.querySelector("#zoomOutBtn"),
  zoomInBtn: document.querySelector("#zoomInBtn"),
  zoomFitBtn: document.querySelector("#zoomFitBtn"),
  zoomPercentVal: document.querySelector("#zoomPercentVal"),
  previewContainer: document.querySelector("#previewContainer"),
  statusText: document.querySelector("#statusText"),
  templateButtons: document.querySelectorAll(".template-option"),

  // New controls elements
  dropZone: document.querySelector("#dropZone"),
  browseBtn: document.querySelector("#browseBtn"),
  removeMediaBtn: document.querySelector("#removeMediaBtn"),
  fitModeSelect: document.querySelector("#fitModeSelect"),
  boxHeightInput: document.querySelector("#boxHeightInput"),
  positionXInput: document.querySelector("#positionXInput"),
  positionYInput: document.querySelector("#positionYInput"),
  autoBlurInput: document.querySelector("#autoBlurInput"),

  titleSizeInput: document.querySelector("#titleSizeInput"),
  titleColorInput: document.querySelector("#titleColorInput"),
  titleBoldBtn: document.querySelector("#titleBoldBtn"),
  titleItalicBtn: document.querySelector("#titleItalicBtn"),
  titleUnderlineBtn: document.querySelector("#titleUnderlineBtn"),

  subtitleAlignSelect: document.querySelector("#subtitleAlignSelect"),
  subtitleSizeInput: document.querySelector("#subtitleSizeInput"),
  subtitleColorInput: document.querySelector("#subtitleColorInput"),
  subtitleBoldBtn: document.querySelector("#subtitleBoldBtn"),
  subtitleItalicBtn: document.querySelector("#subtitleItalicBtn"),
  subtitleUnderlineBtn: document.querySelector("#subtitleUnderlineBtn"),

  dateSizeInput: document.querySelector("#dateSizeInput"),
  dateColorInput: document.querySelector("#dateColorInput"),
  dateBoldBtn: document.querySelector("#dateBoldBtn"),
  dateItalicBtn: document.querySelector("#dateItalicBtn"),
  dateUnderlineBtn: document.querySelector("#dateUnderlineBtn"),

  brandingAlignSelect: document.querySelector("#brandingAlignSelect"),
  tvNameInput: document.querySelector("#tvNameInput"),
  tvLabelInput: document.querySelector("#tvLabelInput"),
  extraTextInput: document.querySelector("#extraTextInput"),
  watermarkInput: document.querySelector("#watermarkInput"),
  watermarkOpacityInput: document.querySelector("#watermarkOpacityInput"),
  watermarkSizeInput: document.querySelector("#watermarkSizeInput"),

  bgColorInput: document.querySelector("#bgColorInput"),
  gradientStartInput: document.querySelector("#gradientStartInput"),
  gradientEndInput: document.querySelector("#gradientEndInput"),
  dottedOverlayInput: document.querySelector("#dottedOverlayInput"),

  hideAdBarInput: document.querySelector("#hideAdBarInput"),
  adModeSelect: document.querySelector("#adModeSelect"),

  showDividerInput: document.querySelector("#showDividerInput"),
  showLogoInput: document.querySelector("#showLogoInput"),
  showFacebookInput: document.querySelector("#showFacebookInput"),
  showYoutubeInput: document.querySelector("#showYoutubeInput"),
  showDottedBgInput: document.querySelector("#showDottedBgInput"),
  showWatermarkInput: document.querySelector("#showWatermarkInput"),
  showFooterInput: document.querySelector("#showFooterInput")
};

const sampleSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f5c36f"/>
      <stop offset="0.45" stop-color="#dd705d"/>
      <stop offset="1" stop-color="#3d6f97"/>
    </linearGradient>
    <linearGradient id="hill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2d5048"/>
      <stop offset="1" stop-color="#142a30"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="1200" fill="url(#sky)"/>
  <circle cx="885" cy="380" r="150" fill="#ffe7a8" opacity="0.9"/>
  <path d="M0 920 C210 760 370 795 555 940 C775 1110 955 980 1200 790 L1200 1500 L0 1500 Z" fill="url(#hill)"/>
  <path d="M0 1065 C240 910 470 1000 640 1135 C835 1290 1015 1200 1200 1040 L1200 1500 L0 1500 Z" fill="#0f2026" opacity="0.86"/>
  <path d="M145 760 C250 690 305 690 410 760" fill="none" stroke="#fff7d7" stroke-width="10" opacity="0.42"/>
  <path d="M715 650 C830 575 910 595 1018 690" fill="none" stroke="#fff7d7" stroke-width="10" opacity="0.3"/>
</svg>`;

function sampleDataUrl() {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(sampleSvg)}`;
}

function templateDataUrl() {
  const bg = state.bgColor || "#f8fafc";
  const innerBox = state.gradientEnd || "#d7e8da";
  const orangeLine = state.gradientStart || "#ef6f47";
  const templateSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1500">
  <rect width="1200" height="1500" fill="${bg}"/>
  <rect x="60" y="60" width="1080" height="1380" fill="none" stroke="#1f2530" stroke-width="8"/>
  <rect x="96" y="96" width="1008" height="1008" fill="${innerBox}"/>
  <path d="M96 1104 L1104 96" stroke="${orangeLine}" stroke-width="18" opacity="0.75"/>
  <rect x="96" y="1138" width="1008" height="230" fill="${bg}"/>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(templateSvg)}`;
}

function setStatus(text) {
  if (elements.statusText) elements.statusText.textContent = text;
}

function applyTextStyles(element, styleObj) {
  if (!element) return;
  element.style.fontWeight = styleObj.bold ? "bold" : "normal";
  element.style.fontStyle = styleObj.italic ? "italic" : "normal";
  element.style.textDecoration = styleObj.underline ? "underline" : "none";
}

function applyState() {
  elements.card.className = `photo-card template-${state.template}`;

  // Set real-time sync CSS properties
  elements.card.style.setProperty("--fit-mode", state.fitMode);
  elements.card.style.setProperty("--photo-height", state.photoHeight);
  elements.card.style.setProperty("--zoom", state.zoom);
  elements.card.style.setProperty("--photo-x", `${state.photoX}%`);
  elements.card.style.setProperty("--photo-y", `${state.photoY}%`);

  elements.card.style.setProperty("--tag-size", state.tagFontSize);
  elements.card.style.setProperty("--title-size", state.titleFontSize);
  elements.card.style.setProperty("--title-color", state.titleColor);
  
  elements.card.style.setProperty("--custom-photo-x", `${state.customPhotoX}%`);
  elements.card.style.setProperty("--custom-photo-y", `${state.customPhotoY}%`);
  elements.card.style.setProperty("--custom-photo-size", `${state.customPhotoSize}%`);
  elements.card.style.setProperty("--custom-text-y", `${state.customTextY}%`);

  elements.card.style.setProperty("--subtitle-size", state.subtitleFontSize);
  elements.card.style.setProperty("--subtitle-color", state.subtitleColor);

  let alignVal = "space-between";
  if (state.subtitleAlign === "left") alignVal = "flex-start";
  if (state.subtitleAlign === "right") alignVal = "flex-end";
  if (state.subtitleAlign === "center") alignVal = "center";
  elements.card.style.setProperty("--subtitle-align", alignVal);
  elements.card.style.setProperty("--subtitle-align-standard", state.subtitleAlign);

  elements.card.style.setProperty("--date-size", state.dateFontSize);
  elements.card.style.setProperty("--date-color", state.dateColor);

  elements.card.style.setProperty("--bg-gradient-start", state.gradientStart);
  elements.card.style.setProperty("--bg-gradient-end", state.gradientEnd);
  elements.card.style.setProperty("--bg-color", state.bgColor);
  elements.card.style.setProperty("--dot-opacity", state.dottedOverlayOpacity / 100);

  elements.card.style.setProperty("--watermark-opacity", state.watermarkOpacity / 100);
  elements.card.style.setProperty("--watermark-size", state.watermarkSize);

  // Toggle control visibility
  if (elements.customControls) {
    elements.customControls.classList.toggle("is-visible", state.template === "custom");
  }

  // Toggle visibility and modifier classes
  elements.card.classList.toggle("hide-divider", !state.showDivider);
  elements.card.classList.toggle("hide-logo", !state.showLogo);
  elements.card.classList.toggle("hide-facebook", !state.showFacebook);
  elements.card.classList.toggle("hide-youtube", !state.showYoutube);
  elements.card.classList.toggle("hide-dotted-bg", !state.showDottedBg);
  elements.card.classList.toggle("show-watermark", state.showWatermark);
  elements.card.classList.toggle("hide-ad-bar", state.hideAdBar);
  elements.card.classList.toggle("hide-slogan-bar", state.hideSloganBar);
  elements.card.classList.toggle("hide-footer", !state.showFooter);
  elements.card.classList.toggle("has-auto-blur", state.autoBlur);
  elements.card.classList.toggle("align-distributed", state.subtitleAlign === "distributed");
  elements.card.classList.toggle("hide-ad-icon", state.adMode === "text");

  // Update text contents
  if (elements.cardTitle) elements.cardTitle.textContent = state.title || "Untitled";
  if (elements.cardSubtitle) elements.cardSubtitle.textContent = state.subtitle || "Add a short line";
  if (elements.cardTag) {
    elements.cardTag.textContent = state.tag;
    elements.cardTag.style.color = state.tagColor;
    applyTextStyles(elements.cardTag, state.tagStyle);
    elements.cardTag.style.display = state.tag ? "" : "none";
  }

  const editorialImage = document.querySelector("#editorialImage");
  const editorialTitle = document.querySelector("#editorialTitle");
  if (editorialImage) editorialImage.src = state.imageSrc || sampleDataUrl();
  if (editorialTitle) {
    editorialTitle.textContent = state.title;
    editorialTitle.style.color = state.titleColor;
    editorialTitle.style.fontSize = `${state.titleFontSize}px`;
    applyTextStyles(editorialTitle, state.titleStyle);
    editorialTitle.style.display = state.title ? "" : "none";
  }

  const hasImage = Boolean(state.imageSrc);
  elements.card.classList.toggle("no-image", !hasImage);

  if (elements.cardImage) elements.cardImage.src = state.imageSrc || sampleDataUrl();
  elements.customTemplateImage.src = state.customTemplateSrc || templateDataUrl();

  // Text sync (Editorial / Generic)
  if (elements.cardTitle) {
    elements.cardTitle.textContent = state.title;
    elements.cardTitle.style.color = state.titleColor;
    elements.cardTitle.style.fontSize = `${state.titleFontSize}px`;
    applyTextStyles(elements.cardTitle, state.titleStyle);
    elements.cardTitle.style.display = state.title ? "" : "none";
  }

  if (elements.cardAuthor) {
    elements.cardAuthor.textContent = state.author;
    elements.cardAuthor.style.color = state.subtitleColor;
    elements.cardAuthor.style.fontSize = `${state.subtitleFontSize}px`;
    applyTextStyles(elements.cardAuthor, state.subtitleStyle);
    elements.cardAuthor.style.display = state.author ? "" : "none";
  }

  if (elements.cardSubtitle) {
    elements.cardSubtitle.textContent = state.author;
    elements.cardSubtitle.style.color = state.subtitleColor;
    elements.cardSubtitle.style.fontSize = `${state.subtitleFontSize}px`;
    applyTextStyles(elements.cardSubtitle, state.subtitleStyle);
    elements.cardSubtitle.style.display = state.author ? "" : "none";
  }

  if (elements.cardDate) {
    elements.cardDate.textContent = state.date;
    elements.cardDate.style.color = state.dateColor;
    elements.cardDate.style.fontSize = `${state.dateFontSize}px`;
    applyTextStyles(elements.cardDate, state.dateStyle);
    elements.cardDate.style.display = state.date ? "" : "none";
  }

  if (elements.cardStandardDate) {
    elements.cardStandardDate.textContent = state.date;
    elements.cardStandardDate.style.color = state.dateColor;
    elements.cardStandardDate.style.fontSize = `${state.dateFontSize}px`;
    applyTextStyles(elements.cardStandardDate, state.dateStyle);
    elements.cardStandardDate.style.display = state.date ? "" : "none";
  }

  elements.cardWebsite.textContent = state.website;
  elements.cardFacebook.textContent = state.facebook;
  elements.cardYoutube.textContent = state.youtube;
  elements.cardMarquee.textContent = state.marquee;

  // TV Branding texts
  const cardTvLabel = document.querySelector("#cardTvLabel");
  const cardTvName = document.querySelector("#cardTvName");
  const cardExtraText = document.querySelector("#cardExtraText");
  const cardWatermark = document.querySelector("#cardWatermark");

  if (cardTvLabel) cardTvLabel.textContent = state.tvLabel || "";
  if (cardTvName) {
    cardTvName.textContent = state.tvName || "";
    cardTvName.style.display = state.tvName ? "inline" : "none";
  }
  if (cardExtraText) {
    cardExtraText.textContent = state.extraText || "";
    cardExtraText.style.display = state.extraText ? "inline" : "none";
  }
  if (cardWatermark) cardWatermark.textContent = state.watermark || "";

  // Auto blur bg image sources
  const editorialBlurBgImage = document.querySelector("#editorialBlurBgImage");
  const standardBlurBgImage = document.querySelector("#standardBlurBgImage");
  if (editorialBlurBgImage) editorialBlurBgImage.src = state.imageSrc || sampleDataUrl();
  if (standardBlurBgImage) standardBlurBgImage.src = state.imageSrc || sampleDataUrl();

  elements.templateButtons.forEach((button) => {
    const isActive = button.dataset.template === state.template;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function syncInitialControlState() {
  if (elements.hideAdBarInput) state.hideAdBar = elements.hideAdBarInput.checked;
  if (elements.hideSloganBarInput) state.hideSloganBar = elements.hideSloganBarInput.checked;
  if (elements.showDividerInput) state.showDivider = elements.showDividerInput.checked;
  if (elements.showLogoInput) state.showLogo = elements.showLogoInput.checked;
  if (elements.showFacebookInput) state.showFacebook = elements.showFacebookInput.checked;
  if (elements.showYoutubeInput) state.showYoutube = elements.showYoutubeInput.checked;
  if (elements.showDottedBgInput) state.showDottedBg = elements.showDottedBgInput.checked;
  if (elements.showWatermarkInput) state.showWatermark = elements.showWatermarkInput.checked;
  if (elements.showFooterInput) state.showFooter = elements.showFooterInput.checked;
}

function resetState() {
  state.template = "editorial";
  state.title = "চাঁদা একটি রাজনৈতিক অধিকার";
  state.subtitle = "স্বরাষ্ট্রমন্ত্রী সায়েদ আল জোহান";
  state.tag = "বাংলাদেশ";
  state.tagColor = "#ffffff";
  state.tagFontSize = 28;
  state.tagStyle = { bold: false, italic: false, underline: false };
  state.accent = "#ef6f47";

  state.zoom = 1.14;
  state.imageSrc = "";
  state.fitMode = "cover";
  state.photoHeight = 541;
  state.photoX = 50;
  state.photoY = 50;
  state.autoBlur = false;

  state.customTemplateSrc = "";
  state.customPhotoX = 12;
  state.customPhotoY = 14;
  state.customPhotoSize = 76;
  state.customTextY = 94;

  state.titleFontSize = 80;
  state.titleColor = "#ffffff";
  state.titleStyle = { bold: true, italic: false, underline: false };

  state.author = "স্বরাষ্ট্রমন্ত্রী সায়েদ আল জোহান";
  state.subtitleAlign = "distributed";
  state.subtitleFontSize = 38;
  state.subtitleColor = "#ffffff";
  state.subtitleStyle = { bold: true, italic: false, underline: false };

  state.date = getBengaliDate();
  state.dateFontSize = 38;
  state.dateColor = "#ffffff";
  state.dateStyle = { bold: true, italic: false, underline: false };

  state.brandingAlign = "distributed";
  state.tvName = "";
  state.tvLabel = "tv";
  state.website = "www.januna.tv";
  state.facebook = "janunatelevision";
  state.youtube = "janunatvbd";
  state.extraText = "";
  state.watermark = "Januna";
  state.watermarkOpacity = 0;
  state.watermarkSize = 300;

  state.bgColor = "#d10000";
  state.gradientStart = "#d10000";
  state.gradientEnd = "#990000";
  state.dottedOverlayOpacity = 60;

  state.hideAdBar = true;
  state.adMode = "text";
  state.marquee = "সস্তা বিজ্ঞাপন লাগান- ছবি ও টেক্সট দুইটাই হবে.";

  state.hideSloganBar = false;
  state.slogan = "খবর যেভাবে, জানুন সেভাবে";

  state.showDivider = true;
  state.showLogo = true;
  state.showFacebook = true;
  state.showYoutube = true;
  state.showDottedBg = true;
  state.showWatermark = true;
  state.showFooter = false;

  // Sync inputs
  elements.titleInput.value = state.title;
  if (elements.subtitleInput) elements.subtitleInput.value = state.subtitle;
  elements.tagInput.value = state.tag;
  if (elements.tagColorInput) elements.tagColorInput.value = state.tagColor;
  if (elements.tagSizeInput) elements.tagSizeInput.value = state.tagFontSize;
  if (elements.accentInput) elements.accentInput.value = state.accent;
  elements.zoomInput.value = state.zoom;
  elements.photoXInput.value = state.customPhotoX;
  elements.photoYInput.value = state.customPhotoY;
  elements.photoSizeInput.value = state.customPhotoSize;
  elements.textYInput.value = state.customTextY;

  if (elements.fitModeSelect) elements.fitModeSelect.value = state.fitMode;
  if (elements.boxHeightInput) elements.boxHeightInput.value = state.photoHeight;
  if (elements.positionXInput) elements.positionXInput.value = state.photoX;
  if (elements.positionYInput) elements.positionYInput.value = state.photoY;
  if (elements.autoBlurInput) elements.autoBlurInput.checked = state.autoBlur;

  if (elements.titleSizeInput) elements.titleSizeInput.value = state.titleFontSize;
  if (elements.titleColorInput) elements.titleColorInput.value = state.titleColor;

  if (elements.authorInput) elements.authorInput.value = state.author;
  if (elements.subtitleAlignSelect) elements.subtitleAlignSelect.value = state.subtitleAlign;
  if (elements.subtitleSizeInput) elements.subtitleSizeInput.value = state.subtitleFontSize;
  if (elements.subtitleColorInput) elements.subtitleColorInput.value = state.subtitleColor;

  if (elements.dateInput) elements.dateInput.value = state.date;
  if (elements.dateSizeInput) elements.dateSizeInput.value = state.dateFontSize;
  if (elements.dateColorInput) elements.dateColorInput.value = state.dateColor;

  const updateToggleState = (btn, isActive) => {
    if (!btn) return;
    if (isActive) btn.classList.add("active");
    else btn.classList.remove("active");
  };

  updateToggleState(elements.titleBoldBtn, state.titleStyle.bold);
  updateToggleState(elements.titleItalicBtn, state.titleStyle.italic);
  updateToggleState(elements.titleUnderlineBtn, state.titleStyle.underline);

  updateToggleState(elements.subtitleBoldBtn, state.subtitleStyle.bold);
  updateToggleState(elements.subtitleItalicBtn, state.subtitleStyle.italic);
  updateToggleState(elements.subtitleUnderlineBtn, state.subtitleStyle.underline);

  updateToggleState(elements.dateBoldBtn, state.dateStyle.bold);
  updateToggleState(elements.dateItalicBtn, state.dateStyle.italic);
  updateToggleState(elements.dateUnderlineBtn, state.dateStyle.underline);
  
  updateToggleState(elements.tagBoldBtn, state.tagStyle.bold);
  updateToggleState(elements.tagItalicBtn, state.tagStyle.italic);
  updateToggleState(elements.tagUnderlineBtn, state.tagStyle.underline);

  if (elements.brandingAlignSelect) elements.brandingAlignSelect.value = state.brandingAlign;
  if (elements.tvNameInput) elements.tvNameInput.value = state.tvName;
  if (elements.tvLabelInput) elements.tvLabelInput.value = state.tvLabel;
  if (elements.websiteInput) elements.websiteInput.value = state.website;
  if (elements.facebookInput) elements.facebookInput.value = state.facebook;
  if (elements.youtubeInput) elements.youtubeInput.value = state.youtube;
  if (elements.extraTextInput) elements.extraTextInput.value = state.extraText;
  if (elements.watermarkInput) elements.watermarkInput.value = state.watermark;
  if (elements.watermarkOpacityInput) elements.watermarkOpacityInput.value = state.watermarkOpacity;
  if (elements.watermarkSizeInput) elements.watermarkSizeInput.value = state.watermarkSize;

  if (elements.bgColorInput) elements.bgColorInput.value = state.bgColor;
  if (elements.gradientStartInput) elements.gradientStartInput.value = state.gradientStart;
  if (elements.gradientEndInput) elements.gradientEndInput.value = state.gradientEnd;
  if (elements.dottedOverlayInput) elements.dottedOverlayInput.value = state.dottedOverlayOpacity;

  if (elements.hideAdBarInput) elements.hideAdBarInput.checked = state.hideAdBar;
  if (elements.adModeSelect) elements.adModeSelect.value = state.adMode;
  if (elements.marqueeInput) elements.marqueeInput.value = state.marquee;

  if (elements.hideSloganBarInput) elements.hideSloganBarInput.checked = state.hideSloganBar;
  if (elements.sloganInput) elements.sloganInput.value = state.slogan;

  if (elements.showDividerInput) elements.showDividerInput.checked = state.showDivider;
  if (elements.showLogoInput) elements.showLogoInput.checked = state.showLogo;
  if (elements.showFacebookInput) elements.showFacebookInput.checked = state.showFacebook;
  if (elements.showYoutubeInput) elements.showYoutubeInput.checked = state.showYoutube;
  if (elements.showDottedBgInput) elements.showDottedBgInput.checked = state.showDottedBg;
  if (elements.showWatermarkInput) elements.showWatermarkInput.checked = state.showWatermark;
  if (elements.showFooterInput) elements.showFooterInput.checked = state.showFooter;

  // Sync value display spans
  document.querySelector("#boxHeightVal").textContent = `${state.photoHeight}px`;
  document.querySelector("#zoomVal").textContent = `${state.zoom}x`;
  document.querySelector("#positionXVal").textContent = `${state.photoX}%`;
  document.querySelector("#positionYVal").textContent = `${state.photoY}%`;
  if (document.querySelector("#tagSizeVal")) document.querySelector("#tagSizeVal").textContent = `${state.tagFontSize}px`;
  document.querySelector("#titleSizeVal").textContent = `${state.titleFontSize}px`;
  document.querySelector("#subtitleSizeVal").textContent = `${state.subtitleFontSize}px`;
  document.querySelector("#dateSizeVal").textContent = `${state.dateFontSize}px`;
  document.querySelector("#watermarkOpacityVal").textContent = `${state.watermarkOpacity}%`;
  document.querySelector("#watermarkSizeVal").textContent = `${state.watermarkSize}px`;
  document.querySelector("#dottedOverlayVal").textContent = `${state.dottedOverlayOpacity}%`;

  elements.photoInput.value = "";
  elements.templateInput.value = "";
  applyState();
  setStatus("Reset");
}

function loadImageFile(file, onLoad) {
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    onLoad(reader.result);
    applyState();
  });
  reader.readAsDataURL(file);
}

function loadRaster(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.addEventListener("load", () => resolve(image));
    image.src = src;
  });
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function fitImage(ctx, image, x, y, width, height, zoom, forceCover = false) {
  const mode = forceCover ? "cover" : state.fitMode;
  const posX = forceCover ? 50 : state.photoX;
  const posY = forceCover ? 50 : state.photoY;

  if (state.autoBlur && mode === "contain" && !forceCover) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.clip();

    ctx.filter = "blur(20px) brightness(0.6)";
    fitImage(ctx, image, x, y, width, height, 1.15, true);
    ctx.restore();
  }

  const imageRatio = image.width / image.height;
  const frameRatio = width / height;
  let drawWidth, drawHeight;

  if (mode === "contain") {
    if (imageRatio > frameRatio) {
      drawWidth = width;
      drawHeight = drawWidth / imageRatio;
    } else {
      drawHeight = height;
      drawWidth = drawHeight * imageRatio;
    }
  } else {
    // Cover mode
    if (imageRatio > frameRatio) {
      drawHeight = height;
      drawWidth = drawHeight * imageRatio;
    } else {
      drawWidth = width;
      drawHeight = drawWidth / imageRatio;
    }
  }

  drawWidth *= zoom;
  drawHeight *= zoom;

  const drawX = x + (width - drawWidth) * (posX / 100);
  const drawY = y + (height - drawHeight) * (posY / 100);

  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.clip();
  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
  ctx.restore();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 3) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";

  words.forEach((word) => {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width <= maxWidth) {
      line = testLine;
      return;
    }
    if (line) lines.push(line);
    line = word;
  });

  if (line) lines.push(line);
  lines.slice(0, maxLines).forEach((textLine, index) => {
    ctx.fillText(textLine, x, y + index * lineHeight);
  });
}

function drawTextBlock(ctx, options) {
  const { x, y, width, color, titleSize, align = "left", shadow = false } = options;
  
  if (shadow) {
    ctx.shadowColor = "rgba(255, 255, 255, 0.78)";
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 2;
    ctx.shadowOffsetX = 0;
  } else {
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowOffsetX = 0;
  }
  const tagWeight = state.tagStyle && state.tagStyle.bold ? "bold" : "normal";
  const titleWeight = state.titleStyle && state.titleStyle.bold ? "bold" : "normal";
  const subtitleWeight = state.subtitleStyle && state.subtitleStyle.bold ? "bold" : "normal";

  ctx.textAlign = state.subtitleAlign === "distributed" ? "left" : state.subtitleAlign;
  ctx.fillStyle = state.tagColor;
  ctx.font = `${tagWeight} ${state.tagFontSize}px 'SolaimanLipi', Arial, sans-serif`;
  if (state.tagStyle.italic) ctx.font = `italic ${ctx.font}`;
  if (state.tagStyle.underline) {
      // Manual underline implementation simplified
  }
  ctx.letterSpacing = "4px";
  ctx.fillText(state.tag.toUpperCase(), x, y);
  ctx.letterSpacing = "0px";

  ctx.fillStyle = color;
  ctx.font = `${titleWeight} ${titleSize}px 'SolaimanLipi', Arial, sans-serif`;
  wrapText(ctx, state.title || "Untitled", x, y + titleSize, width, titleSize * 0.88, 2);

  ctx.font = `${subtitleWeight} ${state.subtitleFontSize}px 'SolaimanLipi', Arial, sans-serif`;
  ctx.fillStyle = state.subtitleColor;
  
  const authorText = state.author || "Add a short line";
  const dateText = state.date || "";
  const dateWeight = state.dateStyle && state.dateStyle.bold ? "bold" : "normal";
  
  if (state.subtitleAlign === "distributed") {
    ctx.textAlign = "left";
    wrapText(ctx, authorText, x, y + titleSize * 2.6, width / 2, 46, 3);
    if (dateText) {
      ctx.textAlign = "right";
      ctx.fillStyle = state.dateColor;
      ctx.font = `${dateWeight} ${state.dateFontSize}px 'SolaimanLipi', Arial, sans-serif`;
      ctx.fillText(dateText, x + width, y + titleSize * 2.6);
    }
  } else {
    // For left, center, right alignments, draw them side by side
    ctx.textAlign = state.subtitleAlign;
    let startX = x;
    if (state.subtitleAlign === "center") startX = x + width / 2;
    if (state.subtitleAlign === "right") startX = x + width;
    
    // Draw subtitle
    ctx.fillStyle = state.subtitleColor;
    ctx.font = `${subtitleWeight} ${state.subtitleFontSize}px 'SolaimanLipi', Arial, sans-serif`;
    ctx.fillText(authorText, startX, y + titleSize * 2.6);
    
    // Draw date below it if present, to keep it simple and avoid complex width measurements
    if (dateText) {
      ctx.fillStyle = state.dateColor;
      ctx.font = `${dateWeight} ${state.dateFontSize}px 'SolaimanLipi', Arial, sans-serif`;
      ctx.fillText(dateText, startX, y + titleSize * 2.6 + 46);
    }
  }
  
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowOffsetX = 0;
}

function exportCard() {
  Promise.all([
    loadRaster(state.imageSrc || sampleDataUrl()),
    loadRaster(state.customTemplateSrc || templateDataUrl()),
    loadRaster(DOT_B64),
    loadRaster(ICON_B64)
  ]).then(([image, customTemplate, dotPattern, logo]) => {
    const canvas = document.createElement("canvas");
    canvas.width = state.template === "editorial" ? 1080 : 1200;
    canvas.height = state.template === "editorial" ? 1080 : 1500;
    const ctx = canvas.getContext("2d");

    if (state.template === "poster") {
      ctx.fillStyle = state.bgColor;
      ctx.fillRect(0, 0, 1200, 1500);
      fitImage(ctx, image, 0, 0, 1200, 1500, state.zoom);
      const gradient = ctx.createLinearGradient(0, 520, 0, 1500);
      gradient.addColorStop(0, "rgba(16,19,26,0)");
      gradient.addColorStop(1, "rgba(16,19,26,0.88)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 520, 1200, 980);
      drawTextBlock(ctx, { x: 76, y: 1058, width: 1048, color: state.titleColor, titleSize: state.titleFontSize });
    }

    if (state.template === "polaroid") {
      ctx.fillStyle = state.bgColor;
      ctx.fillRect(0, 0, 1200, 1500);
      fitImage(ctx, image, 72, 72, 1056, 1040, state.zoom);
      ctx.strokeStyle = "rgba(31,37,48,0.15)";
      ctx.lineWidth = 3;
      ctx.strokeRect(72, 72, 1056, 1040);
      drawTextBlock(ctx, { x: 72, y: 1150, width: 1056, color: state.titleColor, titleSize: state.titleFontSize });
    }

    if (state.template === "editorial") {
      ctx.fillStyle = "#fff9f1";
      ctx.fillRect(0, 0, 1080, 1080);

      // Top Image Section
      fitImage(ctx, image, 0, 0, 1080, state.photoHeight, state.zoom);

      const footerHeight = state.showFooter ? 117 : 0;
      const sloganHeight = state.hideSloganBar ? 0 : 107;
      const marqueeHeight = state.hideAdBar ? 0 : 107;

      const footerY = 1080 - marqueeHeight - sloganHeight - footerHeight;
      const sloganY = footerY + footerHeight;
      const marqueeY = sloganY + sloganHeight;

      const bannerStartY = state.photoHeight;
      const bannerHeight = footerY - bannerStartY;

      // Banner Gradient
      const gradient = ctx.createLinearGradient(0, bannerStartY, 1080, bannerStartY + bannerHeight);
      gradient.addColorStop(0, state.gradientStart);
      gradient.addColorStop(1, state.gradientEnd);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, bannerStartY, 1080, bannerHeight);

      // Dot Overlay
      if (state.showDottedBg) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, bannerStartY, 1080, bannerHeight);
        ctx.clip();
        ctx.globalCompositeOperation = "lighten";
        ctx.globalAlpha = state.dottedOverlayOpacity / 100;
        const ratio = Math.max(1080 / dotPattern.width, bannerHeight / dotPattern.height);
        const dw = dotPattern.width * ratio;
        const dh = dotPattern.height * ratio;
        ctx.drawImage(dotPattern, (1080 - dw) / 2, bannerStartY + (bannerHeight - dh), dw, dh);
        ctx.restore();
      }

      // Text coordinates calculated relative to bannerHeight
      const usableHeight = bannerHeight - 43; // leave 43px space at the bottom for meta row
      const titleY = bannerStartY + usableHeight * 0.45;
      const dividerY = bannerStartY + usableHeight * 0.7;
      const metaRowY = footerY - 43;

      // Headline
      ctx.fillStyle = state.titleColor;
      ctx.font = `bold ${state.titleFontSize}px SolaimanLipi, Arial, sans-serif`;
      ctx.textAlign = "center";
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.fillText(state.title || "", 540, titleY);
      ctx.shadowColor = "transparent";

      // Divider
      if (state.showDivider) {
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.fillRect(108, dividerY - 1, 864, 2);
        ctx.fillStyle = state.gradientStart;
        ctx.save();
        ctx.translate(540, dividerY);
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(-6, -6, 12, 12);
        ctx.restore();
      }

      // Meta row
      ctx.fillStyle = state.subtitleColor;
      ctx.font = `bold ${state.subtitleFontSize}px SolaimanLipi, Arial, sans-serif`;

      if (state.subtitleAlign === "left") {
        ctx.textAlign = "left";
        ctx.fillText(state.author || "", 54, metaRowY);
      } else if (state.subtitleAlign === "right") {
        ctx.textAlign = "right";
        ctx.fillText(state.author || "", 1080 - 54, metaRowY);
      } else if (state.subtitleAlign === "center") {
        ctx.textAlign = "center";
        ctx.fillText(state.author || "", 540, metaRowY);
      } else {
        // Distributed
        ctx.textAlign = "left";
        ctx.fillText(state.author || "", 54, metaRowY);

        ctx.fillStyle = state.dateColor;
        ctx.font = `bold ${state.dateFontSize}px SolaimanLipi, Arial, sans-serif`;
        ctx.textAlign = "right";
        ctx.fillText(state.date || "", 1080 - 54, metaRowY);
      }

      if (state.showFooter) {
        // Footer Band overlay
        ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
        ctx.fillRect(0, footerY, 1080, footerHeight);

        // Logo
        if (state.showLogo) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(43 + 37.5, footerY + 21 + 37.5, 37.5, 0, 2 * Math.PI);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(logo, 43, footerY + 21, 75, 75);
          ctx.restore();

          ctx.font = "40px Arial, sans-serif";
          ctx.fillStyle = "rgba(255,255,255,0.5)";
          ctx.textAlign = "left";
          ctx.fillText("|", 140, footerY + 72);

          ctx.font = "bold 32px Arial, sans-serif";
          ctx.fillStyle = "white";
          ctx.fillText(state.tvLabel || "tv", 160, footerY + 70);

          if (state.tvName) {
            ctx.font = "bold 32px Arial, sans-serif";
            ctx.fillStyle = "white";
            ctx.fillText(state.tvName, 210, footerY + 70);
          }
        }

        // Footer Links
        ctx.textAlign = "right";
        ctx.font = "bold 30px Arial, sans-serif";

        let currentX = 1080 - 43;

        if (state.showYoutube && state.youtube) {
          ctx.fillText(state.youtube, currentX, footerY + 72);
          currentX -= ctx.measureText(state.youtube).width + 40;
        }

        if (state.showFacebook && state.facebook) {
          ctx.fillText(state.facebook, currentX, footerY + 72);
          currentX -= ctx.measureText(state.facebook).width + 40;
        }

        if (state.website) {
          ctx.fillText(state.website, currentX, footerY + 72);
        }
      }

    }

    if (state.template === "custom") {
      ctx.fillStyle = state.bgColor;
      ctx.fillRect(0, 0, 1200, 1500);
      fitImage(ctx, customTemplate, 0, 0, 1200, 1500, 1, true); // force cover for background
      const photoSize = state.customPhotoSize * 12;
      const photoX = state.customPhotoX * 12;
      const photoY = state.customPhotoY * 12;
      ctx.save();
      drawRoundedRect(ctx, photoX, photoY, photoSize, photoSize, 0);
      ctx.clip();
      fitImage(ctx, image, photoX, photoY, photoSize, photoSize, state.zoom);
      ctx.restore();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 12;
      ctx.strokeRect(photoX, photoY, photoSize, photoSize);
      drawTextBlock(ctx, {
        x: 80,
        y: state.customTextY * 12 + 24,
        width: 1040,
        color: state.titleColor,
        titleSize: state.titleFontSize,
        shadow: true
      });
    }

    // Global Bottom Bands (Slogan & Marquee)
    const isEditorialMode = state.template === "editorial";
    const cw = canvas.width;
    const ch = canvas.height;
    const scale = isEditorialMode ? 1 : (cw / 1080);

    const globalSloganHeight = state.hideSloganBar ? 0 : Math.ceil(107 * scale);
    const globalMarqueeHeight = state.hideAdBar ? 0 : Math.ceil(107 * scale);
    
    const globalSloganY = ch - globalMarqueeHeight - globalSloganHeight;
    const globalMarqueeY = ch - globalMarqueeHeight;

    if (!state.hideSloganBar) {
      ctx.fillStyle = "#1b1b1b";
      ctx.fillRect(0, globalSloganY, cw, globalSloganHeight + 1);

      ctx.font = `bold ${32 * scale}px 'SolaimanLipi', Arial, sans-serif`;
      const sloganText = state.slogan || "";
      const sloganWidth = ctx.measureText(sloganText).width;
      
      const totalWidth = 127 * scale + sloganWidth;
      const startX = cw - 43 * scale - totalWidth;

      ctx.save();
      ctx.beginPath();
      ctx.arc(startX + 37.5 * scale, globalSloganY + 16 * scale + 37.5 * scale, 37.5 * scale, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(logo, startX, globalSloganY + 16 * scale, 75 * scale, 75 * scale);
      ctx.restore();

      ctx.font = `${40 * scale}px Arial, sans-serif`;
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.textAlign = "left";
      ctx.fillText("|", startX + 97 * scale, globalSloganY + 70 * scale);

      ctx.font = `bold ${32 * scale}px 'SolaimanLipi', Arial, sans-serif`;
      ctx.fillStyle = "white";
      ctx.fillText(sloganText, startX + 127 * scale, globalSloganY + 70 * scale);
    }

    if (!state.hideAdBar) {
      ctx.fillStyle = "#241515";
      ctx.fillRect(0, globalMarqueeY, cw, globalMarqueeHeight + 1);
      ctx.font = `${43 * scale}px 'SolaimanLipi', Arial, sans-serif`;
      ctx.fillStyle = "white";
      ctx.textAlign = "center";

      let adText = state.marquee || "";
      if (state.adMode === "text-icon") {
        adText = "📢  " + adText;
      }
      ctx.fillText(adText, cw / 2, globalMarqueeY + 70 * scale);
    }

    // Draw Watermark
    if (state.showWatermark && state.watermark) {
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-30 * Math.PI / 180);
      ctx.fillStyle = `rgba(255, 255, 255, ${state.watermarkOpacity / 100})`;
      ctx.font = `900 ${state.watermarkSize}px Arial, Helvetica, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(state.watermark.toUpperCase(), 0, 0);
      ctx.restore();
    }

    const link = document.createElement("a");
    link.download = "photocard.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    setStatus("PNG downloaded");
  });
}

// Setup all new event listeners
if (elements.fitModeSelect) {
  elements.fitModeSelect.addEventListener("change", (e) => {
    state.fitMode = e.target.value;
    applyState();
  });
}
if (elements.boxHeightInput) {
  elements.boxHeightInput.addEventListener("input", (e) => {
    state.photoHeight = Number(e.target.value);
    document.querySelector("#boxHeightVal").textContent = `${state.photoHeight}px`;
    applyState();
  });
}
if (elements.positionXInput) {
  elements.positionXInput.addEventListener("input", (e) => {
    state.photoX = Number(e.target.value);
    document.querySelector("#positionXVal").textContent = `${state.photoX}%`;
    applyState();
  });
}
if (elements.positionYInput) {
  elements.positionYInput.addEventListener("input", (e) => {
    state.photoY = Number(e.target.value);
    document.querySelector("#positionYVal").textContent = `${state.photoY}%`;
    applyState();
  });
}
if (elements.autoBlurInput) {
  elements.autoBlurInput.addEventListener("change", (e) => {
    state.autoBlur = e.target.checked;
    applyState();
  });
}

if (elements.titleSizeInput) {
  elements.titleSizeInput.addEventListener("input", (e) => {
    state.titleFontSize = Number(e.target.value);
    document.querySelector("#titleSizeVal").textContent = `${state.titleFontSize}px`;
    applyState();
  });
}
if (elements.titleColorInput) {
  elements.titleColorInput.addEventListener("input", (e) => {
    state.titleColor = e.target.value;
    applyState();
  });
}

if (elements.subtitleAlignSelect) {
  elements.subtitleAlignSelect.addEventListener("change", (e) => {
    state.subtitleAlign = e.target.value;
    applyState();
  });
}
if (elements.subtitleSizeInput) {
  elements.subtitleSizeInput.addEventListener("input", (e) => {
    state.subtitleFontSize = Number(e.target.value);
    document.querySelector("#subtitleSizeVal").textContent = `${state.subtitleFontSize}px`;
    applyState();
  });
}
if (elements.subtitleColorInput) {
  elements.subtitleColorInput.addEventListener("input", (e) => {
    state.subtitleColor = e.target.value;
    applyState();
  });
}

if (elements.dateSizeInput) {
  elements.dateSizeInput.addEventListener("input", (e) => {
    state.dateFontSize = Number(e.target.value);
    document.querySelector("#dateSizeVal").textContent = `${state.dateFontSize}px`;
    applyState();
  });
}
if (elements.dateColorInput) {
  elements.dateColorInput.addEventListener("input", (e) => {
    state.dateColor = e.target.value;
    applyState();
  });
}

if (elements.brandingAlignSelect) {
  elements.brandingAlignSelect.addEventListener("change", (e) => {
    state.brandingAlign = e.target.value;
    applyState();
  });
}
if (elements.tvNameInput) {
  elements.tvNameInput.addEventListener("input", (e) => {
    state.tvName = e.target.value;
    applyState();
  });
}
if (elements.tvLabelInput) {
  elements.tvLabelInput.addEventListener("input", (e) => {
    state.tvLabel = e.target.value;
    applyState();
  });
}
if (elements.extraTextInput) {
  elements.extraTextInput.addEventListener("input", (e) => {
    state.extraText = e.target.value;
    applyState();
  });
}
if (elements.watermarkInput) {
  elements.watermarkInput.addEventListener("input", (e) => {
    state.watermark = e.target.value;
    applyState();
  });
}
if (elements.watermarkOpacityInput) {
  elements.watermarkOpacityInput.addEventListener("input", (e) => {
    state.watermarkOpacity = Number(e.target.value);
    document.querySelector("#watermarkOpacityVal").textContent = `${state.watermarkOpacity}%`;
    applyState();
  });
}
if (elements.watermarkSizeInput) {
  elements.watermarkSizeInput.addEventListener("input", (e) => {
    state.watermarkSize = Number(e.target.value);
    document.querySelector("#watermarkSizeVal").textContent = `${state.watermarkSize}px`;
    applyState();
  });
}

if (elements.bgColorInput) {
  elements.bgColorInput.addEventListener("input", (e) => {
    state.bgColor = e.target.value;
    state.gradientStart = e.target.value;
    state.gradientEnd = e.target.value;
    if (elements.gradientStartInput) elements.gradientStartInput.value = e.target.value;
    if (elements.gradientEndInput) elements.gradientEndInput.value = e.target.value;
    applyState();
  });
}
if (elements.gradientStartInput) {
  elements.gradientStartInput.addEventListener("input", (e) => {
    state.gradientStart = e.target.value;
    applyState();
  });
}
if (elements.gradientEndInput) {
  elements.gradientEndInput.addEventListener("input", (e) => {
    state.gradientEnd = e.target.value;
    applyState();
  });
}
if (elements.dottedOverlayInput) {
  elements.dottedOverlayInput.addEventListener("input", (e) => {
    state.dottedOverlayOpacity = Number(e.target.value);
    document.querySelector("#dottedOverlayVal").textContent = `${state.dottedOverlayOpacity}%`;
    applyState();
  });
}

if (elements.hideAdBarInput) {
  elements.hideAdBarInput.addEventListener("change", (e) => {
    state.hideAdBar = e.target.checked;
    applyState();
  });
}
if (elements.adModeSelect) {
  elements.adModeSelect.addEventListener("change", (e) => {
    state.adMode = e.target.value;
    applyState();
  });
}

if (elements.hideSloganBarInput) {
  elements.hideSloganBarInput.addEventListener("change", (e) => {
    state.hideSloganBar = e.target.checked;
    applyState();
  });
}
if (elements.sloganInput) {
  elements.sloganInput.addEventListener("input", (e) => {
    state.slogan = e.target.value;
    applyState();
  });
}

if (elements.showDividerInput) {
  elements.showDividerInput.addEventListener("change", (e) => {
    state.showDivider = e.target.checked;
    applyState();
  });
}
if (elements.showLogoInput) {
  elements.showLogoInput.addEventListener("change", (e) => {
    state.showLogo = e.target.checked;
    applyState();
  });
}
if (elements.showFacebookInput) {
  elements.showFacebookInput.addEventListener("change", (e) => {
    state.showFacebook = e.target.checked;
    applyState();
  });
}
if (elements.showYoutubeInput) {
  elements.showYoutubeInput.addEventListener("change", (e) => {
    state.showYoutube = e.target.checked;
    applyState();
  });
}
if (elements.showDottedBgInput) {
  elements.showDottedBgInput.addEventListener("change", (e) => {
    state.showDottedBg = e.target.checked;
    applyState();
  });
}
if (elements.showWatermarkInput) {
  elements.showWatermarkInput.addEventListener("change", (e) => {
    state.showWatermark = e.target.checked;
    applyState();
  });
}
if (elements.showFooterInput) {
  elements.showFooterInput.addEventListener("change", (e) => {
    state.showFooter = e.target.checked;
    applyState();
  });
}

// Drag & Drop event listeners
if (elements.dropZone) {
  elements.dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    elements.dropZone.classList.add("dragover");
  });

  elements.dropZone.addEventListener("dragleave", () => {
    elements.dropZone.classList.remove("dragover");
  });

  elements.dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    elements.dropZone.classList.remove("dragover");
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      loadImageFile(e.dataTransfer.files[0], (src) => {
        state.imageSrc = src;
        applyState();
        setStatus("Photo loaded via Drag & Drop");
      });
    }
  });

  if (elements.browseBtn) {
    elements.browseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      elements.photoInput.click();
    });
  }
  const browseLink = elements.dropZone.querySelector(".browse-link");
  if (browseLink) {
    browseLink.addEventListener("click", (e) => {
      e.stopPropagation();
      elements.photoInput.click();
    });
  }
  elements.dropZone.addEventListener("click", () => {
    elements.photoInput.click();
  });
}

if (elements.removeMediaBtn) {
  elements.removeMediaBtn.addEventListener("click", () => {
    state.imageSrc = "";
    elements.photoInput.value = "";
    applyState();
    setStatus("Main media removed");
  });
}

// Marquee direct editing on card
if (elements.cardMarquee) {
  elements.cardMarquee.addEventListener("input", (e) => {
    state.marquee = e.target.textContent;
    if (elements.marqueeInput) elements.marqueeInput.value = state.marquee;
  });
}

// Slogan direct editing on card
if (elements.cardSlogan) {
  elements.cardSlogan.addEventListener("input", (e) => {
    state.slogan = e.target.textContent;
    if (elements.sloganInput) elements.sloganInput.value = state.slogan;
  });
}

// Core listeners
if (elements.photoInput) {
  elements.photoInput.addEventListener("change", (event) => {
    loadImageFile(event.target.files[0], (src) => {
      state.imageSrc = src;
      applyState();
      setStatus("Photo loaded");
    });
  });
}

elements.templateInput.addEventListener("change", (event) => {
  loadImageFile(event.target.files[0], (src) => {
    state.customTemplateSrc = src;
    state.template = "custom";
    applyState();
    setStatus("Custom template loaded");
  });
});

elements.titleInput.addEventListener("input", (event) => {
  state.title = event.target.value;
  applyState();
});

if (elements.tagInput) {
  elements.tagInput.addEventListener("input", (event) => {
    state.tag = event.target.value;
    applyState();
  });
}

if (elements.tagColorInput) {
  elements.tagColorInput.addEventListener("input", (event) => {
    state.tagColor = event.target.value;
    applyState();
  });
}

if (elements.tagSizeInput) {
  elements.tagSizeInput.addEventListener("input", (event) => {
    state.tagFontSize = Number(event.target.value);
    document.querySelector("#tagSizeVal").textContent = `${state.tagFontSize}px`;
    applyState();
  });
}

elements.zoomInput.addEventListener("input", (event) => {
  state.zoom = Number(event.target.value);
  document.querySelector("#zoomVal").textContent = `${state.zoom}x`;
  applyState();
});

if (elements.dateInput) {
  elements.dateInput.addEventListener("input", (event) => {
    state.date = event.target.value;
    applyState();
  });
}

function setupStyleToggles(styleObj, boldBtn, italicBtn, underlineBtn) {
  if (boldBtn) {
    boldBtn.addEventListener("click", () => {
      styleObj.bold = !styleObj.bold;
      boldBtn.classList.toggle("active", styleObj.bold);
      applyState();
    });
  }
  if (italicBtn) {
    italicBtn.addEventListener("click", () => {
      styleObj.italic = !styleObj.italic;
      italicBtn.classList.toggle("active", styleObj.italic);
      applyState();
    });
  }
  if (underlineBtn) {
    underlineBtn.addEventListener("click", () => {
      styleObj.underline = !styleObj.underline;
      underlineBtn.classList.toggle("active", styleObj.underline);
      applyState();
    });
  }
}

setupStyleToggles(state.titleStyle, elements.titleBoldBtn, elements.titleItalicBtn, elements.titleUnderlineBtn);
setupStyleToggles(state.subtitleStyle, elements.subtitleBoldBtn, elements.subtitleItalicBtn, elements.subtitleUnderlineBtn);
setupStyleToggles(state.dateStyle, elements.dateBoldBtn, elements.dateItalicBtn, elements.dateUnderlineBtn);
setupStyleToggles(state.tagStyle, elements.tagBoldBtn, elements.tagItalicBtn, elements.tagUnderlineBtn);

elements.photoXInput.addEventListener("input", (event) => {
  state.customPhotoX = Number(event.target.value);
  applyState();
});

elements.photoYInput.addEventListener("input", (event) => {
  state.customPhotoY = Number(event.target.value);
  applyState();
});

elements.photoSizeInput.addEventListener("input", (event) => {
  state.customPhotoSize = Number(event.target.value);
  applyState();
});

elements.textYInput.addEventListener("input", (event) => {
  state.customTextY = Number(event.target.value);
  applyState();
});

elements.templateButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.template = button.dataset.template;
    applyState();
    setStatus(`${button.textContent.trim()} template`);
  });
});

elements.downloadButton.addEventListener("click", exportCard);
if (elements.topExportBtn) elements.topExportBtn.addEventListener("click", exportCard);
elements.sampleButton.addEventListener("click", () => {
  state.imageSrc = "";
  elements.photoInput.value = "";
  applyState();
  setStatus("Sample active");
});

if (elements.photoInput) {
  elements.photoInput.addEventListener("change", (event) => {
    if (!event.target.files || !event.target.files[0]) return;
    loadImageFile(event.target.files[0], (src) => {
      state.imageSrc = src;
      applyState();
      setStatus("Photo loaded");
    });
  });
}
elements.resetButton.addEventListener("click", resetState);
if (elements.topResetBtn) elements.topResetBtn.addEventListener("click", resetState);

// Zoom Logic for Preview Stage
let currentPreviewZoom = 1;
function updatePreviewZoom() {
  if (elements.card) {
    elements.card.style.transform = `scale(${currentPreviewZoom})`;
    elements.card.style.transformOrigin = 'center center';
  }
  if (elements.zoomPercentVal) {
    elements.zoomPercentVal.textContent = `${Math.round(currentPreviewZoom * 100)}%`;
  }
}

if (elements.zoomInBtn) {
  elements.zoomInBtn.addEventListener("click", () => {
    currentPreviewZoom = Math.max(0.2, currentPreviewZoom - 0.1);
    updatePreviewZoom();
  });
}

if (elements.zoomOutBtn) {
  elements.zoomOutBtn.addEventListener("click", () => {
    currentPreviewZoom += 0.1;
    updatePreviewZoom();
  });
}

const tvBrandingToggle = document.querySelector("#tvBrandingToggle");
const tvBrandingContent = document.querySelector("#tvBrandingContent");
const tvBrandingChevron = document.querySelector("#tvBrandingChevron");

if (tvBrandingToggle && tvBrandingContent && tvBrandingChevron) {
  tvBrandingToggle.addEventListener("click", () => {
    const isHidden = tvBrandingContent.style.display === "none";
    if (isHidden) {
      tvBrandingContent.style.display = "flex";
      tvBrandingChevron.classList.remove("fa-chevron-down");
      tvBrandingChevron.classList.add("fa-chevron-up");
    } else {
      tvBrandingContent.style.display = "none";
      tvBrandingChevron.classList.remove("fa-chevron-up");
      tvBrandingChevron.classList.add("fa-chevron-down");
    }
  });
}

if (elements.zoomFitBtn) {
  elements.zoomFitBtn.addEventListener("click", () => {
    // Attempt to calculate fit based on container size vs card size
    if (elements.previewContainer && elements.card) {
      const containerWidth = elements.previewContainer.clientWidth - 40; // padding
      const containerHeight = elements.previewContainer.clientHeight - 40;
      const cardRect = elements.card.getBoundingClientRect();
      const unscaledWidth = cardRect.width / currentPreviewZoom;
      const unscaledHeight = cardRect.height / currentPreviewZoom;
      const scaleX = containerWidth / unscaledWidth;
      const scaleY = containerHeight / unscaledHeight;
      currentPreviewZoom = Math.min(scaleX, scaleY, 1);
    } else {
      currentPreviewZoom = 1;
    }
    updatePreviewZoom();
  });
}

// Initial zoom setup
updatePreviewZoom();

const imageWraps = document.querySelectorAll(".image-wrap");
imageWraps.forEach(wrap => {
  wrap.addEventListener("click", () => {
    if (!state.imageSrc) {
      elements.photoInput.click();
    }
  });

  wrap.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (!state.imageSrc) wrap.classList.add("dragover");
  });

  wrap.addEventListener("dragleave", () => {
    wrap.classList.remove("dragover");
  });

  wrap.addEventListener("drop", (e) => {
    e.preventDefault();
    wrap.classList.remove("dragover");
    if (!state.imageSrc && e.dataTransfer.files && e.dataTransfer.files[0]) {
      elements.photoInput.files = e.dataTransfer.files;
      elements.photoInput.dispatchEvent(new Event("change"));
    }
  });
});

// Image drag-to-pan feature
let isDraggingImage = false;
let startDragX = 0;
let startDragY = 0;
let startPhotoX = 50;
let startPhotoY = 50;

elements.card.addEventListener("mousedown", (e) => {
  if (!state.imageSrc) return;
  if (e.target.tagName.toLowerCase() === "img" || e.target.classList.contains("image-wrap")) {
    e.preventDefault(); // prevent native drag
    isDraggingImage = true;
    startDragX = e.clientX;
    startDragY = e.clientY;
    startPhotoX = state.photoX;
    startPhotoY = state.photoY;
    elements.card.style.cursor = "grabbing";
  }
});

window.addEventListener("mousemove", (e) => {
  if (!isDraggingImage) return;
  const deltaX = e.clientX - startDragX;
  const deltaY = e.clientY - startDragY;
  
  const sensitivity = 0.2;
  
  let newX = startPhotoX - (deltaX * sensitivity);
  let newY = startPhotoY - (deltaY * sensitivity);
  
  newX = Math.max(0, Math.min(100, newX));
  newY = Math.max(0, Math.min(100, newY));
  
  state.photoX = Math.round(newX);
  state.photoY = Math.round(newY);
  
  if (elements.positionXInput) elements.positionXInput.value = state.photoX;
  if (elements.positionYInput) elements.positionYInput.value = state.photoY;
  const valX = document.querySelector("#positionXVal");
  if (valX) valX.textContent = `${state.photoX}%`;
  const valY = document.querySelector("#positionYVal");
  if (valY) valY.textContent = `${state.photoY}%`;
  
  applyState();
});

window.addEventListener("mouseup", () => {
  if (isDraggingImage) {
    isDraggingImage = false;
    elements.card.style.cursor = "";
  }
});

// Touch support
elements.card.addEventListener("touchstart", (e) => {
  if (!state.imageSrc || !e.touches[0]) return;
  if (e.target.tagName.toLowerCase() === "img" || e.target.classList.contains("image-wrap")) {
    isDraggingImage = true;
    startDragX = e.touches[0].clientX;
    startDragY = e.touches[0].clientY;
    startPhotoX = state.photoX;
    startPhotoY = state.photoY;
  }
}, {passive: true});

window.addEventListener("touchmove", (e) => {
  if (!isDraggingImage || !e.touches[0]) return;
  if (e.cancelable) e.preventDefault();
  
  const deltaX = e.touches[0].clientX - startDragX;
  const deltaY = e.touches[0].clientY - startDragY;
  const sensitivity = 0.3;
  
  let newX = startPhotoX - (deltaX * sensitivity);
  let newY = startPhotoY - (deltaY * sensitivity);
  
  newX = Math.max(0, Math.min(100, newX));
  newY = Math.max(0, Math.min(100, newY));
  
  state.photoX = Math.round(newX);
  state.photoY = Math.round(newY);
  
  if (elements.positionXInput) elements.positionXInput.value = state.photoX;
  if (elements.positionYInput) elements.positionYInput.value = state.photoY;
  const valX = document.querySelector("#positionXVal");
  if (valX) valX.textContent = `${state.photoX}%`;
  const valY = document.querySelector("#positionYVal");
  if (valY) valY.textContent = `${state.photoY}%`;
  
  applyState();
}, {passive: false});

window.addEventListener("touchend", () => {
  isDraggingImage = false;
});

if (elements.dateInput && !elements.dateInput.value) {
  elements.dateInput.value = state.date;
}

if (elements.authorInput) {
  elements.authorInput.addEventListener("input", (event) => {
    state.author = event.target.value;
    applyState();
  });
}

syncInitialControlState();
applyState();
