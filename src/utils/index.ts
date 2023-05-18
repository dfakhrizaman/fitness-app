import * as posenet from "@tensorflow-models/posenet";
import * as tf from "@tensorflow/tfjs";

const color = "aqua";
const boundingBoxColor = "red";
const lineWidth = 2;

export const tryResNetButtonName = "tryResNetButton";
export const tryResNetButtonText = "[New] Try ResNet50";
const tryResNetButtonTextCss = "width:100%;text-decoration:underline;";
const tryResNetButtonBackgroundCss = "background:#e61d5f;";

function toTuple({ y, x }: { y: number; x: number }) {
  return [y, x];
}

export function drawPoint(
  ctx: CanvasRenderingContext2D,
  y: number,
  x: number,
  r: number,
  color: string
): void {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

export function drawSegment(
  [ay, ax]: [number, number],
  [by, bx]: [number, number],
  color: string,
  scale: number,
  ctx: CanvasRenderingContext2D
): void {
  ctx.beginPath();
  ctx.moveTo(ax * scale, ay * scale);
  ctx.lineTo(bx * scale, by * scale);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.stroke();
}

export function drawSkeleton(
  keypoints: any,
  minConfidence: any,
  ctx: CanvasRenderingContext2D,
  scale = 1
) {
  const adjacentKeyPoints = posenet.getAdjacentKeyPoints(
    keypoints,
    minConfidence
  );

  adjacentKeyPoints.forEach((keypoints) => {
    drawSegment(
      toTuple(keypoints[0].position),
      toTuple(keypoints[1].position),
      color,
      scale,
      ctx
    );
  });
}

// function setDatGuiPropertyCss(propertyText, liCssString, spanCssString = "") {
//   var spans = document.getElementsByClassName("property-name");
//   for (var i = 0; i < spans.length; i++) {
//     var text = spans[i].textContent || spans[i].innerText;
//     if (text == propertyText) {
//       spans[i].parentNode.parentNode.style = liCssString;
//       if (spanCssString !== "") {
//         spans[i].style = spanCssString;
//       }
//     }
//   }
// }

// export function updateTryResNetButtonDatGuiCss() {
//   setDatGuiPropertyCss(
//     tryResNetButtonText,
//     tryResNetButtonBackgroundCss,
//     tryResNetButtonTextCss
//   );
// }

// export function toggleLoadingUI(
//   showLoadingUI,
//   loadingDivId = "loading",
//   mainDivId = "main"
// ) {
//   if (showLoadingUI) {
//     document.getElementById(loadingDivId).style.display = "block";
//     document.getElementById(mainDivId).style.display = "none";
//   } else {
//     document.getElementById(loadingDivId).style.display = "none";
//     document.getElementById(mainDivId).style.display = "block";
//   }
// }

// function toTuple({ y, x }) {
//   return [y, x];
// }

/**
 * Draws a line on a canvas, i.e. a joint
 */

/**
 * Draws a pose skeleton by looking up all adjacent keypoints/joints
 */

/**
 * Draw pose keypoints onto a canvas
 */
export function drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
  for (let i = 0; i < keypoints.length; i++) {
    const keypoint = keypoints[i];

    if (keypoint.score < minConfidence) {
      continue;
    }

    const { y, x } = keypoint.position;
    drawPoint(ctx, y * scale, x * scale, 3, color);
  }
}

/**
 * Draw the bounding box of a pose. For example, for a whole person standing
 * in an image, the bounding box will begin at the nose and extend to one of
 * ankles
 */

/**
 * Converts an arary of pixel data into an ImageData object
 */

/**
 * Draw an image on a canvas
 */
export function renderImageToCanvas(image, size, canvas) {
  canvas.width = size[0];
  canvas.height = size[1];
  const ctx = canvas.getContext("2d");

  ctx.drawImage(image, 0, 0);
}

/**
 * Draw heatmap values, one of the model outputs, on to the canvas
 * Read our blog post for a description of PoseNet's heatmap outputs
 * https://medium.com/tensorflow/real-time-human-pose-estimation-in-the-browser-with-tensorflow-js-7dd0bc881cd5
 */
export function drawHeatMapValues(heatMapValues, outputStride, canvas) {
  const ctx = canvas.getContext("2d");
  const radius = 5;
  const scaledValues = heatMapValues.mul(tf.scalar(outputStride, "int32"));

  drawPoints(ctx, scaledValues, radius, color);
}

/**
 * Used by the drawHeatMapValues method to draw heatmap points on to
 * the canvas
 */
function drawPoints(ctx, points, radius, color) {
  const data = points.buffer().values;

  for (let i = 0; i < data.length; i += 2) {
    const pointY = data[i];
    const pointX = data[i + 1];

    if (pointX !== 0 && pointY !== 0) {
      ctx.beginPath();
      ctx.arc(pointX, pointY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    }
  }
}
