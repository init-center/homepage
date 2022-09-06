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

  if (isTouchDevice) {
    return;
  }

  const pointer = document.createElement("div");
  const pointer2 = document.createElement("div");
  pointer.id = "pointer";
  pointer2.id = "pointer2";
  body.appendChild(pointer);
  body.appendChild(pointer2);

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

  let pointerShown = false;

  document.addEventListener("mousemove", (e) => {
    window.requestAnimationFrame(() => {
      if (!pointerShown) {
        pointer.classList.add("pointer-show");
        pointer2.classList.add("pointer-show");
        pointerShown = true;
      }
      setPosition(e.clientX, e.clientY);
    });
  });

  document.addEventListener("mouseleave", () => {
    window.requestAnimationFrame(() => {
      pointer.classList.remove("pointer-show");
      pointer2.classList.remove("pointer-show");
      pointerShown = false;
    });
  });
});
