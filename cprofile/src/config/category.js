import general from './general';

export const validCategory = [
  'Indust', // 產業類別
  'JobCat', // 職務類別
  'Major', // 科系類別
  'Skill', // 證照類別
  'AreaSch', // 學校地區類別
  'Area', // 地區類別
  'Abroad', // 留學國家類別
  'AreaWork', // 工業區類別
  'JobCatH', // 高階職務類別
  'Abil', // 技能類別
  'Tool', // 工具類別
];

export const getCategoryJSONUrl = (category) => {
  if (validCategory.includes(category)) {
    return `${general.staticUrl}/category-tool/json/${category}.json`;
  }
  return false;
}