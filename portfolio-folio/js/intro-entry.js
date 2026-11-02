// 청사진 인트로 시작점 — 3D(three.js)를 기다리지 않고 페이지를 열자마자 인트로를 시작한다.
// main.js 는 window.blueprintIntro 가 끝날 때(사라지기 시작할 때) 사이트 등장을 시작한다.
import { playBlueprintIntro } from './blueprint-intro.js';

window.blueprintIntro = playBlueprintIntro();
