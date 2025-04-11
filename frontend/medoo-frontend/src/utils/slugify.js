// utils/slugify.js
export const slugify = (text) => {
    return text
      .toLowerCase()
      .normalize("NFD") // xóa dấu tiếng Việt
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };
  