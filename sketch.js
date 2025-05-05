// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let isInsideCircle = false; // 用於追蹤手指是否在圓內
let previousX, previousY; // 儲存手指的上一個位置

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0);

  // 繪製手部檢測結果
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // 繪製關鍵點
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // 根據左右手設定顏色
          if (hand.handedness == "Left") {
            fill(255, 0, 255);
          } else {
            fill(255, 255, 0);
          }

          noStroke();
          circle(keypoint.x, keypoint.y, 16);
        }

        // 畫布中心的圓
        let centerX = width / 2;
        let centerY = height / 2;
        let circleRadius = 50; // 半徑為 50，直徑為 100

        fill(0, 255, 0, 100); // 半透明綠色
        noStroke();
        ellipse(centerX, centerY, circleRadius * 2, circleRadius * 2);

        // 檢查手指是否在圓內
        if (hand.keypoints.length > 8) {
          let indexFinger = hand.keypoints[8];
          let distance = dist(indexFinger.x, indexFinger.y, centerX, centerY);

          if (distance <= circleRadius) {
            // 手指在圓內，開始畫軌跡
            if (isInsideCircle) {
              stroke(255, 0, 0); // 紅色線條
              strokeWeight(10); // 將線條粗細改為 10
              line(previousX, previousY, indexFinger.x, indexFinger.y);
            }
            isInsideCircle = true;
            previousX = indexFinger.x;
            previousY = indexFinger.y;

            // 移動圓心到手指位置
            centerX = indexFinger.x;
            centerY = indexFinger.y;
          } else {
            // 手指離開圓，停止畫軌跡
            isInsideCircle = false;
          }
        }
      }
    }
  }
}
