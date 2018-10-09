import Immutable from "immutable";
import EmojiConvertor from "emoji-js";

export function sortByDate(resourceData) {
  const dataCopy = copyDataAndValidate(resourceData);
  dataCopy.sort(function (a, b) {
    const first = a.latest_message.ts;
    const second = b.latest_message.ts;
    return second - first;
  });

  const convert = Immutable.fromJS(dataCopy);
  return convert;
}

function copyDataAndValidate(resourceData) {
  const validatedData = [];
  resourceData.forEach((resource) => {
    if (resource.get("latest_message")) {
      const dataObject = resource.toJS();
      validatedData.push(dataObject);
    }
  });
  return validatedData;
}

export function sortByDateChannelMessages(resourceData) {
  const dataCopy = resourceData.toJS();
  dataCopy.sort(function (a, b) {
    const first = a.ts;
    const second = b.ts;
    return second - first;
  });

  const convert = Immutable.fromJS(dataCopy);
  return convert;
}

function breakLineRefactor(text) {
  var str = text.replace(/(?:\r\n|\r|\n)/g, '<br>');
  return str;
}

export function messageNormalized(text, resources) {
  text = text.replace(/\*/g, '');
  text = breakLineRefactor(text);

  // Map users by tagName
  let userIndex = text.indexOf("<@");
  if (userIndex !== -1) {
    while (userIndex > -1) {
      const wordPatch = text.substring(userIndex, userIndex + 12);
      const wordUserID = text.substring(userIndex + 2, userIndex + 11);
      const wordNormalized = fetchUserTag(wordUserID, resources);
      text = text.replace(wordPatch, wordNormalized);
      userIndex = text.indexOf("<@", userIndex + 12);
    }
  }

  //Map files by file name
  let fileIndex = text.indexOf("<#");
  if (fileIndex !== -1) {
    while (fileIndex > -1) {
      const wordPatch = text.substring(fileIndex, fileIndex + 11);
      text = text.replace(wordPatch, "FILE...");
      fileIndex = text.indexOf("<#", fileIndex + 12);
    }
  }

  return text;
}

export function emojiInitialize() {
  const emoji = new EmojiConvertor();

  emoji.text_mode = false;
  emoji.include_title = true;
  emoji.rx_colons = true;
  emoji.supports_css = true;

  emoji.img_sets.apple.path = require('../../media/css/emoji.css');
  emoji.img_sets.apple.sheet = require('../../media/images/sheet_google_32.png');

  emoji.use_sheet = true;

  emoji.init_env();
  emoji.replace_mode = 'css';
  emoji.allow_native = true;

  return emoji;
}

export function fetchUserTag(user, resources) {
  return resources.getIn([user, "profile", "real_name_normalized"]);
}

export function fetchFile(im_data) {
  let file = null;
  const fileCheck = im_data.get("file") ? im_data.get("file") : null;

  if (fileCheck) {
    const fileType = im_data.getIn(["file", "pretty_type"]);
    if (fileType.includes("PNG") ||
        fileType.includes("GIF") ||
        fileType.includes("JPG") ||
        fileType.includes("JPEG") ||
        fileType.includes("PDF") ||
        fileType.includes("Plain Text") ||
        fileType.includes("Java")) {
      file = im_data.getIn(["file", "url_private"]);
    }
  }
  return file;
}

export function fetchFileType(im_data) {
  const fileType = im_data.getIn(["file", "pretty_type"]);
  return fileType;
}