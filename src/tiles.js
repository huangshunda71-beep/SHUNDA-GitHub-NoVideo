import {savedContent} from './content-store.js';
// Grounded in Figma frame 1177:6075 (1920 × 1080).
// x/y are tile centers below the 87 px header; angles use CSS clockwise rotation.
// mobile is [centerX, centerY, tileScale, angle], composed for narrow screens.
export const layout = { width: 1920, height: 993, mobileWidth: 760, mobileHeight: 1260 };
export const tiles = [
  {
    "id": "make",
    "nodeId": "1177:6076",
    "kind": "text",
    "x": 253.49985701896694,
    "y": 527.613041043173,
    "width": 469.602783203125,
    "height": 171.4367218017578,
    "angle": -14.398846254554513,
    "radius": 9.4316110611,
    "z": 1,
    "mobile": [
      208,
      345,
      0.72,
      -12
    ],
    "background": "#000000",
    "text": {
      "value": "MAKE",
      "x": 55.82661083459754,
      "y": -0.000017848420718280522,
      "width": 352,
      "height": 171,
      "fontSize": 122.4999771118164,
      "lineHeight": 171,
      "color": "#FFFFFF"
    },
    "entrance": {
      "delay": 162,
      "duration": 954,
      "tilt": -7
    }
  },
  {
    "id": "ideas",
    "nodeId": "1177:6079",
    "kind": "text",
    "x": 595.0710646680394,
    "y": 700.4038109281506,
    "width": 531.94287109375,
    "height": 171.65570068359375,
    "angle": -25.05961995833162,
    "radius": 9.4316110611,
    "z": 2,
    "mobile": [
      516,
      374,
      0.65,
      -18
    ],
    "background": "#F9D927",
    "text": {
      "value": "IDEAS",
      "x": 90.54295170536902,
      "y": 0.00001795169701068744,
      "width": 352,
      "height": 171,
      "fontSize": 122.4999771118164,
      "lineHeight": 171,
      "color": "#000000"
    },
    "entrance": {
      "delay": 366,
      "duration": 907,
      "tilt": 6
    }
  },
  {
    "id": "image-1",
    "nodeId": "1177:6086",
    "kind": "image",
    "x": 201.96927545524505,
    "y": 219.06023257252076,
    "width": 280,
    "height": 280,
    "angle": 19.071446385459883,
    "radius": 10,
    "z": 3,
    "mobile": [
      169,
      158,
      0.73,
      14
    ],
    "src": "assets/images/cover/2.jpg.webp",
    "label": "粉色小屋",
    "entrance": {
      "delay": 0,
      "duration": 860,
      "tilt": -5
    }
  },
  {
    "id": "image-6",
    "nodeId": "1177:6180",
    "kind": "image",
    "x": 170.68220992873367,
    "y": 846.4673253035712,
    "width": 280,
    "height": 280,
    "angle": -2.6147863692820437,
    "radius": 10,
    "z": 4,
    "mobile": [
      177,
      883,
      0.7,
      -3
    ],
    "src": "assets/images/cover/1.jpg.webp",
    "label": "粉色猫咪",
    "entrance": {
      "delay": 489,
      "duration": 1001,
      "tilt": 8
    }
  },
  {
    "id": "image-2",
    "nodeId": "1177:6355",
    "kind": "image",
    "x": 585.8107715477073,
    "y": 221.5125821962144,
    "width": 280,
    "height": 280,
    "angle": 11.192784180834366,
    "radius": 10,
    "z": 5,
    "mobile": [
      554,
      164,
      0.73,
      10
    ],
    "src": "assets/images/cover/3.jpg.webp",
    "label": "银杏树角色",
    "entrance": {
      "delay": 81,
      "duration": 907,
      "tilt": 6
    }
  },
  {
    "id": "image-4",
    "nodeId": "1177:6422",
    "kind": "image",
    "x": 1346.330848042879,
    "y": 530.5709319400623,
    "width": 280,
    "height": 279.9999694824219,
    "angle": 33.37359142641191,
    "radius": 10,
    "z": 6,
    "mobile": [
      548,
      558,
      0.66,
      23
    ],
    "src": "assets/images/cover/5.jpg.webp",
    "label": "银杏果角色",
    "entrance": {
      "delay": 285,
      "duration": 860,
      "tilt": -5
    }
  },
  {
    "id": "image-3",
    "nodeId": "1177:6425",
    "kind": "image",
    "x": 942.4071553181707,
    "y": 380.35553631229016,
    "width": 280,
    "height": 280,
    "angle": 45.52445426633376,
    "radius": 10,
    "z": 7,
    "mobile": [
      192,
      516,
      0.66,
      45.524
    ],
    "src": "assets/images/cover/4.jpg.webp",
    "label": "黄色毛绒角色",
    "entrance": {
      "delay": 204,
      "duration": 1001,
      "tilt": 8
    }
  },
  {
    "id": "image-5",
    "nodeId": "1177:6444",
    "kind": "image",
    "x": 1707.982709557649,
    "y": 441.46419898616637,
    "width": 280,
    "height": 280,
    "angle": -44.511733483765646,
    "radius": 10,
    "z": 8,
    "mobile": [
      579,
      859,
      0.66,
      -35
    ],
    "src": "assets/images/cover/6.jpg.webp",
    "label": "粉色小鹿",
    "entrance": {
      "delay": 408,
      "duration": 954,
      "tilt": -7
    }
  },
  {
    "id": "statement",
    "nodeId": "1177:6539",
    "kind": "text",
    "x": 767.7395046956167,
    "y": 825.7851629509942,
    "width": 531.94287109375,
    "height": 147.1331329345703,
    "angle": -18.82822674615635,
    "radius": 9.431611061096191,
    "z": 9,
    "mobile": [
      420,
      1062,
      1.08,
      -6
    ],
    "background": "#000000",
    "text": {
      "value": "A visual designer focused on visual\noperations, brand communication,\nand digital experiences.",
      "x": 34.827423095703125,
      "y": 20.751100540161133,
      "width": 374.4349365234375,
      "height": 105,
      "fontSize": 22.635866165161133,
      "lineHeight": 35.311949922416716,
      "color": "#FFFFFF"
    },
    "icon": {
      "src": "assets/1177-6541.svg",
      "x": 461.6891875,
      "y": 76.8795645,
      "width": 66,
      "height": 66,
      "angle": 18.82822674615635
    },
    "entrance": {
      "delay": 570,
      "duration": 860,
      "tilt": -5
    }
  },
  {
    "id": "works",
    "nodeId": "1177:6544",
    "kind": "text",
    "x": 1643.8036685194627,
    "y": 794.8390592608814,
    "width": 531.9428100585938,
    "height": 171.65530395507812,
    "angle": -27.183895905487123,
    "radius": 9.431611061096191,
    "z": 10,
    "mobile": [
      430,
      719,
      0.74,
      -15
    ],
    "background": "#F9D927",
    "text": {
      "value": "WORKS",
      "x": 39.614644,
      "y": 0.002304,
      "width": 453,
      "height": 171,
      "fontSize": 122.499977,
      "lineHeight": 171,
      "color": "#000000"
    },
    "entrance": {
      "delay": 693,
      "duration": 954,
      "tilt": -7
    }
  },
  {
    "id": "design",
    "nodeId": "1177:6548",
    "kind": "text",
    "x": 421.6342408671743,
    "y": 962.5815206614673,
    "width": 111.29300689697266,
    "height": 41.499088287353516,
    "angle": -10.1862182154021,
    "radius": 4.715805530548096,
    "z": 11,
    "mobile": [
      103,
      1195,
      1,
      -10
    ],
    "background": "#E8E8E8",
    "text": {
      "value": "DESIGN",
      "x": 14.151789665222168,
      "y": 4.716515064239502,
      "width": 84,
      "height": 32,
      "fontSize": 22.635866165161133,
      "lineHeight": 32,
      "color": "#000000"
    },
    "entrance": {
      "delay": 774,
      "duration": 1001,
      "tilt": 8
    }
  },
  {
    "id": "talk",
    "nodeId": "1177:6550",
    "kind": "text",
    "x": 805.0316925048828,
    "y": 972.7495441436768,
    "width": 153.73526000976562,
    "height": 41.499088287353516,
    "angle": -1.5902773407317584e-15,
    "radius": 4.715805530548096,
    "z": 12,
    "mobile": [
      348,
      1210,
      1,
      0
    ],
    "background": "#E8E8E8",
    "text": {
      "value": "LET’S TALK",
      "x": 13.205842971801758,
      "y": 4.715871334075928,
      "width": 128,
      "height": 32,
      "fontSize": 22.635866165161133,
      "lineHeight": 32,
      "color": "#000000"
    },
    "entrance": {
      "delay": 897,
      "duration": 907,
      "tilt": 6
    }
  },
  {
    "id": "visual",
    "nodeId": "1177:6552",
    "kind": "text",
    "x": 953.0932406650759,
    "y": 920.5680825598696,
    "width": 227.30181884765625,
    "height": 41.499088287353516,
    "angle": 13.059276272583284,
    "radius": 4.715805530548096,
    "z": 13,
    "mobile": [
      393,
      931,
      1.04,
      12
    ],
    "background": "#E8E8E8",
    "text": {
      "value": "VISUAL DESIGNER",
      "x": 14.149284362792969,
      "y": 4.715235710144043,
      "width": 199,
      "height": 32,
      "fontSize": 22.635866165161133,
      "lineHeight": 32,
      "color": "#000000"
    },
    "entrance": {
      "delay": 816,
      "duration": 860,
      "tilt": -5
    }
  },
  {
    "id": "ada",
    "nodeId": "1177:6554",
    "kind": "text",
    "x": 1181.4757724755787,
    "y": 829.1114447420778,
    "width": 300.78521728515625,
    "height": 136.94491577148438,
    "angle": 58.80118442634775,
    "radius": 9.431611061096191,
    "z": 14,
    "mobile": [
      386,
      560,
      0.58,
      65
    ],
    "background": "#000000",
    "text": {
      "value": "@阿达",
      "x": 20.215389251708984,
      "y": 5.878721237182617,
      "width": 259,
      "height": 127,
      "fontSize": 90.54346466064453,
      "lineHeight": 127,
      "color": "#FFFFFF"
    },
    "entrance": {
      "delay": 612,
      "duration": 907,
      "tilt": 6
    }
  },
  {
    "id": "progress",
    "nodeId": "1177:6557",
    "kind": "text",
    "x": 1650.010856628418,
    "y": 972.7495441436768,
    "width": 175.42796325683594,
    "height": 41.499088287353516,
    "angle": -1.5902773407317584e-15,
    "radius": 4.715805530548096,
    "z": 15,
    "mobile": [
      622,
      1196,
      1,
      0
    ],
    "background": "#E8E8E8",
    "text": {
      "value": "IN PROGRESS",
      "x": 12.257473945617676,
      "y": 4.715673446655273,
      "width": 152,
      "height": 32,
      "fontSize": 22.635866165161133,
      "lineHeight": 32,
      "color": "#000000"
    },
    "entrance": {
      "delay": 978,
      "duration": 954,
      "tilt": -7
    }
  }
];
export const extraImages = [7,8,9,10,11,12].map((n,i)=>({src:`assets/images/cover/${n}.jpg`,label:["小乌龟","小狗","飞鸟","盆栽","蝴蝶","相机"][i]}));

if(savedContent){
 for(const tile of tiles){const patch=savedContent.tileOverrides?.[tile.id];if(!patch)continue;
  if(tile.kind==='image'){if(patch.src)tile.src=patch.src;if(patch.label!==undefined)tile.label=patch.label;}
  else{if(patch.value!==undefined)tile.text.value=patch.value;if(patch.fontSize)tile.text.fontSize=patch.fontSize;}
 }
 if(savedContent.extraImages)extraImages.splice(0,extraImages.length,...savedContent.extraImages);
}
