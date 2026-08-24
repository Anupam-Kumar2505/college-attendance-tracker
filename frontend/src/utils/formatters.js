export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const formatClassSection = (year, branch, classNumber, batch = null) => {
  let text = `${year} ${branch} C${classNumber}`;
  if (batch) {
    text += ` (Batch ${batch})`;
  }
  return text;
};
