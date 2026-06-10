import { useState, useMemo, useEffect, useRef } from "react";
import { supabase } from "./supabase";

const ICON_LIST = ["🤖","📦","🚢","⚓","🔎","📰","🏛","💱","📋","🔗","📊","📝","💬","⚙️","🎯","📌","☁️","🌐","🔑","🏢","✉️","📈","📉","🎨","🐙","🎥","📚","🔧","📱","🌍","🏦","📮","🗂","📁","🔐","🛳","✈️","🚛","🏗","📜"];

const ACCENT_COLORS = ["#7c3aed","#2563eb","#0284c7","#059669","#d97706","#dc2626","#be185d","#16a34a","#ea580c","#0891b2","#9333ea","#65a30d"];

const DEFAULT_DATA = {
  title: "한불 바로가기",
  categories: [
    { id:"ai", label:"AI", icon:"🤖", color:"#7c3aed" },
    { id:"dow", label:"DOW & 지수", icon:"📌", color:"#2563eb" },
    { id:"carrier", label:"선사", icon:"🚢", color:"#0284c7" },
    { id:"terminal", label:"터미널", icon:"⚓", color:"#059669" },
    { id:"tracking", label:"기타 (TRACKING)", icon:"🔎", color:"#d97706" },
    { id:"customs", label:"관세 (법령)", icon:"🏛", color:"#6d28d9" },
    { id:"forex", label:"환율", icon:"💱", color:"#16a34a" },
    { id:"docs", label:"기타 (서류 등)", icon:"📋", color:"#ea580c" },
    { id:"news", label:"물류뉴스", icon:"📰", color:"#dc2626" },
  ],
  sites: [
    { id:1, name:"Claude", url:"https://claude.ai/login", category:"ai", icon:"🤖", color:"#7c3aed", desc:"Anthropic AI 어시스턴트" },
    { id:2, name:"ChatGPT", url:"https://chatgpt.com/", category:"ai", icon:"🤖", color:"#10A37F", desc:"OpenAI GPT-4o" },
    { id:3, name:"Gemini", url:"https://gemini.google.com/app?hl=ko", category:"ai", icon:"🤖", color:"#4285F4", desc:"Google Gemini" },
    { id:20, name:"Maersk", url:"https://www.maersk.com/tracking/", category:"carrier", icon:"🚢", color:"#42B0D5", desc:"머스크 화물 추적" },
    { id:21, name:"MSC", url:"https://www.msc.com/", category:"carrier", icon:"🚢", color:"#E3001B", desc:"Global Container Shipping" },
    { id:22, name:"CMA CGM", url:"https://www.cma-cgm.com/ebusiness/tracking", category:"carrier", icon:"🚢", color:"#E30613", desc:"CMA CGM 화물 추적" },
    { id:23, name:"Hapag-Lloyd", url:"https://www.hapag-lloyd.com/en/online-business/track/track-by-booking-solution.html", category:"carrier", icon:"🚢", color:"#E37222", desc:"하팍로이드 트래킹" },
    { id:24, name:"HMM", url:"https://www.hmm21.com/e-service/general/DashBoard.do", category:"carrier", icon:"🚢", color:"#003087", desc:"현대상선 대시보드" },
    { id:25, name:"ONE Line", url:"https://ecomm.one-line.com/one-ecom/manage-shipment/cargo-tracking", category:"carrier", icon:"🚢", color:"#E60083", desc:"Ocean Network Express" },
    { id:26, name:"OOCL", url:"https://www.oocl.com/eng/ourservices/eservices/cargotracking/Pages/cargotracking.aspx", category:"carrier", icon:"🚢", color:"#003087", desc:"OOCL 화물 추적" },
    { id:27, name:"COSCO", url:"https://elines.coscoshipping.com/ebusiness/cargoTracking", category:"carrier", icon:"🚢", color:"#CC0000", desc:"코스코 화물 추적" },
    { id:28, name:"Evergreen", url:"https://www.shipmentlink.com/kr/", category:"carrier", icon:"🚢", color:"#007B40", desc:"에버그린 ShipmentLink" },
    { id:29, name:"Yang Ming", url:"https://www.yangming.com/en", category:"carrier", icon:"🚢", color:"#005BAC", desc:"양밍 해운 (대만)" },
    { id:30, name:"ZIM", url:"https://www.zim.com/tools/track-a-shipment", category:"carrier", icon:"🚢", color:"#003087", desc:"ZIM 화물 추적" },
    { id:31, name:"eKMTC", url:"https://www.ekmtc.com/index.html#/main", category:"carrier", icon:"🚢", color:"#0066CC", desc:"고려해운 e-서비스" },
    { id:32, name:"CKLINE", url:"https://es.ckline.co.kr/?cmd=SCH", category:"carrier", icon:"🚢", color:"#0047AB", desc:"장금상선 스케줄 조회" },
    { id:33, name:"Sinokor", url:"https://ebiz.sinokor.co.kr/?lang=EN", category:"carrier", icon:"🚢", color:"#CC0000", desc:"흥아해운 e-Service" },
    { id:34, name:"Heung-A", url:"https://ebiz.heungaline.com/", category:"carrier", icon:"🚢", color:"#003087", desc:"흥아라인 e-Service" },
    { id:35, name:"SITC", url:"https://ebusiness.sitcline.com/#/home", category:"carrier", icon:"🚢", color:"#1565C0", desc:"SITC 운항 정보" },
    { id:36, name:"Vanguard", url:"https://www.vanguardlogistics.com/", category:"carrier", icon:"🚢", color:"#1B4F72", desc:"Vanguard Logistics" },
    { id:37, name:"myDSV", url:"https://mydsv.com/new/tracking/track-shipment", category:"carrier", icon:"🚢", color:"#E60000", desc:"DSV 화물 추적" },
    { id:38, name:"NAIGAI Trans", url:"https://www.ntl-naigai.co.jp/guest/sailingschedule/en/search.html", category:"carrier", icon:"🚢", color:"#003087", desc:"나이가이 LCL 스케줄" },
    { id:39, name:"WAN HAI", url:"https://th.wanhai.com/views/LocalMain.xhtml", category:"carrier", icon:"🚢", color:"#CC0000", desc:"완하이 라인 (대만)" },
    { id:40, name:"SM Line", url:"https://esvc.smlines.com/smline/CUP_HOM_3301.do", category:"carrier", icon:"🚢", color:"#1565C0", desc:"SM Line 화물 추적" },
    { id:41, name:"RCL (NGOW HOCK)", url:"https://eservice.rclgroup.com/CargoTracking/", category:"carrier", icon:"🚢", color:"#CC4400", desc:"Regional Container Lines" },
    { id:50, name:"Hutchison Busan", url:"https://custom.hktl.com/jsp/T01/sunsuk.jsp", category:"terminal", icon:"⚓", color:"#E87722", desc:"허치슨 부산 신항" },
    { id:51, name:"BPT", url:"https://info.bptc.co.kr/content/index.jsp", category:"terminal", icon:"⚓", color:"#1B5E9B", desc:"부산항터미널 정보조회" },
    { id:52, name:"BCT", url:"https://info.bct2-4.com/infoservice/index.html", category:"terminal", icon:"⚓", color:"#0369a1", desc:"BCT 정보서비스" },
    { id:53, name:"HPNT", url:"https://www.hpnt.co.kr/infoservice/main/mainPage.jsp", category:"terminal", icon:"⚓", color:"#003087", desc:"현대부산신항만 정보서비스" },
    { id:54, name:"PNIT", url:"https://www.pnitl.com/infoservice/main/mainPage.jsp", category:"terminal", icon:"⚓", color:"#00529B", desc:"부산신항국제터미널 정보서비스" },
    { id:55, name:"DGT", url:"https://info.dgtbusan.com/DGT/esvc", category:"terminal", icon:"⚓", color:"#CC6600", desc:"DGT 부산 정보조회" },
    { id:56, name:"HJNC", url:"https://www.hjnc.co.kr/esvc", category:"terminal", icon:"⚓", color:"#0066B3", desc:"한진부산컨테이너 정보조회" },
    { id:57, name:"BNCT", url:"https://info.bnctkorea.com/esvc", category:"terminal", icon:"⚓", color:"#1A3E6F", desc:"BNCT 정보조회서비스" },
    { id:58, name:"PNC", url:"https://svc.pncport.com/info/Main.do", category:"terminal", icon:"⚓", color:"#004EA2", desc:"PNC 정보조회서비스" },
    { id:59, name:"GWCT (광양)", url:"http://www.gwct.co.kr/sub/sub_B2", category:"terminal", icon:"⚓", color:"#006400", desc:"광양항서부컨테이너터미널" },
    { id:60, name:"Hutchison 광양", url:"https://info.kitl.com/jsp/T01/sunsuk.jsp?mainType=T01&subType=01", category:"terminal", icon:"⚓", color:"#E87722", desc:"허치슨 광양 정보조회" },
    { id:61, name:"SSIT (Terminal49)", url:"https://terminal49.com/terminals/vnsst-sp-ssa-international-terminal-ssit", category:"terminal", icon:"⚓", color:"#6C63FF", desc:"SP-SSA International Terminal" },
    { id:62, name:"Terminal49", url:"https://terminal49.com/terminals", category:"terminal", icon:"⚓", color:"#6C63FF", desc:"전세계 터미널 디렉토리" },
    { id:63, name:"트레드링스", url:"https://www.tradlinx.com/ko/container-terminal-schedule", category:"terminal", icon:"⚓", color:"#2563eb", desc:"실시간 컨테이너 터미널 스케줄" },
    { id:70, name:"VesselFinder", url:"https://www.vesselfinder.com/", category:"tracking", icon:"🛳", color:"#1565C0", desc:"선박 실시간 위치 추적" },
    { id:71, name:"MarineTraffic", url:"https://www.marinetraffic.com/en/ais/home/centerx:-12.0/centery:25.0/zoom:4", category:"tracking", icon:"🌍", color:"#0077CC", desc:"AIS 해상 교통 정보" },
    { id:72, name:"DHL", url:"https://www.dhl.com/kr-ko/home.html", category:"tracking", icon:"🔎", color:"#FFCC00", desc:"DHL 글로벌 물류·배송" },
    { id:73, name:"FedEx", url:"https://www.fedex.com/ko-kr/home.html", category:"tracking", icon:"🔎", color:"#4D148C", desc:"FedEx 특송 서비스" },
    { id:80, name:"포워더케이알", url:"https://www.forwarder.kr/", category:"news", icon:"📰", color:"#1565C0", desc:"포워딩 업계 전문 뉴스" },
    { id:81, name:"코리아포워더타임즈", url:"http://www.parcelherald.com/korean/index.php", category:"news", icon:"📰", color:"#CC0000", desc:"코리아포워더타임즈" },
    { id:82, name:"한국관세물류협회", url:"https://www.kcla.kr/web/inc/html/4-1.asp", category:"news", icon:"📰", color:"#003087", desc:"KCLA 관세물류 협회" },
    { id:83, name:"코리아쉬핑가제트", url:"https://www.ksg.co.kr/", category:"news", icon:"📰", color:"#C0392B", desc:"국내 대표 해운 전문지" },
    { id:84, name:"카고뉴스", url:"https://www.cargonews.co.kr/", category:"news", icon:"📰", color:"#1A252F", desc:"CargoNews 물류 뉴스" },
    { id:85, name:"무역협회 KITA", url:"https://www.kita.net/", category:"news", icon:"📰", color:"#003087", desc:"한국무역협회 KITA" },
    { id:90, name:"UNI-PASS", url:"https://unipass.customs.go.kr/csp/index.do", category:"customs", icon:"🏛", color:"#1d4ed8", desc:"국가관세종합정보시스템" },
    { id:91, name:"관세법령정보포털", url:"https://unipass.customs.go.kr/clip/index.do", category:"customs", icon:"🏛", color:"#374151", desc:"CLIP 관세법령 검색" },
    { id:92, name:"화학물질정보처리", url:"https://kreach.me.go.kr/repwrt/index.do", category:"customs", icon:"🏛", color:"#15803d", desc:"화학물질정보처리시스템" },
    { id:100, name:"서울외국환중개", url:"http://www.smbs.biz/", category:"forex", icon:"💱", color:"#1d4ed8", desc:"SMBS 외국환중개 환율" },
    { id:101, name:"하나은행 환율", url:"https://www.kebhana.com/cont/mall/mall15/mall1502/index.jsp", category:"forex", icon:"💱", color:"#00A650", desc:"하나은행 평균환율" },
    { id:102, name:"네이버 환율", url:"https://finance.naver.com/marketindex/", category:"forex", icon:"💱", color:"#03C75A", desc:"네이버 마켓인덱스 환율" },
    { id:103, name:"XE.com", url:"https://www.xe.com", category:"forex", icon:"💱", color:"#1565C0", desc:"글로벌 환율 계산기" },
    { id:10, name:"Dow Inc.", url:"https://www.dow.com/en-us", category:"dow", icon:"📌", color:"#cc0000", desc:"Materials Science for a Better Future" },
    { id:1779862381116, name:"한국수입협회", url:"https://www.koimaindex.com/koimaindex/koima/item/index/retrieveList.do", category:"dow", icon:"📊", color:"#6366f1", desc:"국제원자재가격정보" },
    { id:1779862607304, name:"Polyethylene", url:"https://ko.tradingeconomics.com/commodity/polyethylene", category:"dow", icon:"📊", color:"#6366f1", desc:"폴리에틸렌 지수" },
    { id:1779862632564, name:"Polypropylene ", url:"https://ko.tradingeconomics.com/commodity/polypropylene", category:"dow", icon:"📊", color:"#6366f1", desc:"폴리프로필렌 지수" },
    { id:11, name:"CEPEA Ethanol", url:"https://www.cepea.org.br/en/indicator/ethanol.aspx", category:"dow", icon:"📊", color:"#1e7a1e", desc:"에탄올 가격 지수 (브라질)" },
    { id:110, name:"대한상공회의소", url:"https://cert.korcham.net/base/index.htm", category:"docs", icon:"📋", color:"#C0392B", desc:"원산지증명서 발급" },
    { id:111, name:"uTradeHub", url:"https://www.utradehub.or.kr/porgw/index.jsp?sso=ok", category:"docs", icon:"📋", color:"#117A65", desc:"전자무역 서류 발급" },
    { id:112, name:"WEHAGO", url:"https://www.wehago.com/", category:"docs", icon:"🏢", color:"#0066CC", desc:"더존 비즈니스 플랫폼" },
    { id:113, name:"Ecount ERP", url:"https://loginac.ecount.com/ec5/view/erp?w_flag=1&ec_req_sid=AC-ESSRNzGCNoXKt#", category:"docs", icon:"🏢", color:"#FF6600", desc:"이카운트 ERP (디카본)" },
    { id:114, name:"NICE BizLINE", url:"https://www.nicebizline.com/workspace/HO000", category:"docs", icon:"📋", color:"#003087", desc:"기업 신용정보 조회" },
    { id:116, name:"오피스플러스", url:"https://www.officeplus.com/index_main_opa.jsp?site_code=OPA", category:"docs", icon:"📋", color:"#FF4500", desc:"기업 구매 비용절감 플랫폼" },
    { id:117, name:"PolarisOffice", url:"https://www.polarisofficetools.com/", category:"docs", icon:"📄", color:"#0078D4", desc:"온라인 문서 편집 도구" },
    { id:118, name:"Smallpdf", url:"https://smallpdf.com/kr#r=app", category:"docs", icon:"📄", color:"#E74C3C", desc:"PDF 변환·편집 도구" },
    { id:75, name:"CBM Calculator", url:"https://www.cbmcalculator.com/", category:"docs", icon:"📐", color:"#E67E22", desc:"CBM Calculator" },
    { id:119, name:"이미지 압축", url:"https://www.iloveimg.com/ko/compress-image", category:"docs", icon:"🖼️", color:"#E91E63", desc:"이미지 압축 (iLoveIMG)" },
    { id:4, name:"DeepL", url:"https://www.deepl.com/ko/translator", category:"docs", icon:"🌐", color:"#003366", desc:"세계 최고 정확도 번역기" },
    { id:6, name:"Google 번역", url:"https://translate.google.co.kr/?sl=auto&tl=ko&op=translate", category:"docs", icon:"🌐", color:"#EA4335", desc:"구글 번역" },
  ],
};

const move = (arr, i, dir) => {
  const a = [...arr]; const j = i + dir;
  if (j < 0 || j >= a.length) return a;
  [a[i], a[j]] = [a[j], a[i]]; return a;
};

const inp = {
  width:"100%", boxSizing:"border-box", background:"#fff",
  border:"1.5px solid #e2e8f0", borderRadius:9, padding:"8px 12px",
  color:"#1e293b", fontSize:13, marginBottom:10, outline:"none", fontFamily:"inherit",
};
const lbl = {
  display:"block", fontSize:10, fontWeight:700, color:"#94a3b8",
  letterSpacing:".8px", textTransform:"uppercase", marginBottom:4,
};
const iconPickerStyle = (active) => ({
  width:34, height:34, borderRadius:8,
  border:`1.5px solid ${active ? "#6366f1" : "#e2e8f0"}`,
  background: active ? "#eef2ff" : "#f8fafc",
  fontSize:17, cursor:"pointer", transition:"all .15s",
});
const actionBtn = {
  width:26, height:26, borderRadius:6, border:"1.5px solid #e2e8f0",
  background:"#fff", fontSize:12, cursor:"pointer",
  display:"flex", alignItems:"center", justifyContent:"center", padding:0,
  boxShadow:"0 1px 3px rgba(0,0,0,.06)",
};

function SiteModal({ site, categories, onClose, onSave }) {
  const [form, setForm] = useState(site || { name:"", url:"", category:categories[0]?.id||"", icon:"🔗", desc:"", color:"#6366f1" });
  const set = (k,v) => setForm(p=>({...p,[k]:v}));
  return (
    <Overlay onClose={onClose}>
      <ModalBox>
        <ModalTitle>{site ? "사이트 편집" : "사이트 추가"}</ModalTitle>
        <label style={lbl}>아이콘</label>
        <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:12}}>
          {ICON_LIST.map(ic=><button key={ic} onClick={()=>set("icon",ic)} style={iconPickerStyle(form.icon===ic)}>{ic}</button>)}
        </div>
        <label style={lbl}>이름</label>
        <input value={form.name} onChange={e=>set("name",e.target.value)} style={inp} placeholder="사이트 이름"/>
        <label style={lbl}>URL</label>
        <input value={form.url} onChange={e=>set("url",e.target.value)} style={inp} placeholder="https://..."/>
        <label style={lbl}>설명</label>
        <input value={form.desc} onChange={e=>set("desc",e.target.value)} style={inp} placeholder="한 줄 설명"/>
        <label style={lbl}>강조 색상</label>
        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:12,flexWrap:"wrap"}}>
          {ACCENT_COLORS.map(c=>(
            <div key={c} onClick={()=>set("color",c)}
              style={{width:26,height:26,borderRadius:"50%",background:c,cursor:"pointer",
                boxShadow:form.color===c?`0 0 0 2px #fff,0 0 0 4px ${c}`:"0 1px 3px rgba(0,0,0,.15)",
                transition:"box-shadow .15s"}}/>
          ))}
        </div>
        <label style={lbl}>카테고리</label>
        <select value={form.category} onChange={e=>set("category",e.target.value)} style={{...inp,cursor:"pointer",background:"#fff"}}>
          {categories.map(c=><option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
        </select>
        <BtnRow>
          <Btn ghost onClick={onClose}>취소</Btn>
          <Btn onClick={()=>{ if(!form.name||!form.url) return; const url=form.url.startsWith("http")?form.url:"https://"+form.url; onSave({...form,url}); }}>저장</Btn>
        </BtnRow>
      </ModalBox>
    </Overlay>
  );
}

function SettingsPanel({ data, onClose, onChange }) {
  const [tab, setTab] = useState("cat");
  const [editCatId, setEditCatId] = useState(null);
  const [editCatForm, setEditCatForm] = useState(null);
  const [addingCat, setAddingCat] = useState(false);
  const [newCatForm, setNewCatForm] = useState({ label:"", icon:"📁", color:"#6366f1" });
  const [filterCat, setFilterCat] = useState(data.categories[0]?.id||"");
  const [siteEditTarget, setSiteEditTarget] = useState(null);
  const [jsonMode, setJsonMode] = useState(null);
  const [importText, setImportText] = useState("");
  const [copied, setCopied] = useState(false);

  const startAddCat = () => {
    setAddingCat(true);
    setNewCatForm({ label:"", icon:"📁", color:"#6366f1" });
  };
  const saveNewCat = () => {
    if (!newCatForm.label.trim()) { alert("카테고리 이름을 입력하세요."); return; }
    const newCat = {
      id: "cat_" + Date.now(),
      label: newCatForm.label.trim(),
      icon: newCatForm.icon,
      color: newCatForm.color,
    };
    onChange({...data, categories:[...data.categories, newCat]});
    setAddingCat(false);
  };
  const startEditCat = (cat) => { setEditCatId(cat.id); setEditCatForm({...cat}); };
  const saveCat = (applyToSites = false) => {
    let newSites = data.sites;
    if (applyToSites) {
      newSites = data.sites.map(s =>
        s.category === editCatId ? {...s, color: editCatForm.color} : s
      );
    }
    onChange({
      ...data,
      categories: data.categories.map(c=>c.id===editCatId?editCatForm:c),
      sites: newSites,
    });
    setEditCatId(null);
  };
  const moveCat = (i,dir) => onChange({...data, categories:move(data.categories,i,dir)});
  const deleteCat = (id) => {
    if(!window.confirm("카테고리를 삭제하면 해당 사이트도 모두 삭제됩니다. 계속할까요?")) return;
    onChange({categories:data.categories.filter(c=>c.id!==id), sites:data.sites.filter(s=>s.category!==id)});
  };

  const catSites = data.sites.filter(s=>s.category===filterCat);
  const moveSite = (i,dir) => {
    const others = data.sites.filter(s=>s.category!==filterCat);
    onChange({...data, sites:[...others, ...move(catSites,i,dir)]});
  };
  const deleteSite = (id) => onChange({...data, sites:data.sites.filter(s=>s.id!==id)});
  const saveSiteEdit = (form) => { onChange({...data, sites:data.sites.map(s=>s.id===form.id?form:s)}); setSiteEditTarget(null); };

  const tabStyle = (t) => ({
    flex:1, padding:"9px 0", border:"none", borderRadius:8, cursor:"pointer",
    fontFamily:"inherit", fontSize:13, fontWeight:700, transition:"all .15s",
    background: tab===t ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "transparent",
    color: tab===t ? "#fff" : "#94a3b8",
  });
  return (
    <Overlay onClose={onClose}>
      <ModalBox wide>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
          <ModalTitle style={{marginBottom:0}}>⚙️ 관리자 설정</ModalTitle>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <button onClick={async () => {
              if (!window.confirm("모든 변경사항을 초기화하고 기본 데이터로 되돌릴까요?")) return;
              onChange(DEFAULT_DATA);
              onClose();
            }} style={{fontSize:11,padding:"4px 10px",borderRadius:7,
              border:"1px solid #fecaca",background:"#fff1f2",color:"#dc2626",
              cursor:"pointer",fontWeight:600,fontFamily:"inherit",whiteSpace:"nowrap"}}>
              🔄 초기화
            </button>
            <button onClick={() => { setJsonMode("export"); setCopied(false); }}
            style={{fontSize:11,padding:"4px 10px",borderRadius:7,
            border:"1px solid #bfdbfe",background:"#eff6ff",color:"#2563eb",
            cursor:"pointer",fontWeight:600,fontFamily:"inherit",whiteSpace:"nowrap"}}>
            📋 내보내기
          </button>
          <button onClick={() => { setJsonMode("import"); setImportText(""); }}
            style={{fontSize:11,padding:"4px 10px",borderRadius:7,
            border:"1px solid #bbf7d0",background:"#f0fdf4",color:"#16a34a",
            cursor:"pointer",fontWeight:600,fontFamily:"inherit",whiteSpace:"nowrap"}}>
            📥 가져오기
          </button>
          <button onClick={onClose} style={{...actionBtn,width:30,height:30,fontSize:16,color:"#94a3b8"}}>✕</button>
          </div>
        </div>
        <div style={{display:"flex",gap:6,background:"#f1f5f9",borderRadius:10,padding:4,marginBottom:20}}>
          <button style={tabStyle("cat")} onClick={()=>setTab("cat")}>🗂 카테고리 관리</button>
          <button style={tabStyle("site")} onClick={()=>setTab("site")}>🔗 사이트 순서 변경</button>
        </div>

        {tab==="cat" && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{fontSize:12,color:"#94a3b8"}}>↕ 순서 &nbsp;|&nbsp; 🎨 색상 일괄 적용 &nbsp;|&nbsp; ✏️ 수정 &nbsp;|&nbsp; 🗑 삭제</div>
              <button onClick={startAddCat} disabled={addingCat} style={{
                fontSize:12,padding:"5px 12px",borderRadius:8,border:"none",
                background:addingCat?"#cbd5e1":"linear-gradient(135deg,#6366f1,#8b5cf6)",
                color:"#fff",cursor:addingCat?"default":"pointer",
                fontWeight:700,fontFamily:"inherit",whiteSpace:"nowrap",
                boxShadow:addingCat?"none":"0 2px 8px rgba(99,102,241,.3)"}}>
                ＋ 카테고리 추가
              </button>
            </div>

            {/* 카테고리 추가 폼 */}
            {addingCat && (
              <div style={{background:"#f0f4ff",border:"1.5px solid #6366f1",borderRadius:11,padding:"14px",marginBottom:10}}>
                <label style={lbl}>새 카테고리 이름</label>
                <input value={newCatForm.label}
                  onChange={e=>setNewCatForm(p=>({...p,label:e.target.value}))}
                  style={inp} placeholder="예: 즐겨찾기" autoFocus/>
                <label style={lbl}>아이콘</label>
                <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:10}}>
                  {ICON_LIST.map(ic=><button key={ic} onClick={()=>setNewCatForm(p=>({...p,icon:ic}))} style={iconPickerStyle(newCatForm.icon===ic)}>{ic}</button>)}
                </div>
                <label style={lbl}>강조 색상</label>
                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4,flexWrap:"wrap"}}>
                  {ACCENT_COLORS.map(c=>(
                    <div key={c} onClick={()=>setNewCatForm(p=>({...p,color:c}))}
                      style={{width:26,height:26,borderRadius:"50%",background:c,cursor:"pointer",
                        boxShadow:newCatForm.color===c?`0 0 0 2px #fff,0 0 0 4px ${c}`:"0 1px 3px rgba(0,0,0,.15)",
                        transition:"box-shadow .15s"}}/>
                  ))}
                </div>
                <BtnRow>
                  <Btn ghost onClick={()=>setAddingCat(false)}>취소</Btn>
                  <Btn onClick={saveNewCat}>추가</Btn>
                </BtnRow>
              </div>
            )}

            <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:420,overflowY:"auto"}}>
              {data.categories.map((cat,i)=>(
                <div key={cat.id}>
                  {editCatId===cat.id ? (
                    <div style={{background:"#f0f4ff",border:"1.5px solid #6366f1",borderRadius:11,padding:"14px"}}>
                      <label style={lbl}>카테고리 이름</label>
                      <input value={editCatForm.label} onChange={e=>setEditCatForm(p=>({...p,label:e.target.value}))} style={inp} placeholder="카테고리 이름"/>
                      <label style={lbl}>아이콘</label>
                      <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:10}}>
                        {ICON_LIST.map(ic=><button key={ic} onClick={()=>setEditCatForm(p=>({...p,icon:ic}))} style={iconPickerStyle(editCatForm.icon===ic)}>{ic}</button>)}
                      </div>
                      <label style={lbl}>강조 색상</label>
                      <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10,flexWrap:"wrap"}}>
                        {ACCENT_COLORS.map(c=>(
                          <div key={c} onClick={()=>setEditCatForm(p=>({...p,color:c}))}
                            style={{width:26,height:26,borderRadius:"50%",background:c,cursor:"pointer",
                              boxShadow:editCatForm.color===c?`0 0 0 2px #fff,0 0 0 4px ${c}`:"0 1px 3px rgba(0,0,0,.15)",
                              transition:"box-shadow .15s"}}/>
                        ))}
                      </div>
                      <div style={{fontSize:11,color:"#64748b",background:"#f8fafc",
                        border:"1px solid #e2e8f0",borderRadius:8,padding:"8px 10px",marginBottom:10,lineHeight:1.5}}>
                        💡 <strong>일괄 변경</strong>을 누르면 이 카테고리의 모든 사이트 강조 색상도<br/>
                        선택한 색상으로 동일하게 변경됩니다.
                      </div>
                      <div style={{display:"flex",gap:8,marginTop:4}}>
                        <Btn ghost onClick={()=>setEditCatId(null)}>취소</Btn>
                        <Btn ghost onClick={()=>saveCat(false)}>저장</Btn>
                        <button onClick={()=>{
                          const count = data.sites.filter(s=>s.category===editCatId).length;
                          if(!window.confirm(`이 카테고리의 ${count}개 사이트 색상을 모두 변경할까요?`)) return;
                          saveCat(true);
                        }} style={{
                          flex:2, padding:"9px 0", borderRadius:10, border:"none",
                          background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
                          color:"#fff", cursor:"pointer", fontSize:13, fontWeight:700,
                          fontFamily:"inherit", boxShadow:"0 2px 8px rgba(99,102,241,.3)"}}>
                          🎨 일괄 변경
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{display:"flex",alignItems:"center",gap:10,background:"#f8fafc",
                      border:"1.5px solid #e2e8f0",borderRadius:10,padding:"10px 12px"}}>
                      <div style={{display:"flex",flexDirection:"column",gap:2}}>
                        <button onClick={()=>moveCat(i,-1)} disabled={i===0} style={{...actionBtn,opacity:i===0?.3:1,fontSize:10}}>▲</button>
                        <button onClick={()=>moveCat(i,1)} disabled={i===data.categories.length-1} style={{...actionBtn,opacity:i===data.categories.length-1?.3:1,fontSize:10}}>▼</button>
                      </div>
                      <div style={{width:36,height:36,borderRadius:9,background:`${cat.color}15`,border:`1.5px solid ${cat.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{cat.icon}</div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:700,fontSize:13.5,color:cat.color}}>{cat.label}</div>
                        <div style={{fontSize:11,color:"#94a3b8",marginTop:1}}>{data.sites.filter(s=>s.category===cat.id).length}개 사이트</div>
                      </div>
                      <button type="button"
                        onMouseDown={(e)=>{e.stopPropagation();}}
                        onClick={(e)=>{
                          e.preventDefault();
                          e.stopPropagation();
                          const count = data.sites.filter(s=>s.category===cat.id).length;
                          if(count===0){ alert("사이트 0개"); return; }
                          const newSites = data.sites.map(s =>
                            s.category === cat.id ? {...s, color: cat.color} : s
                          );
                          onChange({...data, sites: newSites});
                          alert("✅ " + count + "개 변경 완료! 색상: " + cat.color);
                        }}
                        title="색상 일괄 변경"
                        style={{background:"#eef2ff",color:"#6366f1",border:"1.5px solid #c7d2fe",
                          borderRadius:8,padding:"6px 12px",fontSize:13,fontWeight:600,cursor:"pointer",
                          fontFamily:"inherit",whiteSpace:"nowrap",
                          position:"relative",zIndex:10}}>
                        🎨 색상통일
                      </button>
                      <button onClick={()=>startEditCat(cat)} style={actionBtn}>✏️</button>
                      <button onClick={()=>deleteCat(cat.id)} style={{...actionBtn,background:"#fff1f2",borderColor:"#fecaca"}}>🗑</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==="site" && (
          <div>
            <label style={lbl}>카테고리 선택</label>
            <select value={filterCat} onChange={e=>setFilterCat(e.target.value)} style={{...inp,cursor:"pointer",background:"#fff",marginBottom:14}}>
              {data.categories.map(c=><option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
            </select>
            <div style={{fontSize:12,color:"#94a3b8",marginBottom:10}}>↕ 순서 변경 &nbsp;|&nbsp; ✏️ 편집 &nbsp;|&nbsp; 🗑 삭제</div>
            <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:360,overflowY:"auto"}}>
              {catSites.length===0 && <div style={{textAlign:"center",padding:"40px 0",color:"#cbd5e1",fontSize:13}}>이 카테고리에 사이트가 없습니다</div>}
              {catSites.map((site,i)=>(
                <div key={site.id} style={{display:"flex",alignItems:"center",gap:10,background:"#f8fafc",border:"1.5px solid #e2e8f0",borderRadius:10,padding:"9px 12px"}}>
                  <div style={{display:"flex",flexDirection:"column",gap:2}}>
                    <button onClick={()=>moveSite(i,-1)} disabled={i===0} style={{...actionBtn,opacity:i===0?.3:1,fontSize:10}}>▲</button>
                    <button onClick={()=>moveSite(i,1)} disabled={i===catSites.length-1} style={{...actionBtn,opacity:i===catSites.length-1?.3:1,fontSize:10}}>▼</button>
                  </div>
                  <div style={{width:32,height:32,borderRadius:8,background:`${site.color}15`,border:`1.5px solid ${site.color}35`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{site.icon}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,fontSize:13,color:"#1e293b",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{site.name}</div>
                    <div style={{fontSize:11,color:"#94a3b8",marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{site.desc}</div>
                  </div>
                  <button onClick={()=>setSiteEditTarget(site)} style={actionBtn}>✏️</button>
                  <button onClick={()=>deleteSite(site.id)} style={{...actionBtn,background:"#fff1f2",borderColor:"#fecaca"}}>🗑</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </ModalBox>
      {siteEditTarget && <SiteModal site={siteEditTarget} categories={data.categories} onClose={()=>setSiteEditTarget(null)} onSave={saveSiteEdit}/>}

      {jsonMode==="export" && (
        <Overlay onClose={()=>setJsonMode(null)}>
          <ModalBox>
            <ModalTitle>📋 데이터 내보내기</ModalTitle>
            <div style={{fontSize:12.5,color:"#64748b",marginBottom:12,lineHeight:1.6}}>
              아래 텍스트를 복사해 채팅에 붙여넣으면 코드에 영구 반영해 드립니다.<br/>
              (텍스트 박스를 클릭하면 자동 전체선택)
            </div>
            <textarea readOnly value={JSON.stringify(data)}
              onFocus={e=>e.target.select()}
              style={{width:"100%",boxSizing:"border-box",height:200,background:"#f8fafc",
                border:"1.5px solid #e2e8f0",borderRadius:9,padding:"10px 12px",
                color:"#1e293b",fontSize:11,fontFamily:"monospace",resize:"vertical",outline:"none"}}/>
            <BtnRow>
              <Btn ghost onClick={()=>setJsonMode(null)}>닫기</Btn>
              <Btn onClick={()=>{
                try {
                  const ta = document.createElement("textarea");
                  ta.value = JSON.stringify(data);
                  document.body.appendChild(ta); ta.select();
                  document.execCommand("copy");
                  document.body.removeChild(ta);
                  setCopied(true); setTimeout(()=>setCopied(false),1500);
                } catch { alert("복사가 차단되었습니다. 텍스트를 직접 선택해 복사해주세요."); }
              }}>{copied ? "✅ 복사됨!" : "복사하기"}</Btn>
            </BtnRow>
          </ModalBox>
        </Overlay>
      )}

      {jsonMode==="import" && (
        <Overlay onClose={()=>setJsonMode(null)}>
          <ModalBox>
            <ModalTitle>📥 데이터 가져오기</ModalTitle>
            <div style={{fontSize:12.5,color:"#64748b",marginBottom:12,lineHeight:1.6}}>
              내보내기 했던 JSON 텍스트를 붙여넣고 불러오기를 누르세요.
            </div>
            <textarea value={importText} onChange={e=>setImportText(e.target.value)}
              placeholder='{"categories":[...],"sites":[...]}'
              style={{width:"100%",boxSizing:"border-box",height:200,background:"#f8fafc",
                border:"1.5px solid #e2e8f0",borderRadius:9,padding:"10px 12px",
                color:"#1e293b",fontSize:11,fontFamily:"monospace",resize:"vertical",outline:"none"}}/>
            <BtnRow>
              <Btn ghost onClick={()=>setJsonMode(null)}>취소</Btn>
              <Btn onClick={()=>{
                try {
                  const parsed = JSON.parse(importText.trim());
                  if(parsed && parsed.categories && parsed.sites){
                    onChange(parsed); setJsonMode(null); alert("데이터를 불러왔습니다!");
                  } else { alert("올바른 형식이 아닙니다."); }
                } catch { alert("JSON 형식이 올바르지 않습니다."); }
              }}>불러오기</Btn>
            </BtnRow>
          </ModalBox>
        </Overlay>
      )}
    </Overlay>
  );
}

function Overlay({ children, onClose }) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.35)",backdropFilter:"blur(6px)",
      display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center"}}>{children}</div>
    </div>
  );
}
function ModalBox({ children, wide }) {
  return (
    <div style={{background:"#fff",border:"1.5px solid #e2e8f0",borderRadius:18,padding:26,
      width:wide?520:440,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 20px 60px rgba(15,23,42,.18)"}}>
      {children}
    </div>
  );
}
function ModalTitle({ children, style }) {
  return <div style={{fontSize:17,fontWeight:700,color:"#1e293b",marginBottom:18,fontFamily:"inherit",...style}}>{children}</div>;
}
function BtnRow({ children }) { return <div style={{display:"flex",gap:10,marginTop:18}}>{children}</div>; }
function Btn({ children, onClick, ghost }) {
  return (
    <button onClick={onClick} style={{
      flex:ghost?1:2, padding:"9px 0", borderRadius:10,
      border:ghost?"1.5px solid #e2e8f0":"none",
      background:ghost?"#f8fafc":"linear-gradient(135deg,#6366f1,#8b5cf6)",
      color:ghost?"#64748b":"#fff", cursor:"pointer",
      fontSize:13, fontWeight:700, fontFamily:"inherit",
    }}>{children}</button>
  );
}

export default function App() {
  const [data,      setData]      = useState(DEFAULT_DATA);
  const [activeCat, setActiveCat] = useState("all");
  const [editingTitle, setEditingTitle] = useState(false);
  const [query,     setQuery]     = useState("");
  const [siteModal, setSiteModal] = useState(null);
  const [settings,  setSettings]  = useState(false);
  const [hovId,     setHovId]     = useState(null);
  const [delTarget, setDelTarget] = useState(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle");
  // 저장 직후 자기 저장 데이터가 다시 돌아오는 echo 방지용 ref
  const lastSavedDataRef = useRef(null);

  // ── 앱 시작 시 Supabase에서 자동 불러오기
  useEffect(() => {
    (async () => {
      try {
        const { data: row, error } = await supabase
          .from("bookmarks")
          .select("data")
          .eq("id", "main")
          .single();
        if (!error && row && row.data) {
          if (row.data.categories && row.data.sites) {
            lastSavedDataRef.current = JSON.stringify(row.data);
            setData(row.data);
          }
        }
      } catch (e) {
        console.error("불러오기 실패", e);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  // ── 페이지 복귀 시 서버 최신 데이터 받아오기
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible" && isLoaded) {
        try {
          const { data: row, error } = await supabase
            .from("bookmarks")
            .select("data")
            .eq("id", "main")
            .single();
          if (!error && row && row.data && row.data.categories && row.data.sites) {
            const remoteStr = JSON.stringify(row.data);
            // 마지막 저장 데이터와 다르면 서버 데이터로 갱신
            if (remoteStr !== lastSavedDataRef.current) {
              console.log("[복귀 동기화] 서버 데이터로 갱신");
              lastSavedDataRef.current = remoteStr;
              setData(row.data);
            }
          }
        } catch (e) {
          console.error("재동기화 실패", e);
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleVisibilityChange);
    };
  }, [isLoaded]);

  // ── 데이터 변경 시 Supabase에 자동 저장 (echo 방지)
  useEffect(() => {
    if (!isLoaded) return;

    const currentDataStr = JSON.stringify(data);

    // 마지막으로 저장/수신한 데이터와 동일하면 저장 스킵 (무한 루프 방지)
    if (currentDataStr === lastSavedDataRef.current) {
      return;
    }

    setSaveStatus("saving");
    const timer = setTimeout(async () => {
      try {
        const { error } = await supabase
          .from("bookmarks")
          .upsert({ id: "main", data: data, updated_at: new Date().toISOString() });
        if (error) throw error;
        lastSavedDataRef.current = currentDataStr; // 저장 완료 기록
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 1500);
      } catch (e) {
        console.error("저장 실패", e);
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    }, 500); // 0.5초 디바운스
    return () => clearTimeout(timer);
  }, [data, isLoaded]);

  // ── Supabase Realtime - 다른 사용자의 변경사항 즉시 동기화 (echo 방지)
  useEffect(() => {
    if (!isLoaded) return;
    const channel = supabase
      .channel("bookmarks-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks", filter: "id=eq.main" },
        (payload) => {
          if (payload.new && payload.new.data && payload.new.data.categories && payload.new.data.sites) {
            const remoteStr = JSON.stringify(payload.new.data);
            // 내가 방금 저장한 데이터가 다시 돌아온 거면 무시 (echo 방지)
            if (remoteStr === lastSavedDataRef.current) {
              return;
            }
            // 다른 사용자가 변경한 데이터 → 받아오기
            console.log("[실시간 동기화] 다른 사용자의 변경 받음");
            lastSavedDataRef.current = remoteStr;
            setData(payload.new.data);
          }
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [isLoaded]);

  const filtered = useMemo(()=>data.sites.filter(s=>{
    const matchCat = activeCat==="all"||s.category===activeCat;
    const matchQ   = !query||s.name.toLowerCase().includes(query.toLowerCase())||s.desc.toLowerCase().includes(query.toLowerCase());
    return matchCat&&matchQ;
  }),[data.sites,activeCat,query]);

  const groups = data.categories
    .filter(c=>(activeCat==="all"||activeCat===c.id))
    .map(c=>({cat:c, sites:filtered.filter(s=>s.category===c.id)}))
    .filter(g=>g.sites.length>0);

  const catCount = id => id==="all"?data.sites.length:data.sites.filter(s=>s.category===id).length;

  const handleSiteSave = form => {
    if(!form.name||!form.url) return;
    const url = form.url.startsWith("http")?form.url:"https://"+form.url;
    if(siteModal==="add") setData(p=>({...p,sites:[...p.sites,{...form,url,id:Date.now()}]}));
    else setData(p=>({...p,sites:p.sites.map(s=>s.id===form.id?{...form,url}:s)}));
    setSiteModal(null);
  };

  return (
    <div style={{minHeight:"100vh",background:"#f1f5f9",fontFamily:"'Noto Sans KR','DM Sans',sans-serif",color:"#1e293b"}}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&family=DM+Sans:wght@400;600;700&display=swap" rel="stylesheet"/>

      {/* HEADER */}
      <div style={{borderBottom:"1.5px solid #e2e8f0",background:"#fff",position:"sticky",top:0,zIndex:50,
        padding:"0 24px",display:"flex",alignItems:"center",gap:16,height:58,
        boxShadow:"0 1px 8px rgba(15,23,42,.07)"}}>
        <div style={{display:"flex",alignItems:"center",gap:9,whiteSpace:"nowrap"}}>
          <div style={{width:32,height:32,borderRadius:9,
            background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,
            boxShadow:"0 2px 8px rgba(99,102,241,.35)"}}>🏢</div>
          {/* v32 - 일괄변경 디버그 */}
          {editingTitle ? (
            <input autoFocus value={data.title || ""}
              onChange={e=>setData(p=>({...p,title:e.target.value}))}
              onBlur={()=>setEditingTitle(false)}
              onKeyDown={e=>{if(e.key==="Enter"||e.key==="Escape")setEditingTitle(false);}}
              placeholder="제목 입력..."
              style={{fontWeight:800,fontSize:17,color:"#6366f1",
                border:"1.5px solid #6366f1",borderRadius:7,padding:"3px 9px",
                outline:"none",fontFamily:"inherit",minWidth:200,background:"#fff"}}/>
          ) : (
            <span onClick={()=>setEditingTitle(true)} title="클릭하여 제목 편집"
              style={{fontWeight:800,fontSize:17,cursor:"pointer",
                background:"linear-gradient(90deg,#6366f1,#8b5cf6)",
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
                letterSpacing:"-0.3px",padding:"3px 6px",borderRadius:7,
                transition:"opacity .15s"}}
              onMouseEnter={e=>e.currentTarget.style.opacity="0.7"}
              onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
              {data.title || "CSR 바로가기"}
            </span>
          )}
        </div>

        <div style={{flex:1,maxWidth:400,position:"relative"}}>
          <span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",fontSize:14,color:"#cbd5e1"}}>🔍</span>
          <input value={query} onChange={e=>setQuery(e.target.value)}
            placeholder="사이트 검색... (선사, 환율, 터미널)"
            style={{width:"100%",boxSizing:"border-box",background:"#f8fafc",
              border:"1.5px solid #e2e8f0",borderRadius:10,padding:"7px 12px 7px 33px",
              color:"#1e293b",fontSize:13,outline:"none",fontFamily:"inherit",transition:"border .2s"}}
            onFocus={e=>e.target.style.borderColor="#6366f1"}
            onBlur={e=>e.target.style.borderColor="#e2e8f0"}/>
        </div>

        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{fontSize:12,color:"#94a3b8",whiteSpace:"nowrap"}}>
            총 <strong style={{color:"#6366f1"}}>{data.sites.length}</strong>개
          </div>
          {(() => {
            const styles = {
              saving:    { bg:"#fffbeb", border:"#fcd34d", color:"#d97706", text:"💾 저장 중..." },
              saved:     { bg:"#ecfdf5", border:"#6ee7b7", color:"#10b981", text:"✅ 저장됨" },
              idle:      { bg:"#ecfdf5", border:"#6ee7b7", color:"#10b981", text:"🔄 자동 동기화" },
              error:     { bg:"#fef2f2", border:"#fca5a5", color:"#dc2626", text:"❌ 저장 실패" },
              connecting: { bg:"#fffbeb", border:"#fcd34d", color:"#d97706", text:"⏳ 연결 중..." },
            };
            const s = styles[saveStatus] || styles.idle;
            return (
              <div title="실시간 동기화 - 변경사항이 즉시 모든 사용자에게 반영됩니다"
                style={{fontSize:11,color:s.color,background:s.bg,
                  border:`1px solid ${s.border}`,borderRadius:20,padding:"2px 9px",
                  fontWeight:600,whiteSpace:"nowrap",transition:"all .2s",cursor:"help"}}>
                {s.text}
              </div>
            );
          })()}
        </div>
        <div style={{flex:1}}/>

        <button onClick={()=>setSettings(true)} style={{
          display:"flex",alignItems:"center",gap:6,background:"#f8fafc",
          border:"1.5px solid #e2e8f0",borderRadius:10,padding:"7px 14px",color:"#64748b",
          fontSize:13,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit",transition:"all .15s"}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="#6366f1";e.currentTarget.style.color="#6366f1"}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="#e2e8f0";e.currentTarget.style.color="#64748b"}}>
          ⚙️ 관리
        </button>

        <button onClick={()=>setSiteModal("add")} style={{
          display:"flex",alignItems:"center",gap:6,
          background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
          border:"none",borderRadius:10,padding:"7px 16px",color:"#fff",
          fontSize:13,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",
          boxShadow:"0 3px 12px rgba(99,102,241,.35)",fontFamily:"inherit"}}>
          + 추가
        </button>
      </div>

      <div style={{display:"flex",minHeight:"calc(100vh - 58px)"}}>
        {/* SIDEBAR */}
        <div style={{width:196,borderRight:"1.5px solid #e2e8f0",padding:"16px 10px",
          flexShrink:0,background:"#fff",overflowY:"auto"}}>
          <div style={{fontSize:10,fontWeight:700,color:"#cbd5e1",letterSpacing:"1.2px",
            textTransform:"uppercase",padding:"0 8px",marginBottom:8}}>카테고리</div>
          {[{id:"all",label:"전체",icon:"⊞",color:"#6366f1"}, ...data.categories].map(cat=>{
            const active = activeCat===cat.id;
            return (
              <button key={cat.id} onClick={()=>setActiveCat(cat.id)} style={{
                width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",
                padding:"8px 10px",borderRadius:9,border:"none",
                background:active?`${cat.color}12`:"transparent",
                color:active?cat.color:"#64748b",cursor:"pointer",marginBottom:2,
                transition:"all .15s",fontFamily:"inherit",fontSize:12.5,fontWeight:active?700:500,
                borderLeft:active?`2.5px solid ${cat.color}`:"2.5px solid transparent"}}
                onMouseEnter={e=>{if(!active)e.currentTarget.style.background="#f8fafc"}}
                onMouseLeave={e=>{if(!active)e.currentTarget.style.background="transparent"}}>
                <span style={{display:"flex",alignItems:"center",gap:7}}>
                  <span style={{fontSize:14}}>{cat.icon}</span>
                  <span>{cat.label}</span>
                </span>
                <span style={{fontSize:10,background:active?`${cat.color}18`:"#f1f5f9",
                  color:active?cat.color:"#94a3b8",padding:"1px 7px",borderRadius:20,fontWeight:700}}>
                  {catCount(cat.id)}
                </span>
              </button>
            );
          })}
        </div>

        {/* MAIN GRID */}
        <div style={{flex:1,padding:"22px 26px",overflowY:"auto"}}>
          {query && (
            <div style={{fontSize:13,color:"#94a3b8",marginBottom:16}}>
              "<strong style={{color:"#6366f1"}}>{query}</strong>" — {filtered.length}개 결과
            </div>
          )}

          {filtered.length===0 ? (
            <div style={{textAlign:"center",paddingTop:80,color:"#cbd5e1"}}>
              <div style={{fontSize:44,marginBottom:10}}>🔍</div>
              <div>검색 결과가 없습니다</div>
            </div>
          ) : (
            groups.map(({cat,sites})=>(
              <div key={cat.id} style={{marginBottom:28}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                  <div style={{width:28,height:28,borderRadius:8,background:`${cat.color}15`,
                    border:`1.5px solid ${cat.color}35`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>
                    {cat.icon}
                  </div>
                  <span style={{fontWeight:800,fontSize:14.5,color:cat.color}}>{cat.label}</span>
                  <div style={{height:1.5,flex:1,background:`linear-gradient(90deg,${cat.color}30,transparent)`,marginLeft:4,borderRadius:2}}/>
                  <span style={{fontSize:11,color:"#94a3b8",fontWeight:600,
                    background:"#f1f5f9",padding:"2px 8px",borderRadius:20,border:"1px solid #e2e8f0"}}>
                    {sites.length}개
                  </span>
                </div>

                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:9}}>
                  {sites.map(site=>{
                    const hov = hovId===site.id;
                    return (
                      <a key={site.id}
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{position:"relative",background:"#fff",
                          border:`1.5px solid ${hov?site.color+"80":"#e2e8f0"}`,
                          borderRadius:12,padding:"13px 12px 10px",cursor:"pointer",transition:"all .17s",
                          boxShadow:hov?`0 6px 20px ${site.color}20,0 2px 8px rgba(0,0,0,.08)`:"0 1px 3px rgba(0,0,0,.04)",
                          transform:hov?"translateY(-2px)":"none",
                          display:"block",textDecoration:"none",color:"inherit"}}
                        onMouseEnter={()=>setHovId(site.id)}
                        onMouseLeave={()=>setHovId(null)}>

                        {hov && (
                          <div style={{position:"absolute",top:8,right:8,display:"flex",gap:3}}
                            onClick={e=>{e.stopPropagation();e.preventDefault();}}>
                            <button onClick={(e)=>{e.preventDefault();setSiteModal(site);}} style={actionBtn} title="편집">✏️</button>
                            <button onClick={(e)=>{e.preventDefault();setDelTarget(site);}} style={{...actionBtn,background:"#fff1f2",borderColor:"#fecaca"}} title="삭제">🗑</button>
                          </div>
                        )}

                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
                          <div style={{width:34,height:34,borderRadius:8,flexShrink:0,
                            background:`${site.color}12`,border:`1.5px solid ${site.color}28`,
                            display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>
                            {site.icon}
                          </div>
                          <div style={{minWidth:0}}>
                            <div style={{fontWeight:700,fontSize:13,color:"#1e293b",
                              whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{site.name}</div>
                            <div style={{fontSize:10,color:"#94a3b8",marginTop:1,
                              whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                              {site.url.replace(/^https?:\/\//,"").split("/")[0]}
                            </div>
                          </div>
                        </div>
                        <div style={{fontSize:11.5,color:"#64748b",lineHeight:1.5}}>{site.desc}</div>
                      </a>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {(siteModal==="add"||(siteModal&&siteModal.id)) && (
        <SiteModal site={siteModal==="add"?null:siteModal} categories={data.categories}
          onClose={()=>setSiteModal(null)} onSave={handleSiteSave}/>
      )}
      {settings && <SettingsPanel data={data} onClose={()=>setSettings(false)} onChange={setData}/>}
      {delTarget && (
        <Overlay onClose={()=>setDelTarget(null)}>
          <ModalBox>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:40,marginBottom:10}}>🗑</div>
              <div style={{fontWeight:700,fontSize:15,color:"#1e293b",marginBottom:6}}>{delTarget.name} 삭제</div>
              <div style={{fontSize:13,color:"#94a3b8",marginBottom:20}}>이 바로가기를 삭제할까요?</div>
              <BtnRow>
                <Btn ghost onClick={()=>setDelTarget(null)}>취소</Btn>
                <Btn onClick={()=>{setData(p=>({...p,sites:p.sites.filter(s=>s.id!==delTarget.id)}));setDelTarget(null);}}>삭제</Btn>
              </BtnRow>
            </div>
          </ModalBox>
        </Overlay>
      )}
    </div>
  );
}
