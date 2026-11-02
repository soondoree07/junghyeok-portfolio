# 캡처 넣는 곳

프로젝트마다 폴더를 만들고 `1.png`, `2.png`, `3.png` 로 넣으면 상세 화면에 순서대로 크게 나옵니다.
파일이 없으면 그 자리에 "캡처를 넣을 자리"가 보입니다.

캡처 아래 설명을 달거나 장수를 바꾸려면 `js/projects.js` 의 그 프로젝트에 `shots` 를 적습니다.

```js
shots: [
  { file: '1.png', caption: '첫 화면 — 오늘 받을 수 있는 보상을 맨 위에 둔 이유' },
  { file: '2.png', caption: '미션 목록' },
],
```

| 번호 | 프로젝트 | 폴더 |
|---|---|---|
| 01 | Zellopang | `images/zellopang/` |
| 02 | Reward Loop | `images/donidwaeji/` |
| 03 | Remote Desk | `images/dashboard/` |
| 04 | J.Bae | `images/jbae/` |
| 05 | Folio Template | `images/kmong/` |
| 06 | MoaTool | `images/moatool/` |
| 07 | DooTo | `images/dooto/` |
| 08 | Boss Party | `images/mapleboss/` |
| 09 | pokenova | `images/pokenova/` |
| 10 | pochams | `images/pochams/` |
| 11 | ENCORE | `images/encore/` |
| 12 | Living Alone | `images/ohouse/` |
| 13 | LOPA | `images/lopa/` |
| 14 | Smart Highway | `images/highway/` |
| 15 | Hopetail | `images/hopetail/` |
