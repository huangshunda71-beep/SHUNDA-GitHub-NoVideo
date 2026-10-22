import {savedContent} from './content-store.js';
import {detailImages} from './detail-images.js';
import {workDetails} from './work-details.js';
// Separate resource slots: portrait carousel images are not overview thumbnails.
// Add a local URL to image/overviewImage/images; null renders a stable gray placeholder.
const entries=[
['与 Ta 跨时空相遇','字节跳动 · 猫箱APP · 运营视觉设计'],
['猫箱 APP 应用商店宣传图','字节跳动 · 猫箱APP · 应用商店宣传图'],
['这“夏”挺好','字节跳动 · 猫箱APP · 运营视觉设计'],
['为 Ta 加冕','字节跳动 · 猫箱APP · 运营视觉设计'],
['赫莲娜','欧莱雅 · 赫莲娜 · 视觉设计'],
['理肤泉','欧莱雅 · 日韩 · 视觉设计'],
['帽子峰秋友会','毕业设计 · IP及活动设计'],
['锦鲤羊','个人练习 · IP及运营视觉设计'],
['爱的7日练习','猫箱APP · 设计测试题'],
['夏日好物节','个人练习 · 盒马鲜生运营视觉设计'],
['秋日出游季','个人练习 · 美团运营视觉设计'],
['Molly','大广赛 · 泡泡玛特动画'],
['来超市逛逛好生活','个人练习 · 小红书运营视觉设计（小组合作）'],
['圣诞礼遇季','个人练习 · 抖音商城运营视觉设计'],
['IP设计','个人练习 · IP设计'],
['信息可视化设计','小组作业 · 信息可视化设计'],
['动画设计','个人练习 · 动画设计'],
['插画设计','个人练习 · 插画设计'],
['动画设计','个人练习 · 动画设计'],
['动画设计','个人练习 · 动画设计']
];
export const works=entries.map(([title,category],i)=>{
 const slot=Math.floor(i/3)+1+'-'+(i%3+1);
 return {id:'detail-'+slot,overviewId:'overview-'+slot,title,category,overviewImage:'./assets/images/overview/作品总览页1-'+(i+1)+'.png',
 date:null,projectBackground:null,projectType:null,role:null,description:null,
 images:[{src:null,aspectRatio:'1117 / 628'},{src:null,aspectRatio:'1117 / 628'}],
 previousWorkId:i?'detail-'+(Math.floor((i-1)/3)+1)+'-'+((i-1)%3+1):null,
 nextWorkId:i<entries.length-1?'detail-'+(Math.floor((i+1)/3)+1)+'-'+((i+1)%3+1):null};
});
Object.assign(works[0],{overviewCaption:'字节跳动 · 猫箱APP · 运营视觉设计',category:'活动运营视觉设计',date:'2026',projectBackground:'字节跳动 · 猫箱APP',projectType:'实习项目',role:'运营视觉设计实习生',description:'围绕猫箱 App 的 AI 角色陪伴场景，以“情感连接—剧情探索—记忆收藏”为主线，打造跨越三世的互动体验。视觉上，以角色形象、深棕与香槟金配色，结合光轨、星芒和收藏卡框，营造统一的时空叙事氛围。通过角色选择、渐进解锁与生成反馈引导探索，以多梯度礼包承接不同参与需求，最终将互动成果转化为可保存、回看与分享的图鉴和专属纪念册。'});
// Apply supplied detail copy without changing overview captions, images or route IDs.
works.forEach((work,index)=>{if(workDetails[index]) Object.assign(work,workDetails[index]);});
works[0].images=[
  {
    "src": "./assets/images/details/across-time/103.jpg.webp",
    "aspectRatio": "1920 / 1275"
  },
  {
    "src": "./assets/images/details/across-time/81.jpg.webp",
    "aspectRatio": "1920 / 1382"
  },
  {
    "src": "./assets/images/details/across-time/102.jpg.webp",
    "aspectRatio": "1920 / 1315"
  },
  {
    "src": "./assets/images/details/across-time/126.jpg.webp",
    "aspectRatio": "1920 / 1080"
  },
  {
    "src": "./assets/images/details/across-time/128.jpg.webp",
    "aspectRatio": "1920 / 1080"
  },
  {
    "src": "./assets/images/details/across-time/129.jpg.webp",
    "aspectRatio": "1920 / 1080"
  },
  {
    "src": "./assets/images/details/across-time/130.jpg.webp",
    "aspectRatio": "1920 / 1080"
  },
  {
    "src": "./assets/images/details/across-time/131.jpg.webp",
    "aspectRatio": "1920 / 1080"
  },
  {
    "src": "./assets/images/details/across-time/132.jpg.webp",
    "aspectRatio": "1920 / 1080"
  }
];
for(const [number,images] of Object.entries(detailImages)) works[Number(number)-1].images=images;
// Mapping follows recognizable artwork in the supplied design; independent image slots.
export const carousel=[[9,8,2,0,3,1,11],[12,6,4,5,10,7,14]].map((row,r)=>row.map((index,c)=>({id:'carousel-'+(r+1)+'-'+(c+1),detailId:works[index].id,image:'./assets/images/carousel/作品轮播展示页'+(r+1)+'-'+(c+1)+'.png'})));
export const profileAssets={portrait:'./assets/images/profile/portrait.png.webp',bytedanceLogo:'./assets/images/profile/bytedance-logo.png',lorealLogo:'./assets/images/profile/loreal-buycoor-logo.png'};
export const contact={email:'3256591783@qq.com',wechat:'Hsd3256591783',phone:'18359482181',location:'广东广州',wechatQR:'./assets/images/contact/wechat.png.webp',portfolioQR:'./assets/images/contact/portfolio-updated.png',pdfQR:null};
export const findWork=id=>works.find(work=>work.id===id);

export const siteAssets={resume:'./assets/images/profile/resume-updated.jpg.webp'};
const xianshanDefault=works.find(w=>w.id==='detail-7-2');
if(xianshanDefault){xianshanDefault.images=[{"src":"./assets/images/details/xianshan/1.jpg.webp","aspectRatio":"2640 / 1080"},{"src":"./assets/images/details/xianshan/2.jpg.webp","aspectRatio":"2640 / 1080"},{"src":"./assets/images/details/xianshan/3.jpg.webp","aspectRatio":"2640 / 1080"},{"src":"./assets/images/details/xianshan/4.jpg.webp","aspectRatio":"2640 / 1080"}];}
if(savedContent){
 works.splice(0,works.length,...savedContent.works);
 carousel.splice(0,carousel.length,...savedContent.carousel);
 Object.assign(profileAssets,savedContent.profileAssets);Object.assign(contact,savedContent.contact);
 siteAssets.resume=savedContent.resume;
}
works.forEach((w,i)=>{w.previousWorkId=works[i-1]?.id||null;w.nextWorkId=works[i+1]?.id||null;w.overviewId='overview-'+(Math.floor(i/3)+1)+'-'+(i%3+1);});

const mollyWork=works.find(w=>w.id==='detail-4-3');

