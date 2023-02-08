import { ref } from "vue";

const useScrollAnchor = () => {
  const currentAnchor = ref("");

  const toAnchor = (anchor, offset = 0) => {
    currentAnchor.value = anchor;
    const targetElement = document.querySelector(`#${anchor}`);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - offset,
        behavior: "smooth"
      });
    }
  };

  const observerEvent = (options, callback) => {
    return new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.intersectionRatio > 0) {
          currentAnchor.value = entry.target.getAttribute("id");
          if (callback) callback(entry.target.getAttribute("id"));
        }
      });
    }, options);
  };

  return {
    currentAnchor,
    toAnchor,
    observerEvent
  };
};

export default useScrollAnchor;
