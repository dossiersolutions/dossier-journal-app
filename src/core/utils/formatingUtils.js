import Immutable from "immutable";
import React from 'react';

export function sortByDate(resourceData){
  const dataCopy = resourceData.toJS();
  dataCopy.sort(function(a, b){
    const first = a.latest_message.ts;
    const second = b.latest_message.ts;
    return second - first;
  });

  const convert = Immutable.fromJS(dataCopy);
  return convert;
}

function breakLineRefactor(text){
  return text.split("\n").map(function (item, index) {
    return (
        <span key={index}>
            {item}
          <br/>
        </span>
    )
  });
  // text = text.replace(/\n/g," ");
  // return text;
}

export function messageNormalized(text, resources){
  text = text.replace(/\*/g,'');

  if(text.includes("<@")){
    const index = text.indexOf("<");
    const indexSecond = text.indexOf("@");
    if(indexSecond === index+1){
      const wordPatch = text.substring(index, index+12);
      const wordUserID = text.substring(index+2, index+11);
      const wordNormalized = fetchUserTag(wordUserID, resources);
      text = text.replace(wordPatch, wordNormalized)
    }
    return text;
  }
  if(text.includes("\n")){
    text = breakLineRefactor(text);
  }
  return text;
}

export function fetchUserTag(user, resources){
  return resources.getIn([user, "profile", "real_name_normalized"]);
}