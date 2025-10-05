import { stringTemplates } from "../config/Static_content_Client";

export function languageTranslatorUtil(language, ...properties) {

  let value = stringTemplates;
  for (const prop of properties) {
  
    value = value?.[prop];
  
    if (value === undefined){

       return null;
    }
  }

  
  return value[language?.toUpperCase()] ;


}


