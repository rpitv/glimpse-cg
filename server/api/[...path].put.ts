function setValueByPath(obj: any, pathArray: string[], value: any) {
  const lastKey = pathArray.pop();
  let current = obj;
  for (const key of pathArray) {
    // Find the key in current object, case-insensitively
    const foundKey = Object.keys(current).find(k => k.toLowerCase() === key.toLowerCase());
    if (foundKey) {
      current = current[foundKey];
    }
    else {
      current[key] = {};
      current = current[key];
    }
  }
  if (lastKey) {
    const foundKey = Object.keys(current).find(k => k.toLowerCase() === lastKey.toLowerCase());
    current[foundKey ?? lastKey] = value;
  }
}
