window.addEventListener("load", () => {
  const body = document.querySelector("body")!;
  let isTouchDevice = false;
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(
      navigator.userAgent
    )
  ) {
    isTouchDevice = true;
    body.classList.add("is-touch-device");
  }

  const pointer = document.querySelector<HTMLElement>("#pointer");
  const pointer2 = document.querySelector<HTMLElement>("#pointer2");
  if (!pointer || !pointer2) return;

  if (isTouchDevice) {
    pointer.remove();
    pointer2.remove();

    return;
  }

  const halfPointerWidth = pointer.offsetWidth / 2;
  const halfPointerWidth2 = pointer2.offsetWidth / 2;

  function setPosition(x: number, y: number) {
    if (!pointer || !pointer2) return;
    pointer.style.transform = `translate3d(${x - halfPointerWidth}px, ${
      y - halfPointerWidth
    }px, 0)`;
    pointer2.style.transform = `translate3d(${x - halfPointerWidth2}px, ${
      y - halfPointerWidth2
    }px, 0)`;
  }

  body.addEventListener("mousemove", (e) => {
    window.requestAnimationFrame(() => {
      setPosition(e.clientX, e.clientY);
    });
  });
});
