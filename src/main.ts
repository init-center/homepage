window.addEventListener("load", function () {
  document.querySelectorAll<HTMLElement>(".icon").forEach((item) => {
    item.classList.add("ready");
  });
});
