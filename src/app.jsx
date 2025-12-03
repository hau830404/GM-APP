import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sun, Battery, Zap, Shield, Info, Axe, Trophy, Star, BookOpen, Brain, RefreshCw, AlertTriangle, Calendar, Heart, ArrowRight, Clock, Compass, Activity, ArrowUpCircle, CloudRain, Layers, Utensils, Shirt, Tent, HeartHandshake, Flame, CheckCircle2, Hand, MapPin, Target, BatteryCharging, Briefcase, Plane, Fingerprint, Search } from 'lucide-react';

// --- 1. 基礎資料庫 ---

const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

const ELE_MAP = {
  '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土', '己': '土', 
  '庚': '金', '辛': '金', '壬': '水', '癸': '水',
  '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火', 
  '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水'
};

const getElemColor = (ele) => {
  switch(ele) {
    case '火': return 'bg-red-500';
    case '木': return 'bg-green-600';
    case '土': return 'bg-yellow-600';
    case '金': return 'bg-slate-400';
    case '水': return 'bg-blue-500';
    default: return 'bg-slate-400';
  }
};

const LEVELS = [
  { level: 1, name: "鏽鐵斧頭", minXP: 0, color: "text-stone-400", shadow: "", desc: "剛出土的斧頭，還需要磨練。" },
  { level: 2, name: "精鐵手斧", minXP: 50, color: "text-slate-600", shadow: "", desc: "已經磨去鐵鏽，可以用來砍柴了。" },
  { level: 3, name: "百煉鋼斧", minXP: 150, color: "text-blue-500", shadow: "drop-shadow-md", desc: "經過千錘百鍊，鋒利無比。" },
  { level: 4, name: "銀光戰斧", minXP: 300, color: "text-slate-200", shadow: "drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]", desc: "散發著寒氣，能斬斷一切雜念。" },
  { level: 5, name: "黃金神斧", minXP: 500, color: "text-yellow-400", shadow: "drop-shadow-[0_0_15px_rgba(250,204,21,1)]", desc: "傳說中的神器，劈甲引丁，無所不能！" },
];

// --- 2. 完整教學內容資料庫 ---
const TUTORIAL_CONTENT = {
  hiddenStems: {
    title: "透視篇：地支藏干 (X-Ray)",
    intro: "地支只是「盒子」，真正決定大小的是裡面藏的「天干」。",
    items: [
      { zhi: '巳蛇', real: '丙', ele: '火', size: '大', god: '七殺', desc: '外表陰柔，內心是大太陽(大火)。壓力極大。' },
      { zhi: '午馬', real: '丁', ele: '火', size: '小', god: '正官', desc: '外表陽剛，內心是燭火(小火)。精細雕刻。' },
      { zhi: '亥豬', real: '壬', ele: '水', size: '大', god: '食神', desc: '外表陰，內心是大江河(大水)。智慧深沉。' },
      { zhi: '子鼠', real: '癸', ele: '水', size: '小', god: '傷官', desc: '外表陽，內心是雨露(小水)。心思細膩。' },
      { zhi: '申猴', real: '庚', ele: '金', size: '大', god: '比肩', desc: '最強隊友，純度極高的斧頭(大金)。' },
      { zhi: '酉雞', real: '辛', ele: '金', size: '小', god: '劫財', desc: '精緻首飾(小金)。女友的時柱，代表她喜歡精緻。' },
      { zhi: '寅虎', real: '甲', ele: '木', size: '大', god: '偏財', desc: '參天大樹(大木)。您的偏財大錢。' },
      { zhi: '卯兔', real: '乙', ele: '木', size: '小', god: '正財', desc: '花草藤蔓(小木)。您的正財薪水。' },
      { zhi: '辰龍', real: '戊', ele: '土', size: '大', god: '偏印', desc: '濕的大土(水庫)。能養木，也能晦火。' },
      { zhi: '戌狗', real: '戊', ele: '土', size: '大', god: '偏印', desc: '燥的大土(火庫)。能擋水，也能脆金。' },
      { zhi: '丑牛', real: '己', ele: '土', size: '小', god: '正印', desc: '濕的小土(金庫)。田園之土，生金有力。' },
      { zhi: '未羊', real: '己', ele: '土', size: '小', god: '正印', desc: '燥的小土(木庫)。花園之土，有餘氣。' },
    ]
  },
  hd_cross: {
    title: "番外篇：八字 x 人類圖 雙系統解碼",
    intro: "您的「人類圖 (HD)」與「八字」驚人地一致。這是兩套語言描述同一個你。",
    items: [
      { name: '顯示生產者 (MG)', desc: '【渦輪增壓的斧頭】對應「庚金 + 七殺」。效率極高、多工、速度快。但因「身弱」，需注意電力驟降。必須「等待回應」再行動，避免空轉耗能。' },
      { name: '5/1 人 (異端/研究)', desc: '【救火隊大將軍】1爻(研究)=「印星(土)」，需要深厚技術底蘊才有安全感。5爻(異端)=「七殺(火)」，外界期待您能解決危機。用1爻的實力去支撐5爻的名聲。' },
      { name: '薦骨回應 (Sacral)', desc: '【身體的導航】對應「食傷/印」的直覺。成音師靠聽覺，薦骨也是聽身體的聲音(嗯哼/不)。大腦(庚金邏輯)會騙人，但身體(薦骨)不會。' },
    ]
  },
  lifeStrategy: {
    title: "生存戰略篇：庚金工程師的人生攻略",
    intro: "您已經找到了最適合您的「混合動力模式」。這不是懶惰，而是為了讓續航力最大化的智慧配置。",
    items: [
      { type: "主業 (Main)", god: "印星 (土)", action: "電視台成音", desc: "【充電站】場所固定、有制度、不累。對應 HD 的 1爻需求(基礎/安全感)。身弱者必須依靠「大機構」來護身。" },
      { type: "副業 (Side)", god: "比劫 (金)", action: "朋友接音響", desc: "【外掛模組】跟朋友(比肩)一起扛。偶爾做技術輸出，滿足 HD 的 MG 特質(多工/效率)，且有人分擔壓力。" },
      { type: "休閒 (Fun)", god: "食傷 (水)", action: "樂團演出", desc: "【排氣閥】偶爾的放風。把累積的壓力透過音樂宣洩出來。調節身心平衡。" },
      { type: "旅遊 (Trip)", god: "庚金劈甲", action: "您導航 vs 她採購", desc: "【完美分工】您負責「結構與安全」(庚金/21閘門控制)，她負責「內容與採購」(甲木/吸收)。您掌控流程，她負責快樂。" },
    ]
  },
  origins: {
    title: "起源篇：為什麼天干對應五行？",
    intro: "八字其實是古人觀察「太陽運轉」與「四季氣候」歸納出的能量代碼。五行就是五種季節狀態。",
    items: [
      { season: '春 (Spring)', ele: '木', gans: '甲、乙', desc: '陽氣生發，草木破土。甲(莢)是破殼而出，乙(軋)是彎曲生長。' },
      { season: '夏 (Summer)', ele: '火', gans: '丙、丁', desc: '陽氣極盛，熱氣向上。丙(炳)是光芒顯著，丁(壯)是萬物壯大。' },
      { season: '長夏 (Center)', ele: '土', gans: '戊、己', desc: '季節過渡，萬物化育。戊(茂)是茂盛，己(起)是完全定形。' },
      { season: '秋 (Autumn)', ele: '金', gans: '庚、辛', desc: '陰氣收斂，肅殺結果。庚(更)是果實更換收成，辛(新)是新生。' },
      { season: '冬 (Winter)', ele: '水', gans: '壬、癸', desc: '陰氣閉藏，潛伏待發。壬(妊)是孕育生命，癸(揆)是萌芽前夕。' },
    ]
  },
  basics: {
    title: "基礎篇：天干地支架構",
    intro: "八字由「天干(氣/表象)」與「地支(質/內在)」組成。",
    stems: [
      { element: '金', gan: ['庚', '辛'], desc: '西方，代表剛毅、隊友 (同我)' },
      { element: '木', gan: ['甲', '乙'], desc: '東方，代表生長、財富 (我剋)' },
      { element: '水', gan: ['壬', '癸'], desc: '北方，代表智慧、才華 (我生)' },
      { element: '火', gan: ['丙', '丁'], desc: '南方，代表熱情、壓力 (剋我)' },
      { element: '土', gan: ['戊', '己'], desc: '中央，代表穩定、貴人 (生我)' },
    ]
  },
  solarTerms: {
    title: "進階篇：二十四節氣與月令",
    intro: "八字的「月份」不是看日曆，而是看「節氣」。節氣就像音樂的小節線，決定了五行能量的切換。",
    terms: [
      { zhi: '寅', month: '正月', solar: '立春、雨水', ele: '木', desc: '【甲木】帝旺。萬物甦醒，木氣最強，庚金最弱(絕地)。' },
      { zhi: '卯', month: '二月', solar: '驚蟄、春分', ele: '木', desc: '【乙木】專氣。桃花盛開，您(庚金)的正財月，但也最耗能。' },
      { zhi: '辰', month: '三月', solar: '清明、穀雨', ele: '土', desc: '【戊土】司令。春末水庫，濕氣重。女友(甲辰)的本命月。' },
      { zhi: '巳', month: '四月', solar: '立夏、小滿', ele: '火', desc: '【丙火】長生。火氣初生，庚金的長生之地(活力起點)。' },
      { zhi: '午', month: '五月', solar: '芒種、夏至', ele: '火', desc: '【丁火】帝旺。火氣極盛，壓力最大。您的本命月(庚午)。' },
      { zhi: '未', month: '六月', solar: '小暑、大暑', ele: '土', desc: '【己土】司令。夏末燥土，火氣未退。適合庚金進修、充電。' },
      { zhi: '申', month: '七月', solar: '立秋、處暑', ele: '金', desc: '【庚金】建祿。秋天到，庚金得令(最強)，是您的主場。' },
      { zhi: '酉', month: '八月', solar: '白露、秋分', ele: '金', desc: '【辛金】帝旺。金氣最純，桃花月。女友時柱(癸酉)能量點。' },
      { zhi: '戌', month: '九月', solar: '寒露、霜降', ele: '土', desc: '【戊土】司令。火庫燥土，進氣轉寒。您的年柱(甲戌)能量點。' },
      { zhi: '亥', month: '十月', solar: '立冬、小雪', ele: '水', desc: '【壬水】建祿。水氣初生，寒氣降臨。女友(亥月)的本命月。' },
      { zhi: '子', month: '十一月', solar: '大雪、冬至', ele: '水', desc: '【癸水】帝旺。水氣最旺，最冷之時。需火暖局。' },
      { zhi: '丑', month: '十二月', solar: '小寒、大寒', ele: '土', desc: '【己土】司令。金庫濕土，冬末轉春，等待甲木破土。' },
    ]
  },
  combinations: {
    title: "高階篇：地支三合局",
    intro: "地支之間會形成強大的能量結盟，稱為「三合」。這會改變原本的五行屬性，對運勢影響極大。",
    items: [
      { name: '亥卯未 (三合木)', desc: '水生木，木歸庫。能量化為巨大的「木」(財星)。若發生在您身上，會導致「財多身弱」，慾望強但身體累，只想看妹子(財)不想動。' },
      { name: '寅午戌 (三合火)', desc: '木生火，火歸庫。能量化為巨大的「火」(官殺)。若遇到，壓力會爆表，情緒易失控，需強力降溫。' },
      { name: '巳酉丑 (三合金)', desc: '火煉金，金歸庫。能量化為巨大的「金」(比劫)。這是您的「無敵狀態」，意志力與執行力最強的時候。' },
      { name: '申子辰 (三合水)', desc: '金生水，水歸庫。能量化為巨大的「水」(食傷)。靈感爆棚，但容易想太多或過度宣洩(尻尻)。' },
    ]
  },
  cycles: {
    title: "進階篇：五行生剋邏輯",
    intro: "五行不是靜止的，它們會互動。對於身弱庚金，我們喜歡「生」，怕「剋」和「洩」。",
  },
  tenGods: {
    title: "核心篇：十神解碼 (庚金視角)",
    intro: "「十神」是八字的人際關係代號。以下是針對「庚金日主」的專屬翻譯：",
    gods: [
      { 
        name: "印星 (Resource)", 
        element: "土", 
        types: ["正印 (己)", "偏印 (戊)"],
        meaning: "保護罩、輸入端", 
        desc: "生我者。對身弱的您來說是「補血包」。代表SOP、技術文件、房子、貴人、母親、睡眠。遇到壓力(火)時，躲進土裡就對了。" 
      },
      { 
        name: "比劫 (Peer)", 
        element: "金", 
        types: ["比肩 (庚)", "劫財 (辛)"],
        meaning: "隊友、備用電池", 
        desc: "同我者。對身弱的您來說是「好兄弟」。代表樂團夥伴、健身(強化肉體)、意志力。一個人扛不住時，找比劫分擔。" 
      },
      { 
        name: "食傷 (Output)", 
        element: "水", 
        types: ["食神 (壬)", "傷官 (癸)"],
        meaning: "排氣口、才華", 
        desc: "我生者。代表您的音樂、成音作品、情緒宣洩。水能降火(壓力)，所以唱歌對您來說是心理治療。女友的「癸酉」時柱帶有這股能量。" 
      },
      { 
        name: "財星 (Wealth)", 
        element: "木", 
        types: ["正財 (乙)", "偏財 (甲)"],
        meaning: "目標、燃料", 
        desc: "我剋者。代表您想掌控的東西：錢、女人、慾望。甲木是偏財(大錢/情人)，乙木是正財(薪水/妻)。2024甲辰年，偏財出現，所以遇見女友。" 
      },
      { 
        name: "官殺 (Power)", 
        element: "火", 
        types: ["正官 (丁)", "七殺 (丙)"],
        meaning: "壓力、名聲", 
        desc: "剋我者。代表鍛鍊您的力量。丁火是溫柔的火(正官)，像SOP；丙火是烈火(七殺)，像突發危機。身弱怕火多，2026丙午年要特別小心。" 
      }
    ]
  },
  fengshui: {
    title: "番外篇：庚金工程師的風水佈局",
    intro: "風水是環境的能量輔助。對於「身弱庚金」來說，重點是「找靠山(土)」與「增強氣場(金)」。",
    items: [
      { name: '辦公桌方位', desc: '盡量背靠牆(土)。若背後無靠，請在椅背披一件卡其色/咖啡色外套(人工靠山)。' },
      { name: '桌面擺設', desc: '左青龍(動)，右白虎(靜)。電腦主機放右邊(擋煞)。左邊放金屬擺件或黃水晶(土生金)。' },
      { name: '顏色運用', desc: '多用大地色系(土)的地毯、窗簾。避免過多紅色(火剋金)或大面積藍色(水洩金)。' },
      { name: '居家建議', desc: '床頭務必靠實牆。房間適合溫暖的黃光(土)。可以養觀葉植物(木)但不要在臥室，以免耗氣。' },
    ]
  }
};

// 題庫 (30題)
const FULL_QUIZ_QUESTIONS = [
  { id: 1, question: "在五行相生中，哪一個元素會「生」金，成為庚金的貴人？", options: ["水", "木", "火", "土"], answer: 3, explanation: "土生金。土代表印星，是身弱庚金的貴人與保護層。" },
  { id: 2, question: "對於「庚金」日主來說，「甲木」代表什麼十神？", options: ["正財", "偏財", "七殺", "正印"], answer: 1, explanation: "金剋木，庚(陽)剋甲(陽)為偏財。代表大錢、情人或不穩定的收入。" },
  { id: 3, question: "「庚金」的本質意象通常被比喻為？", options: ["雨露", "太陽", "斧頭/礦石", "花草"], answer: 2, explanation: "庚金是陽金，代表剛毅的斧頭、頑鐵，需要火煉才能成器。" },
  { id: 4, question: "「辛金」與「庚金」的主要差別在於？", options: ["辛金是斧頭", "辛金是珠寶小刀", "辛金是礦石", "沒有差別"], answer: 1, explanation: "庚金是粗曠的斧頭，辛金是精緻的珠寶或美工刀。女友時柱有辛金，代表她喜歡精緻的事物。" },
  { id: 5, question: "五行中，哪一個元素專門用來「剋」金？", options: ["水", "木", "火", "土"], answer: 2, explanation: "火剋金。火代表壓力、官殺。適度的火能煉金，過旺的火會鎔金。" },
  { id: 6, question: "身弱庚金想要增強運勢，最適合穿什麼顏色的衣服？", options: ["大紅色", "正綠色", "卡其色/黃色", "全黑色"], answer: 2, explanation: "土生金，土色系(卡其/黃/大地)是印星顏色，能給予保護。" },
  { id: 7, question: "身弱庚金遇到壓力大(火旺)的時候，最好的策略是什麼？", options: ["硬碰硬", "找土來轉化(SOP/貴人)", "用水去滅火(吵架)", "花錢消災"], answer: 1, explanation: "火生土，土生金。用「土」(印星)轉化壓力，是最高級的「殺印相生」解法。" },
  { id: 8, question: "對庚金來說，哪一種活動屬於「比劫幫身」？", options: ["唱歌", "健身重訓", "看書", "逛街"], answer: 1, explanation: "健身練肌肉是物理補金(比劫)。看書是補土(印)，唱歌是補水(食傷)。" },
  { id: 9, question: "「印星」在成音工作中可以對應為什麼？", options: ["麥克風", "線材", "SOP與技術知識", "觀眾"], answer: 2, explanation: "印星代表資源與保護。在工作中，SOP、說明書、技術底蘊就是您的印星。" },
  { id: 10, question: "當您覺得焦慮、睡不著(火旺)時，最適合做什麼？", options: ["去夜店喝酒", "去爬山/接觸大地", "熬夜打電動", "吃麻辣鍋"], answer: 1, explanation: "爬山是補土，土能洩火生金。夜店(火燥)、熬夜(火)、麻辣鍋(火)都會加重焦慮。" },
  { id: 11, question: "女友是「甲木」，您是「庚金」，這個組合叫什麼？", options: ["水火不容", "庚金劈甲", "土多金埋", "金水相生"], answer: 1, explanation: "庚金劈甲引丁，代表互相成就。斧頭雕刻神木，讓她成材。" },
  { id: 12, question: "女友的年干「乙木」被您的「庚金」合住，這代表什麼？", options: ["您會被她欺負", "您能幫她斬斷爛桃花/損友", "你們會常吵架", "沒有意義"], answer: 1, explanation: "乙庚合金。乙木是她的劫財(損友)，被您合住代表您能幫她過濾無效社交。" },
  { id: 13, question: "女友日柱「甲辰」，坐下「辰土」代表她的什麼？", options: ["正官", "偏財庫", "食神", "七殺"], answer: 1, explanation: "甲木剋辰土(偏財)。日坐偏財代表她有商業頭腦，喜歡投資或賺大錢。" },
  { id: 14, question: "為什麼女友(甲木)需要您的「午火」？", options: ["因為她太熱", "因為她是濕木頭", "因為火剋木", "不需要"], answer: 1, explanation: "她生在冬天(亥月)又坐濕土，需要火來暖局除濕，才華才能燃燒。" },
  { id: 15, question: "您的「戌土」(年支)對女友的「辰土」(日支)有什麼關鍵作用？", options: ["辰戌沖，沖開財庫", "辰戌合", "土多金埋", "沒作用"], answer: 0, explanation: "辰戌相沖。沖能開庫，且燥土(戌)能中和濕土(辰)，讓財庫更穩固。" },
  { id: 16, question: "2026年是「丙午年」，對庚金來說是什麼年？", options: ["財源滾滾", "輕鬆度假", "官殺攻身(壓力大)", "印星護身"], answer: 2, explanation: "丙(七殺)午(正官)，火氣極旺，是官殺混雜攻身的一年，壓力巨大但有成名機會。" },
  { id: 17, question: "2026年火旺，建議去哪裡旅遊改運？", options: ["熱帶沙漠", "北方/寒冷有水的地方", "火山地帶", "赤道國家"], answer: 1, explanation: "水能剋火。去日本北海道、歐洲等寒冷或有水的地方，能調候過旺的火氣。" },
  { id: 18, question: "2024年「甲辰年」為什麼是您的戀愛年？", options: ["甲木是您的偏財(情人)", "辰土是傷官", "甲木是七殺", "沒特別原因"], answer: 0, explanation: "甲木透干，對庚金來說是偏財(情人星)出現，故紅鸞星動。" },
  { id: 19, question: "面對2026的高壓，庚金工程師應該怎麼做？", options: ["高調反抗", "辭職不幹", "低調SOP、找隊友(金)分擔", "單打獨鬥"], answer: 2, explanation: "身弱遇殺，不能硬碰硬。要用印(SOP)化解，或用比劫(隊友)扛傷。" },
  { id: 20, question: "流年天干如果是「戊」或「己」，對您來說是？", options: ["壓力年", "貴人/充電年", "破財年", "桃花年"], answer: 1, explanation: "戊己屬土，土生金(印星)。這是您最舒服、最能獲得資源和休息的年份。" },
  { id: 21, question: "人類圖的「顯示生產者(MG)」對應八字中的什麼特質？", options: ["土多金埋", "庚金+七殺 (效率與速度)", "水火既濟", "木火通明"], answer: 1, explanation: "MG 講求效率與多工，對應庚金的執行力與七殺的爆發力。" },
  { id: 22, question: "人類圖「5/1人」的「1爻」特質，對應八字什麼需求？", options: ["需要印星(土)的知識累積", "需要財星(木)的享受", "需要食傷(水)的宣洩", "不需要任何東西"], answer: 0, explanation: "1爻需要研究與基礎，對應八字身弱喜「印(土)」，透過知識累積安全感。" },
  { id: 23, question: "當「薦骨」發出聲音時，在五行上代表啟動了什麼？", options: ["大腦邏輯(金)", "食傷直覺(水)", "官殺壓力(火)", "財星慾望(木)"], answer: 1, explanation: "薦骨回應是身體的本能直覺，對應食傷(水)的自然流露，而非大腦(金)的切割分析。" },
  { id: 24, question: "成音工作中「Parallel Compression (平行壓縮)」類似八字的什麼？", options: ["比肩 (增加隊友)", "傷官 (宣洩)", "正官 (管制)", "偏財 (流動)"], answer: 0, explanation: "平行壓縮是複製一個訊號來增強原訊號，就像「比肩」(兄弟)來幫忙扛重物。" },
  { id: 25, question: "「Feedback (嘯叫)」通常代表五行中的哪一個過旺？", options: ["水 (太冷)", "火 (太燥/失控)", "土 (太厚)", "金 (太硬)"], answer: 1, explanation: "火主炎上、擴散。Feedback 是能量失控的循環，就像火氣失控導致焦慮。" },
  { id: 26, question: "「巳」裡面藏的真正能量(本氣)是什麼？", options: ["陰火 (小火)", "陽火 (大太陽/丙)", "陽金 (斧頭)", "陰土 (濕土)"], answer: 1, explanation: "巳雖為陰支，本氣為「丙火」。對庚金來說是「七殺」，代表強烈、擴散的大能量。" },
  { id: 27, question: "「午」裡面藏的真正能量(本氣)是什麼？", options: ["陽火 (大太陽)", "陰火 (燭火/丁)", "陰水 (雨露)", "陽木 (大樹)"], answer: 1, explanation: "午雖為陽支，本氣為「丁火」。對庚金來說是「正官」，代表精細、聚焦的能量(雷射)。" }
];

// --- 3. 核心演算法 (基準點 2024/2/28 = 甲子) ---

const REFERENCE_DATE = new Date(2024, 1, 28); 
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const getDayGanZhi = (date) => {
  const diffTime = date.getTime() - REFERENCE_DATE.getTime();
  const diffDays = Math.floor(diffTime / MS_PER_DAY);
  let index = diffDays % 60;
  if (index < 0) index += 60;
  return { gan: TIAN_GAN[index % 10], zhi: DI_ZHI[index % 12], index };
};

const getYearGanZhi = (date) => {
  let year = date.getFullYear();
  if (date.getMonth() < 1 || (date.getMonth() === 1 && date.getDate() < 4)) year -= 1;
  const gIdx = (year - 3 - 1) % 10;
  const zIdx = (year - 3 - 1) % 12;
  return { gan: TIAN_GAN[gIdx < 0 ? gIdx+10 : gIdx], zhi: DI_ZHI[zIdx < 0 ? zIdx+12 : zIdx] };
};

const getMonthGanZhi = (date, yearGan) => {
  let year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  let zhiIndex = 2; 
  const dateVal = month + day/100;
  if (dateVal >= 2.04 && dateVal < 3.06) zhiIndex = 2;
  else if (dateVal >= 3.06 && dateVal < 4.05) zhiIndex = 3;
  else if (dateVal >= 4.05 && dateVal < 5.06) zhiIndex = 4;
  else if (dateVal >= 5.06 && dateVal < 6.07) zhiIndex = 5;
  else if (dateVal >= 6.07 && dateVal < 7.07) zhiIndex = 6;
  else if (dateVal >= 7.07 && dateVal < 8.08) zhiIndex = 7;
  else if (dateVal >= 8.08 && dateVal < 9.08) zhiIndex = 8;
  else if (dateVal >= 9.08 && dateVal < 10.08) zhiIndex = 9;
  else if (dateVal >= 10.08 && dateVal < 11.07) zhiIndex = 10;
  else if (dateVal >= 11.07 && dateVal < 12.07) zhiIndex = 11;
  else if (dateVal >= 12.07 || dateVal < 1.06) zhiIndex = 0;
  else zhiIndex = 1;

  const yearGanIdx = TIAN_GAN.indexOf(yearGan);
  let startGanIdx = 0;
  if (yearGanIdx === 0 || yearGanIdx === 5) startGanIdx = 2;
  else if (yearGanIdx === 1 || yearGanIdx === 6) startGanIdx = 4;
  else if (yearGanIdx === 2 || yearGanIdx === 7) startGanIdx = 6;
  else if (yearGanIdx === 3 || yearGanIdx === 8) startGanIdx = 8;
  else if (yearGanIdx === 4 || yearGanIdx === 9) startGanIdx = 0;

  let offset = zhiIndex - 2;
  if (offset < 0) offset += 12;
  const monthGanIdx = (startGanIdx + offset) % 10;
  return { gan: TIAN_GAN[monthGanIdx], zhi: DI_ZHI[zhiIndex] };
};

const analyzeFortuneGF = (dayInfo) => {
  const { ganEle, zhiEle } = dayInfo;
  let type = '', advice = '', icon = null, color = 'bg-rose-50 border-rose-100';

  if (zhiEle === '火' || ganEle === '火') {
    type = '心情美麗 (食傷生財)'; advice = '才華爆發！適合去漂亮的咖啡廳，或做些有創意的事。'; icon = <Flame className="w-5 h-5 text-rose-500" />;
  } else if (zhiEle === '水' || ganEle === '水') {
    type = '憂鬱文青 (印星太旺)'; advice = '容易想太多。請男友多抱抱她，帶她去曬太陽。'; icon = <CloudRain className="w-5 h-5 text-blue-400" />; color = 'bg-blue-50 border-blue-100';
  } else if (zhiEle === '金' || ganEle === '金') {
    type = '男友依賴 (官殺旺)'; advice = '特別需要安全感。適合約會，讓男友做決定。'; icon = <Heart className="w-5 h-5 text-pink-500" />;
  } else if (zhiEle === '土') {
    if (dayInfo.zhi === '辰' || dayInfo.zhi === '丑') {
       type = '財庫濕冷 (濕土)'; advice = '心情普普，小心亂花錢發洩。'; icon = <CloudRain className="w-5 h-5 text-slate-400" />;
    } else {
       type = '財運穩定 (燥土)'; advice = '心情穩定，適合規劃未來或存錢。'; icon = <Sun className="w-5 h-5 text-orange-400" />;
    }
  } else { 
    type = '朋友聚會 (比劫)'; advice = '可能會想找朋友聊聊，或是比較固執一點。'; icon = <HeartHandshake className="w-5 h-5 text-green-500" />;
  }
  return { type, advice, icon, color };
};

const analyzeFullFortune = (dayInfo, monthInfo, yearInfo) => {
  const { ganEle: dGanEle, zhiEle: dZhiEle } = dayInfo;
  const { ganEle: mGanEle, zhiEle: mZhiEle } = monthInfo;
  const { ganEle: yGanEle, zhiEle: yZhiEle } = yearInfo;

  let score = 0;
  const getScore = (ele) => { if (ele === '土') return 2; if (ele === '金') return 1; if (ele === '水') return -0.5; if (ele === '木') return -1.5; if (ele === '火') return -2; return 0; };
  score += getScore(dGanEle) + getScore(dZhiEle);

  let monthMsg = "";
  if (mZhiEle === '木') { score -= 1.5; monthMsg = "木旺(財星)月：雜事多、易耗神。需補土金。"; }
  else if (mZhiEle === '火') { score -= 2; monthMsg = "火旺(官殺)月：壓力大、易焦慮。需降溫。"; }
  else if (mZhiEle === '土') { score += 1.5; monthMsg = "土旺(印星)月：貴人多、心態穩。好運期。"; }
  else if (mZhiEle === '金') { score += 1; monthMsg = "金旺(比劫)月：隊友給力、執行力強。"; }
  else { score -= 0.5; monthMsg = "水旺(食傷)月：心情起伏、才華流動。"; }

  let yearMsg = "";
  if (yearInfo.gan === '丙' && yearInfo.zhi === '午') { yearMsg = "烈火攻身年：壓力極大，務必低調，多用土護身。"; score -= 2; }
  else if (yearInfo.gan === '乙' && yearInfo.zhi === '巳') { yearMsg = "財官雙美年：機遇多，但偏火旺，小心過勞。"; score -= 0.5; }
  else if (yZhiEle === '土' || yZhiEle === '金') { yearMsg = "流年相生：整體運勢有底氣。"; score += 1; }
  else { yearMsg = "流年平穩：按部就班。"; }

  let type = '', advice = '', color = '', icon = '', audioTerm = '';
  let quests = [];

  if (score >= 3) {
    type = '強運：印比齊來'; advice = '能量滿點，適合做重大決定。'; color = '大地色系 + 金屬飾品'; icon = <Shield className="w-5 h-5 text-yellow-600" />; audioTerm = 'Headroom 極大，訊號飽滿。';
    quests = ["學習新技術 30 分鐘", "整理工作 SOP", "吃一頓豐盛晚餐"];
  } else if (score >= 1) {
    type = '平穩：有得有失'; advice = '運勢持平。有隊友或貴人相助。'; color = '白色、米色'; icon = <Battery className="w-5 h-5 text-slate-500" />; audioTerm = '訊號在 Sweet Spot。';
    quests = ["健身/運動 30 分鐘", "與同事交流想法", "整理工作區"];
  } else if (score >= -2) {
    type = '消耗：財官雙殺'; advice = '外務繁多，容易累。早睡早起。'; color = '卡其色 (土來通關)'; icon = <Zap className="w-5 h-5 text-orange-500" />; audioTerm = 'Comp 運作頻繁，Gain Reduction 大。';
    quests = ["喝溫熱水 2000cc", "拒絕一個無效請求", "提早一小時上床"];
  } else {
    type = '警報：火旺金鎔'; advice = '壓力指數爆表。易失眠、焦慮。勿硬扛。'; color = '深卡其、泥土色'; icon = <AlertTriangle className="w-5 h-5 text-red-600 animate-pulse" />; audioTerm = 'Clip 紅燈長亮！系統過載！';
    quests = ["深呼吸冥想 10 分鐘", "完全不看工作訊息一小時", "找女友討拍"];
  }

  let energyLevel = 50;
  let energyColor = "bg-yellow-500";
  if (score >= 2) { energyLevel = 95; energyColor = "bg-green-500"; }
  else if (score >= 0) { energyLevel = 75; energyColor = "bg-blue-500"; }
  else if (score >= -2) { energyLevel = 45; energyColor = "bg-orange-500"; }
  else { energyLevel = 20; energyColor = "bg-red-500"; }

  let workFocus = "";
  if (dZhiEle === '土') workFocus = "深度研發 / 建立系統 / 學習";
  else if (dZhiEle === '金') workFocus = "高難度執行 / 解決硬體問題";
  else if (dZhiEle === '水') workFocus = "創意發想 / 寫作 / 表演";
  else if (dZhiEle === '木') workFocus = "行政 / 財務 / 社交 (需耐心)";
  else workFocus = "例行維護 / 整理 / 閉關 (低調)";

  let food = "";
  if (dZhiEle === '火' || dGanEle === '火') food = "降火系：綠豆湯、冬瓜茶、蓮藕";
  else if (dZhiEle === '木' || dGanEle === '木') food = "補金系：白蘿蔔排骨湯、雞肉";
  else if (dZhiEle === '水' || dGanEle === '水') food = "暖胃系：熱薑茶、胡椒豬肚湯";
  else if (dZhiEle === '土') food = "補氣系：牛肉湯、根莖類";
  else food = "強身系：牛排、高蛋白";

  let loveScore = 80; let loveDesc = "日常甜蜜，互相成就。"; let loveType = "吉";
  if (dayInfo.zhi === '子') { loveScore = 40; loveDesc = "子午沖！火氣大易焦躁。"; loveType = "凶"; }
  else if (dayInfo.zhi === '戌') { loveScore = 50; loveDesc = "辰戌沖！女友心情不穩。"; loveType = "平"; }
  else if (dayInfo.zhi === '未') { loveScore = 95; loveDesc = "天地鴛鴦合，大吉！"; loveType = "大吉"; }
  else if (dayInfo.zhi === '酉') { loveScore = 90; loveDesc = "辰酉合，女友黏人。"; loveType = "大吉"; }
  else if (dayInfo.gan === '乙') { loveScore = 85; loveDesc = "乙庚合，桃花旺。"; loveType = "吉"; }

  let luckyColorHex = "#E2E8F0"; let luckyColorName = "淺灰/金屬";
  if (color.includes("大地")) { luckyColorHex = "#B45309"; luckyColorName = "焦糖/大地色"; } 
  else if (color.includes("白色")) { luckyColorHex = "#F8FAFC"; luckyColorName = "米白/銀灰"; } 
  else if (color.includes("卡其")) { luckyColorHex = "#D4D4D8"; luckyColorName = "卡其/淺灰"; } 
  else if (color.includes("深卡其")) { luckyColorHex = "#78350F"; luckyColorName = "深咖/泥土"; } 

  let activity = "";
  if (dZhiEle === '金') activity = "健身重訓、練團";
  else if (dZhiEle === '土') activity = "爬山、在家睡覺";
  else if (dZhiEle === '水') activity = "唱歌、看電影";
  else if (dZhiEle === '木') activity = "逛街、整理財務";
  else activity = "冥想、泡熱水澡";

  let intimateScore = 0; let intimateDesc = ""; let intimateIcon = null; let intimateColor = "";
  if (dZhiEle === '土' || dZhiEle === '金') { intimateScore = 90; intimateDesc = "體力滿檔！適合主動出擊。"; intimateIcon = <Flame className="w-5 h-5 text-rose-500 animate-pulse" />; intimateColor = "bg-rose-50 border-rose-200 text-rose-800"; }
  else if (dZhiEle === '水') { intimateScore = 30; intimateDesc = "食傷洩氣。建議純抱抱。"; intimateIcon = <Battery className="w-5 h-5 text-slate-400" />; intimateColor = "bg-slate-50 border-slate-200 text-slate-600"; }
  else if (dZhiEle === '火') { intimateScore = 40; intimateDesc = "壓力大易發炎，勿勉強。"; intimateIcon = <AlertTriangle className="w-5 h-5 text-orange-500" />; intimateColor = "bg-orange-50 border-orange-200 text-orange-700"; }
  else { intimateScore = 50; intimateDesc = "慾望強但體力差，量力而為。"; intimateIcon = <Heart className="w-5 h-5 text-pink-400" />; intimateColor = "bg-pink-50 border-pink-200 text-pink-700"; }

  return { type, advice, color, icon, score, audioTerm, monthMsg, yearMsg, food, loveScore, loveDesc, loveType, luckyColorHex, luckyColorName, activity, intimateScore, intimateDesc, intimateIcon, intimateColor, quests, energyLevel, energyColor, workFocus };
};

// --- Visualization Components ---
const FiveElementsGraph = () => {
  const elements = [
    { name: '火', color: 'bg-red-500', text: 'text-red-500', label: '壓力 (官殺)', x: 50, y: 10 },
    { name: '土', color: 'bg-yellow-500', text: 'text-yellow-500', label: '貴人 (印星)', x: 90, y: 40 },
    { name: '金', color: 'bg-slate-400', text: 'text-slate-500', label: '隊友 (比劫)', x: 75, y: 90 },
    { name: '水', color: 'bg-blue-500', text: 'text-blue-500', label: '才華 (食傷)', x: 25, y: 90 },
    { name: '木', color: 'bg-green-500', text: 'text-green-500', label: '財富 (財星)', x: 10, y: 40 },
  ];

  return (
    <div className="relative w-full aspect-square max-w-[300px] mx-auto my-6 select-none">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <defs>
          <marker id="arrow-green" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#22c55e" />
          </marker>
          <marker id="arrow-red" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#ef4444" />
          </marker>
        </defs>
        <path d="M14,40 Q10,10 42,12" fill="none" stroke="#22c55e" strokeWidth="2" markerEnd="url(#arrow-green)" strokeDasharray="4" />
        <path d="M58,12 Q90,10 86,36" fill="none" stroke="#22c55e" strokeWidth="2" markerEnd="url(#arrow-green)" strokeDasharray="4" />
        <path d="M92,46 Q100,80 78,86" fill="none" stroke="#22c55e" strokeWidth="2" markerEnd="url(#arrow-green)" strokeDasharray="4" />
        <path d="M68,90 Q50,100 32,90" fill="none" stroke="#22c55e" strokeWidth="2" markerEnd="url(#arrow-green)" strokeDasharray="4" />
        <path d="M22,86 Q0,80 8,46" fill="none" stroke="#22c55e" strokeWidth="2" markerEnd="url(#arrow-green)" strokeDasharray="4" />
        <line x1="18" y1="42" x2="82" y2="42" stroke="#ef4444" strokeWidth="1" opacity="0.3" markerEnd="url(#arrow-red)" />
        <line x1="86" y1="46" x2="30" y2="86" stroke="#ef4444" strokeWidth="1" opacity="0.3" markerEnd="url(#arrow-red)" />
        <line x1="28" y1="86" x2="48" y2="18" stroke="#ef4444" strokeWidth="1" opacity="0.3" markerEnd="url(#arrow-red)" />
        <line x1="52" y1="18" x2="72" y2="86" stroke="#ef4444" strokeWidth="1" opacity="0.3" markerEnd="url(#arrow-red)" />
        <line x1="70" y1="86" x2="18" y2="46" stroke="#ef4444" strokeWidth="1" opacity="0.3" markerEnd="url(#arrow-red)" />
      </svg>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="text-[10px] font-bold text-slate-400">Geng Metal</div>
        <div className="text-xl font-bold text-slate-700">庚金</div>
        <div className="text-[8px] text-slate-400">(Me)</div>
      </div>
      {elements.map((el, i) => (
        <div key={i} className="absolute flex flex-col items-center" style={{ left: `${el.x}%`, top: `${el.y}%`, transform: 'translate(-50%, -50%)' }}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${el.color} z-10`}>
            {el.name}
          </div>
          <div className={`text-[10px] font-bold mt-1 bg-white/80 px-1 rounded ${el.text}`}>{el.label}</div>
        </div>
      ))}
    </div>
  );
};

const EarthlyBranchesClock = () => {
  const branches = [
    { name: '午', time: '11-13', color: 'bg-red-500', pos: 'top-0 left-1/2 -translate-x-1/2' }, 
    { name: '未', time: '13-15', color: 'bg-yellow-500', pos: 'top-[7%] right-[25%]' }, 
    { name: '申', time: '15-17', color: 'bg-slate-400', pos: 'top-[25%] right-[7%]' },
    { name: '酉', time: '17-19', color: 'bg-slate-400', pos: 'top-1/2 right-0 -translate-y-1/2' }, 
    { name: '戌', time: '19-21', color: 'bg-yellow-500', pos: 'bottom-[25%] right-[7%]' },
    { name: '亥', time: '21-23', color: 'bg-blue-500', pos: 'bottom-[7%] right-[25%]' },
    { name: '子', time: '23-01', color: 'bg-blue-500', pos: 'bottom-0 left-1/2 -translate-x-1/2' }, 
    { name: '丑', time: '01-03', color: 'bg-yellow-500', pos: 'bottom-[7%] left-[25%]' },
    { name: '寅', time: '03-05', color: 'bg-green-500', pos: 'bottom-[25%] left-[7%]' },
    { name: '卯', time: '05-07', color: 'bg-green-500', pos: 'top-1/2 left-0 -translate-y-1/2' }, 
    { name: '辰', time: '07-09', color: 'bg-yellow-500', pos: 'top-[25%] left-[7%]' },
    { name: '巳', time: '09-11', color: 'bg-red-500', pos: 'top-[7%] left-[25%]' },
  ];

  return (
    <div className="relative w-[260px] h-[260px] mx-auto my-8 border-4 border-slate-200 rounded-full bg-slate-50">
      <div className="absolute inset-0 m-auto w-24 h-24 rounded-full border border-slate-300 flex items-center justify-center text-center">
        <div>
          <div className="text-xs text-slate-400 font-bold uppercase">Compass</div>
          <div className="text-sm text-slate-600 font-bold">地支羅盤</div>
        </div>
      </div>
      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-slate-200 -z-10"></div>
      <div className="absolute left-0 right-0 top-1/2 h-px bg-slate-200 -z-10"></div>
      {branches.map((b, i) => (
        <div key={i} className={`absolute ${b.pos} flex flex-col items-center`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm ${b.color}`}>
            {b.name}
          </div>
          <span className="text-[9px] text-slate-500 font-mono mt-0.5 bg-white px-1 rounded">{b.time}</span>
        </div>
      ))}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 -translate-y-full text-[10px] font-bold text-red-500">南 (Fire)</div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 translate-y-full text-[10px] font-bold text-blue-500">北 (Water)</div>
      <div className="absolute left-2 top-1/2 -translate-x-full -translate-y-1/2 text-[10px] font-bold text-green-600">東 (Wood)</div>
      <div className="absolute right-2 top-1/2 translate-x-full -translate-y-1/2 text-[10px] font-bold text-slate-500">西 (Metal)</div>
    </div>
  );
};

const DailyQuests = ({ quests, dateKey, onComplete, completedQuests }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle2 className="w-5 h-5 text-green-600" />
        <span className="font-bold text-slate-700">今日修煉任務</span>
      </div>
      <div className="space-y-2">
        {quests.map((quest, index) => {
          const isCompleted = completedQuests.includes(`${dateKey}-${index}`);
          return (
            <button
              key={index}
              onClick={() => onComplete(`${dateKey}-${index}`)}
              disabled={isCompleted}
              className={`w-full text-left flex items-center gap-3 p-3 rounded-lg transition-all border ${isCompleted ? 'bg-green-50 border-green-200 text-green-800' : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'}`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isCompleted ? 'border-green-500 bg-green-500 text-white' : 'border-slate-300'}`}>
                {isCompleted && <CheckCircle2 className="w-3 h-3" />}
              </div>
              <span className={`text-sm ${isCompleted ? 'line-through opacity-70' : ''}`}>{quest}</span>
              {isCompleted && <span className="ml-auto text-xs font-bold text-green-600">+XP</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState('calendar'); 
  const [currentDate, setCurrentDate] = useState(new Date());
  const [fullData, setFullData] = useState(null);
  const [gfData, setGfData] = useState(null);
  
  const [knowledge, setKnowledge] = useState(TUTORIAL_CONTENT.basics.intro);
  
  const [xp, setXp] = useState(() => parseInt(localStorage.getItem('bazi_xp')) || 0);
  const [completedQuests, setCompletedQuests] = useState(() => JSON.parse(localStorage.getItem('bazi_completed_quests')) || []);

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  
  const currentLevel = LEVELS.slice().reverse().find(l => xp >= l.minXP) || LEVELS[0];
  const nextLevel = LEVELS.find(l => l.minXP > xp);
  const progress = nextLevel ? ((xp - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100 : 100;

  useEffect(() => { localStorage.setItem('bazi_xp', xp); }, [xp]);
  useEffect(() => { localStorage.setItem('bazi_completed_quests', JSON.stringify(completedQuests)); }, [completedQuests]);

  useEffect(() => {
    const randomIdx = Math.floor(Math.random() * FULL_QUIZ_QUESTIONS.length);
    setCurrentQuestion(FULL_QUIZ_QUESTIONS[randomIdx]);
  }, []); 

  useEffect(() => {
    const dayData = getDayGanZhi(currentDate);
    const dayInfo = { ...dayData, ganEle: ELE_MAP[dayData.gan], zhiEle: ELE_MAP[dayData.zhi] };
    const yearData = getYearGanZhi(currentDate);
    const yearInfo = { ...yearData, ganEle: ELE_MAP[yearData.gan], zhiEle: ELE_MAP[yearData.zhi] };
    const monthData = getMonthGanZhi(currentDate, yearData.gan);
    const monthInfo = { ...monthData, ganEle: ELE_MAP[monthData.gan], zhiEle: ELE_MAP[monthData.zhi] };
    
    const analysis = analyzeFullFortune(dayInfo, monthInfo, yearInfo);
    setFullData({ day: dayData, month: monthData, year: yearData, monthInfo, yearInfo, ...analysis, dayInfo });
    
    const gfAnalysis = analyzeFortuneGF(dayInfo);
    setGfData(gfAnalysis);
  }, [currentDate]);

  const handleQuestComplete = (questId) => {
    if (!completedQuests.includes(questId)) {
      setCompletedQuests([...completedQuests, questId]);
      setXp(prev => prev + 15); 
    }
  };

  const handleOptionClick = (index) => {
    if (showExplanation) return;
    setSelectedOption(index);
    const correct = index === currentQuestion.answer;
    setIsCorrect(correct);
    setShowExplanation(true);
    if (correct) setXp(prev => prev + 10);
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    setShowExplanation(false);
    const randomIdx = Math.floor(Math.random() * FULL_QUIZ_QUESTIONS.length);
    setCurrentQuestion(FULL_QUIZ_QUESTIONS[randomIdx]);
  };

  if (!fullData || !currentQuestion || !gfData) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col items-center py-6 px-4">
      <div className="flex bg-white rounded-full p-1 mb-6 shadow-sm border border-slate-200">
        <button onClick={() => setView('calendar')} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${view === 'calendar' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>運勢儀表板</button>
        <button onClick={() => setView('learn')} className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${view === 'learn' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}><BookOpen className="w-3 h-3" />教學</button>
        <button onClick={() => setView('quiz')} className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${view === 'quiz' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}><Axe className="w-3 h-3" />修煉</button>
      </div>

      {view === 'calendar' ? (
        <div className="w-full max-w-md space-y-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
            <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
              <div><h1 className="text-lg font-bold">庚金工程師日誌 Pro</h1><p className="text-slate-400 text-[10px]">V16 精簡生活版</p></div>
              <div className="flex items-center gap-2 bg-slate-800 px-2 py-1 rounded-lg"><Star className="w-3 h-3 text-yellow-400" /><span className="text-xs font-bold">{xp} XP</span></div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-slate-50 border-b border-slate-200">
              <button onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)))} className="p-2 hover:bg-slate-200 rounded-full"><ChevronLeft className="w-5 h-5 text-slate-600" /></button>
              <div className="text-center cursor-pointer" onClick={() => setCurrentDate(new Date())}>
                <div className="text-base font-bold text-slate-800">{`${currentDate.getFullYear()}年 ${currentDate.getMonth() + 1}月 ${currentDate.getDate()}日`}</div>
                <div className="text-xs text-slate-500">{['週日', '週一', '週二', '週三', '週四', '週五', '週六'][currentDate.getDay()]}</div>
              </div>
              <button onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)))} className="p-2 hover:bg-slate-200 rounded-full"><ChevronRight className="w-5 h-5 text-slate-600" /></button>
            </div>

            <div className="p-5">
              <div className="flex justify-center gap-4 mb-6"><div className="flex flex-col items-center"><span className="text-[10px] uppercase text-slate-400 font-bold mb-1">今日日柱</span><div className="flex gap-1"><div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold text-white shadow ${getElemColor(fullData.dayInfo.ganEle)}`}>{fullData.day.gan}</div><div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold text-white shadow ${getElemColor(fullData.dayInfo.zhiEle)}`}>{fullData.day.zhi}</div></div></div></div>
              
              <div className="mb-6"><DailyQuests quests={fullData.quests} dateKey={`${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`} completedQuests={completedQuests} onComplete={handleQuestComplete} /></div>

              <div className="mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                 <div className="flex justify-between items-center mb-1"><div className="flex items-center gap-1"><BatteryCharging className="w-4 h-4 text-slate-500"/><span className="text-xs font-bold text-slate-700">今日能量值</span></div><span className="text-xs font-bold text-slate-600">{fullData.energyLevel}%</span></div>
                 <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden"><div className={`h-full transition-all duration-500 ${fullData.energyColor}`} style={{ width: `${fullData.energyLevel}%` }}></div></div>
              </div>

              <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 mb-4"><div className="flex items-center gap-2 mb-1"><div className="w-4 h-4 text-indigo-500"><Brain className="w-4 h-4" /></div><span className="text-xs font-bold text-indigo-800">最佳專注模式</span></div><p className="text-xs text-slate-700 font-medium">{fullData.workFocus}</p></div>

              <div className="text-center mb-4"><div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-slate-700 font-bold text-sm mb-2">{fullData.icon}{fullData.type}</div><p className="text-slate-600 text-sm leading-relaxed">{fullData.advice}</p></div>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 col-span-2"><div className="flex items-center gap-2 mb-1"><Utensils className="w-4 h-4 text-orange-500" /><span className="text-xs font-bold text-orange-800">開運菜單</span></div><p className="text-xs text-slate-700 font-medium">{fullData.food}</p></div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200"><div className="flex items-center gap-2 mb-2"><Shirt className="w-4 h-4 text-slate-500" /><span className="text-xs font-bold text-slate-600">OOTD</span></div><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: fullData.luckyColorHex }}></div><span className="text-xs font-bold text-slate-700">{fullData.luckyColorName}</span></div></div>
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100"><div className="flex items-center gap-2 mb-2"><Tent className="w-4 h-4 text-blue-500" /><span className="text-xs font-bold text-blue-600">活動</span></div><p className="text-[10px] text-slate-700 leading-tight">{fullData.activity}</p></div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className={`p-3 rounded-xl border ${fullData.loveScore >= 80 ? 'bg-pink-50 border-pink-100' : fullData.loveScore <= 50 ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-200'}`}><div className="flex justify-between items-start mb-1"><div className="flex items-center gap-1"><HeartHandshake className={`w-4 h-4 ${fullData.loveScore >= 80 ? 'text-pink-500' : 'text-slate-500'}`} /><span className={`text-[10px] font-bold ${fullData.loveScore >= 80 ? 'text-pink-700' : 'text-slate-700'}`}>合盤氣象</span></div><span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${fullData.loveScore >= 80 ? 'bg-pink-200 text-pink-800' : fullData.loveScore <= 50 ? 'bg-red-200 text-red-800' : 'bg-slate-200 text-slate-700'}`}>{fullData.loveType}</span></div><div className="w-full bg-white rounded-full h-1 mb-2 overflow-hidden"><div className={`h-full rounded-full ${fullData.loveScore >= 80 ? 'bg-pink-400' : fullData.loveScore <= 50 ? 'bg-red-400' : 'bg-slate-400'}`} style={{ width: `${fullData.loveScore}%` }}></div></div><p className="text-[10px] text-slate-600 leading-tight">{fullData.loveDesc}</p></div>
                <div className={`p-3 rounded-xl border ${fullData.intimateColor}`}><div className="flex items-center gap-1 mb-2">{fullData.intimateIcon}<span className="text-[10px] font-bold">親密指數</span></div><div className="flex items-end gap-1 mb-1"><span className="text-2xl font-bold leading-none">{fullData.intimateScore}</span><span className="text-[10px] opacity-70 mb-0.5">%</span></div><p className="text-[10px] opacity-80 leading-tight">{fullData.intimateDesc}</p></div>
              </div>

              <div className={`p-4 rounded-xl border ${gfData.color} shadow-sm`}><div className="flex items-center gap-2 mb-2 border-b border-black/5 pb-2"><ArrowUpCircle className="w-4 h-4 text-rose-500" /><span className="text-xs font-bold text-slate-700">甲木女友日誌</span></div><div className="flex items-start gap-3"><div className="bg-white p-2 rounded-full shadow-sm">{gfData.icon}</div><div><div className="font-bold text-slate-800 text-sm mb-1">{gfData.type}</div><p className="text-xs text-slate-600 leading-relaxed">{gfData.advice}</p></div></div></div>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl shadow-lg p-5 border border-slate-100">
             <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2"><Shield className="w-5 h-5 text-blue-600" /><h3 className="font-bold text-slate-800">年月能量監控</h3></div>
             <div className="space-y-4">
               <div className="flex items-center gap-3"><div className="flex gap-1 shrink-0"><div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white ${getElemColor(fullData.yearInfo.ganEle)}`}>{fullData.year.gan}</div><div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white ${getElemColor(fullData.yearInfo.zhiEle)}`}>{fullData.year.zhi}</div></div><div className="flex flex-col"><span className="text-[10px] font-bold text-slate-400">流年</span><p className="text-xs text-slate-600 leading-tight">{fullData.yearMsg}</p></div></div>
               <div className="flex items-center gap-3"><div className="flex gap-1 shrink-0"><div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white ${getElemColor(fullData.monthInfo.ganEle)}`}>{fullData.month.gan}</div><div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white ${getElemColor(fullData.monthInfo.zhiEle)}`}>{fullData.month.zhi}</div></div><div className="flex flex-col"><span className="text-[10px] font-bold text-slate-400">流月</span><p className="text-xs text-slate-600 leading-tight">{fullData.monthMsg}</p></div></div>
             </div>
          </div>
        </div>
      ) : view === 'learn' ? (
        <div className="w-full max-w-md space-y-6 animate-in slide-in-from-right duration-300 pb-10">
           {/* Section: Hidden Stems (New) */}
           <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 bg-gradient-to-br from-purple-50 to-white"><h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><Search className="w-5 h-5 text-purple-600" /> {TUTORIAL_CONTENT.hiddenStems.title}</h2><p className="text-sm text-slate-600 mb-4">{TUTORIAL_CONTENT.hiddenStems.intro}</p><div className="space-y-3">{TUTORIAL_CONTENT.hiddenStems.items.map((item, i) => (<div key={i} className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm"><div className="flex justify-between items-center mb-2"><div className="flex items-center gap-2"><div className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-lg shadow-md">{item.zhi}</div><ArrowRight className="w-4 h-4 text-slate-300" /><span className="font-bold text-purple-700 text-lg">{item.real}</span></div><span className={`text-xs font-bold px-2 py-1 rounded ${item.size === '大' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{item.size}{item.ele} ({item.god})</span></div><p className="text-xs text-slate-600 leading-relaxed pl-2 border-l-2 border-purple-200">{item.desc}</p></div>))}</div></div>

           {/* Section: HD Cross */}
           <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 bg-gradient-to-br from-blue-50 to-white"><h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><Fingerprint className="w-5 h-5 text-blue-600" /> {TUTORIAL_CONTENT.hd_cross.title}</h2><p className="text-sm text-slate-600 mb-4">{TUTORIAL_CONTENT.hd_cross.intro}</p><div className="space-y-3">{TUTORIAL_CONTENT.hd_cross.items.map((item, i) => (<div key={i} className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm"><h3 className="font-bold text-slate-800 mb-1">{item.name}</h3><p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p></div>))}</div></div>
           {/* Section: Life Strategy */}
           <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 bg-gradient-to-br from-yellow-50 to-white"><h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-yellow-600" /> {TUTORIAL_CONTENT.lifeStrategy.title}</h2><p className="text-sm text-slate-600 mb-4">{TUTORIAL_CONTENT.lifeStrategy.intro}</p><div className="space-y-3">{TUTORIAL_CONTENT.lifeStrategy.items.map((item, i) => (<div key={i} className="bg-white p-4 rounded-xl border border-yellow-100 shadow-sm"><div className="flex justify-between items-center mb-2"><span className="text-xs font-bold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">{item.type}</span><span className="text-xs font-mono text-slate-400">{item.god}</span></div><h3 className="font-bold text-slate-800 mb-1">{item.action}</h3><p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p></div>))}</div></div>
           
           {/* Section 0: Origin */}
           <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100"><h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><Sun className="w-5 h-5 text-orange-500" /> {TUTORIAL_CONTENT.origins.title}</h2><p className="text-sm text-slate-600 mb-4">{TUTORIAL_CONTENT.origins.intro}</p><div className="space-y-3">{TUTORIAL_CONTENT.origins.items.map((item, i) => (<div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100"><div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0 ${getElemColor(item.ele)}`}>{item.ele}</div><div><div className="flex items-center gap-2 mb-1"><span className="font-bold text-slate-800 text-sm">{item.season}</span><span className="text-[10px] bg-white px-2 py-0.5 rounded text-slate-500 font-mono border border-slate-200">{item.gans}</span></div><p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p></div></div>))}</div></div>
           {/* Section 1: 基礎 & 時鐘 */}
           <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100"><h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-blue-600" /> {TUTORIAL_CONTENT.basics.title}</h2><p className="text-sm text-slate-600 mb-4">{TUTORIAL_CONTENT.basics.intro}</p><div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6"><h3 className="text-sm font-bold text-slate-500 mb-2 flex items-center gap-2"><Compass className="w-4 h-4" /> 地支方位時鐘</h3><p className="text-xs text-slate-400 mb-4">外圈是地支，內圈是時間。顏色代表五行。</p><EarthlyBranchesClock /></div><div className="space-y-4"><h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b pb-1">天干 (Heavenly Stems)</h3><div className="grid grid-cols-2 gap-2">{TUTORIAL_CONTENT.basics.stems.map((item, i) => (<div key={i} className="flex items-center bg-slate-50 p-2 rounded-lg"><div className={`w-6 h-6 rounded flex items-center justify-center text-white font-bold text-xs shrink-0 mr-2 ${getElemColor(item.element)}`}>{item.element}</div><div><div className="font-bold text-slate-700 text-xs">{item.gan.join('、')}</div></div></div>))}</div></div></div>
           {/* Section 2: 五行生剋圖 */}
           <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100"><h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><RefreshCw className="w-5 h-5 text-green-600" /> {TUTORIAL_CONTENT.cycles.title}</h2><p className="text-sm text-slate-600 mb-2">{TUTORIAL_CONTENT.cycles.intro}</p><div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6"><h3 className="text-sm font-bold text-slate-500 mb-4 flex items-center gap-2"><Activity className="w-4 h-4" /> 能量流動圖</h3><FiveElementsGraph /><div className="mt-4 grid grid-cols-2 gap-4 text-xs text-slate-600"><div className="flex items-start gap-2"><ArrowUpCircle className="w-4 h-4 text-green-500 shrink-0" /><div><span className="font-bold text-green-600">相生 (順時針)</span><br/>能量的來源，如土生金(貴人)。</div></div><div className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-red-500 shrink-0" /><div><span className="font-bold text-red-500">相剋 (星形)</span><br/>能量的控制，如火剋金(壓力)。</div></div></div></div></div>
           {/* Section 3: 十神卡片 */}
           <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100"><h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><Brain className="w-5 h-5 text-purple-600" /> {TUTORIAL_CONTENT.tenGods.title}</h2><p className="text-sm text-slate-600 mb-6">{TUTORIAL_CONTENT.tenGods.intro}</p><div className="grid gap-4">{TUTORIAL_CONTENT.tenGods.gods.map((god, i) => (<div key={i} className="border border-slate-100 rounded-xl p-4 hover:shadow-md transition-shadow"><div className="flex justify-between items-start mb-2"><div className="flex items-center gap-2"><div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${getElemColor(god.element)}`}>{god.element}</div><div><div className="font-bold text-slate-800">{god.name}</div><div className="text-[10px] text-slate-400 uppercase">{god.types.join(' / ')}</div></div></div><span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-1 rounded-full font-bold">{god.meaning}</span></div><p className="text-xs text-slate-600 leading-relaxed mt-2 border-t border-slate-50 pt-2">{god.desc}</p></div>))}</div></div>
           {/* Section 4: Solar Terms */}
           <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100"><h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><CloudRain className="w-5 h-5 text-blue-400" /> {TUTORIAL_CONTENT.solarTerms.title}</h2><p className="text-sm text-slate-600 mb-6">{TUTORIAL_CONTENT.solarTerms.intro}</p><div className="space-y-3">{TUTORIAL_CONTENT.solarTerms.terms.map((item, i) => (<div key={i} className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors border-b border-slate-50 last:border-0"><div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm ${getElemColor(item.ele)}`}>{item.zhi}</div><div className="flex-1"><div className="flex justify-between items-center mb-1"><span className="font-bold text-slate-800 text-sm">{item.month} <span className="text-slate-400 font-normal text-xs">({item.ele})</span></span><span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">{item.solar}</span></div><p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p></div></div>))}</div></div>
           {/* Section 5: Combinations */}
           <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100"><h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><Layers className="w-5 h-5 text-purple-500" /> {TUTORIAL_CONTENT.combinations.title}</h2><p className="text-sm text-slate-600 mb-6">{TUTORIAL_CONTENT.combinations.intro}</p><div className="space-y-3">{TUTORIAL_CONTENT.combinations.items.map((item, i) => (<div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-200"><h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-slate-400"></span>{item.name}</h3><p className="text-xs text-slate-600 leading-relaxed pl-4">{item.desc}</p></div>))}</div></div>
        </div>
      ) : (
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 animate-in slide-in-from-right duration-300">
          <div className="bg-slate-900 p-6 pb-12 text-white relative flex flex-col items-center">
            <div className="absolute top-4 right-4 flex items-center gap-1 bg-slate-800/50 px-2 py-1 rounded-lg"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /><span className="text-xs font-bold">{xp} XP</span></div>
            <div className={`mb-4 transition-all duration-700 ${currentLevel.color} ${currentLevel.shadow}`}><Axe size={80} strokeWidth={1.5} /></div>
            <h2 className={`text-xl font-bold mb-1 ${currentLevel.level >= 5 ? 'text-yellow-400 animate-pulse' : ''}`}>{currentLevel.name}</h2>
            <p className="text-slate-400 text-xs mb-4 text-center px-4">{currentLevel.desc}</p>
            <div className="w-full max-w-[200px] h-2 bg-slate-700 rounded-full overflow-hidden relative"><div className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-500" style={{ width: `${progress}%` }}></div></div>
          </div>
          <div className="px-6 py-8 -mt-6 bg-white rounded-t-3xl min-h-[300px]">
            <div className="flex justify-between items-center mb-4"><span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Question {currentQuestion.id}</span></div>
            <h3 className="text-lg font-bold text-slate-800 mb-6 leading-tight">{currentQuestion.question}</h3>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button key={index} disabled={selectedOption !== null} onClick={() => handleOptionClick(index)} className={`w-full p-4 rounded-xl text-left text-sm font-medium transition-all border-2 ${selectedOption === null ? 'bg-slate-50 border-transparent hover:border-slate-300 text-slate-600' : index === currentQuestion.answer ? 'bg-green-50 border-green-500 text-green-700' : index === selectedOption ? 'bg-red-50 border-red-500 text-red-700' : 'bg-slate-50 border-transparent opacity-50'}`}>
                  <div className="flex justify-between items-center"><span>{option}</span>{selectedOption !== null && index === currentQuestion.answer && <Trophy className="w-4 h-4 text-green-600" />}</div>
                </button>
              ))}
            </div>
            {showExplanation && (
              <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className={`p-4 rounded-xl mb-4 ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-slate-100 text-slate-800'}`}><p className="text-sm opacity-90 leading-relaxed"><span className="font-bold">解析：</span>{currentQuestion.explanation}</p></div>
                <button onClick={nextQuestion} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4" />下一題</button>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="mt-8 text-[10px] text-slate-400 text-center"> Designed for Geng Wu Engineer <br/> Powered by Pro Bazi Algorithm </div>
    </div>
  );
}