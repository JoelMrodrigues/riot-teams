export const REF_W = 2600;
export const IMG_ASPECT = 2600 / 1673;

/** Displayed-image rect under object-cover, in element pixels. */
export interface CoverRect {
  W: number;
  H: number;
  offX: number;
  offY: number;
  dispW: number;
  dispH: number;
  S: number;
}

/** Compute the object-cover crop mapping for a w×h box of the splash art. */
export function computeCover(w: number, h: number): CoverRect {
  let dispW: number;
  let dispH: number;
  if (w / h < IMG_ASPECT) {
    dispH = h;
    dispW = h * IMG_ASPECT;
  } else {
    dispW = w;
    dispH = w / IMG_ASPECT;
  }
  return {
    W: w,
    H: h,
    offX: (w - dispW) / 2,
    offY: (h - dispH) / 2,
    dispW,
    dispH,
    S: dispW / REF_W,
  };
}
