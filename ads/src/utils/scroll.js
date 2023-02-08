export const scrollTo = (offset = 0) => {
  window.scrollTo({
    top: offset,
    behavior: "smooth"
  });
};

export const scrollToElement = ({ el, offset = 0 }) => {
  if (!el instanceof HTMLElement) return;
  const scrollY = window.pageYOffset;
  const elTop = el.getBoundingClientRect().top + scrollY - offset;
  window.scrollTo({
    top: elTop,
    behavior: "smooth"
  });
};
