import { Fragment, useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import { Link } from "react-router-dom";
import Lenis from "lenis";
import { useUser } from "@/pages/UserContext";
import { counters } from "@/data/mockData";
import { FUNDED_VENTURES } from "@/data/ventures";
import { startupPrograms, type StartupProgram } from "@/data/startupPrograms";
import { getIdeaNavigationSlug } from "@/utils/slugUtils";
import { isReadableTitle } from "@/utils/readableTitle";
import { Arrow, Magnetic, SiteFooter, SiteNav } from "@/components/site/SiteChrome";
import { onMeasure, pageMetrics, progressOf, useSectionFrame } from "./frame";
import { loadNetworkData, type NetItem } from "./network/data";
import "./landing.css";
import "./network/network.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:6220";

// Stock placeholders until the club's own photos arrive. Sized to the device (a phone was
// downloading 2200px, q92 originals: ~3 MB for the page) and served as AVIF/WebP by auto=format.
const deviceWidth = typeof window === "undefined" ? 1800 : Math.ceil((window.innerWidth * Math.min(window.devicePixelRatio || 1, 2)) / 200) * 200;
const unsplash = (id: string, max: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${Math.min(max, deviceWidth)}&q=80`;

// Real photos replace the stock ones slot by slot: a file named after a slot in
// src/assets/photos (e.g. hero.jpg) is used instead. That folder's README is the shot list.
const LOCAL_PHOTOS = import.meta.glob("../assets/photos/*.{jpg,jpeg,png,webp,avif}", { eager: true, query: "?url", import: "default" }) as Record<string, string>;
const localPhoto = (slot: string) =>
  Object.entries(LOCAL_PHOTOS).find(([path]) => path.split("/").pop()!.replace(/\.\w+$/, "") === slot)?.[1];
const photo = (slot: string, stockId: string, max: number) => localPhoto(slot) ?? unsplash(stockId, max);

const IMG = {
  hero: photo("hero", "photo-1556761175-b413da4baf72", 2200),
  people: photo("people", "photo-1523240795612-9a054b0db644", 1800),
  pitch: photo("pitch", "photo-1551836022-d5d88e9218df", 1800),
  research: photo("research", "photo-1531482615713-2afd69097998", 1800),
  prototype: photo("prototype", "photo-1581092921461-eab62e97a780", 1800),
  founders: photo("founders", "photo-1556761175-5973dc0f32e7", 1800),
  room: photo("room", "photo-1517245386807-bb43f82c33c4", 1800),
  campus: photo("campus", "photo-1562774053-701939374585", 1800),
  energy: photo("atlast", "photo-1473341304170-971dccb5ac1e", 1600),
  health: photo("salcit", "photo-1576091160399-112ba8d25d1d", 1600),
  iot: photo("alltronics", "photo-1518770660439-4636190af475", 1600),
};

const STAGES = [
  ["01", "Problem Discovery", "Start with friction.", "Find real-world problems worth solving. Define the pain before you define the product.", IMG.people],
  ["02", "Idea & Concept", "Make a hypothesis.", "Turn the observation into a clear concept, customer, and set of assumptions.", IMG.pitch],
  ["03", "Research & Feasibility", "Pressure-test it.", "Find evidence in the market, technology, constraints, and alternatives.", IMG.research],
  ["04", "User Validation", "Let reality answer.", "Talk to users. Challenge your assumptions. Learn what actually matters.", IMG.room],
  ["05", "Prototype Development", "Make it tangible.", "Build the smallest useful thing and put it into someone's hands.", IMG.prototype],
  ["06", "MVP & Launch", "Ship to learn.", "Launch a focused product and establish a feedback loop that compounds.", IMG.founders],
  ["07", "Growth & Scaling", "Make traction compound.", "Refine the venture, grow the network, and build a system around the signal.", IMG.campus],
] as const;

const HUBS = [
  ["ProblemHub", "DISCOVER", "The problem is the first customer.", IMG.people, "/problems"],
  ["IdeaHub", "CREATE", "Turn a real observation into something testable.", IMG.pitch, "/ideas"],
  ["StartupHub", "SCALE", "Take evidence, make it traction, and keep going.", IMG.founders, "/startups"],
] as const;

const VENTURES = FUNDED_VENTURES.map((v, i) => [String(i + 1).padStart(2, "0"), v.sector, v.name, v.description, IMG[v.photo]] as const);

function Reveal({ children, className="" }: { children: ReactNode; className?: string }) { return <div data-reveal className={className}>{children}</div>; }

function Cursor() {
  const blob=useRef<HTMLDivElement>(null), ring=useRef<HTMLDivElement>(null);
  const target=useRef({x:0,y:0}), current=useRef({x:0,y:0});
  useEffect(()=>{
    if(!window.matchMedia("(hover:hover) and (pointer:fine)").matches)return;
    target.current={x:window.innerWidth/2,y:window.innerHeight/2};current.current={...target.current};
    let raf=0;
    const root=document.querySelector<HTMLElement>(".vj-landing")??document.documentElement;
    const move=(e:PointerEvent)=>{
      target.current.x=e.clientX;target.current.y=e.clientY;
      const interactive=Boolean((e.target as HTMLElement|null)?.closest("a,button"));
      root.style.setProperty("--cursor-active",interactive?"1":"0");
      if(!raf)raf=requestAnimationFrame(loop);
    };
    const loop=()=>{current.current.x+=(target.current.x-current.current.x)*.12;current.current.y+=(target.current.y-current.current.y)*.12;if(blob.current)blob.current.style.transform=`translate3d(${current.current.x}px,${current.current.y}px,0) translate(-50%,-50%)`;if(ring.current)ring.current.style.transform=`translate3d(${target.current.x}px,${target.current.y}px,0) translate(-50%,-50%)`;const settled=Math.abs(target.current.x-current.current.x)<.1&&Math.abs(target.current.y-current.current.y)<.1;raf=settled?0:requestAnimationFrame(loop);};
    window.addEventListener("pointermove",move,{passive:true});raf=requestAnimationFrame(loop);
    return()=>{window.removeEventListener("pointermove",move);cancelAnimationFrame(raf)};
  },[]);
  return <><div ref={blob} className="cursor-blob"><span>VIEW</span></div><div ref={ring} className="cursor-ring"/></>;
}

function SmoothScroll() {
  useEffect(()=>{
    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
    // Phones keep native scrolling: JS-driven touch scroll janks on mid-range devices, and
    // Lenis's setup restyles the whole page (~0.5s on a throttled phone). Anchors still glide.
    if(window.matchMedia("(hover: none), (pointer: coarse)").matches){
      const glide=(e:MouseEvent)=>{
        const anchor=(e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
        const id=anchor?.getAttribute("href");
        const target=id&&id!=="#"?document.querySelector<HTMLElement>(id):null;
        if(!target)return;
        e.preventDefault();
        window.scrollTo({top:target.getBoundingClientRect().top+window.scrollY-72,behavior:"smooth"});
        history.replaceState(null,"",id);
      };
      document.addEventListener("click",glide);
      return()=>document.removeEventListener("click",glide);
    }
    // Lenis measures the page on creation and on every resize; creating it during load cost
    // ~350ms of forced layout while images and fonts were still arriving. Start it once the
    // page is idle, or on the first scroll input, whichever comes first.
    let lenis:Lenis|null=null,raf=0;
    const frame=(time:number)=>{lenis?.raf(time);raf=requestAnimationFrame(frame)};
    const start=()=>{
      if(lenis)return lenis;
      lenis=new Lenis({duration:1.15, smoothWheel:true, syncTouch:true, wheelMultiplier:.9, touchMultiplier:1});
      raf=requestAnimationFrame(frame);
      return lenis;
    };
    const idle=window.requestIdleCallback?window.requestIdleCallback(start,{timeout:2500}):window.setTimeout(start,1500);
    const early=()=>{start()};
    window.addEventListener("wheel",early,{once:true,passive:true});
    window.addEventListener("touchstart",early,{once:true,passive:true});
    const click=(e:MouseEvent)=>{
      const anchor=(e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if(!anchor)return;
      const id=anchor.getAttribute("href");
      if(!id||id==="#")return;
      const target=document.querySelector<HTMLElement>(id);
      if(!target)return;
      e.preventDefault();start().scrollTo(target,{offset:-72,duration:1.2});
      history.replaceState(null,"",id);
    };
    document.addEventListener("click",click);
    return()=>{
      document.removeEventListener("click",click);
      window.removeEventListener("wheel",early);
      window.removeEventListener("touchstart",early);
      if(window.cancelIdleCallback)window.cancelIdleCallback(idle);else window.clearTimeout(idle);
      cancelAnimationFrame(raf);lenis?.destroy();
    };
  },[]);
  return null;
}

const INTRO_KEY="vj-intro-seen";

function Intro() {
  const [skip]=useState(()=>{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return true;try{return sessionStorage.getItem(INTRO_KEY)==="1";}catch{return false;}});
  const [done,setDone]=useState(false);
  const [p,setP]=useState(0);

  useEffect(()=>{
    if(skip)return;
    try{sessionStorage.setItem(INTRO_KEY,"1");}catch{/* private mode: intro just replays */}
    const duration=1680;
    const start=performance.now();
    let raf=0;

    const loop=(now:number)=>{
      const value=Math.min((now-start)/duration,1);
      setP(Math.round(value*100));

      if(value<1){
        raf=requestAnimationFrame(loop);
      }else{
        window.setTimeout(()=>setDone(true),220);
      }
    };

    raf=requestAnimationFrame(loop);
    return()=>cancelAnimationFrame(raf);
  },[]);

  const phase=p<34?0:p<67?1:2;
  const phases=[
    ["01","QUESTION","FIND THE FRICTION"],
    ["02","BUILD","MAKE IT TANGIBLE"],
    ["03","IMPACT","LET IT TRAVEL"],
  ] as const;

  const current=phases[phase];

  if(skip)return null;
  return (
    <div className={`intro-v16 ${done?"exit":""}`} aria-hidden="true" data-phase={phase}>
      <div className="intro-v16-grid"/>
      <div className="intro-v16-noise"/>
      <div className="intro-v16-orbit intro-orbit-a"/>
      <div className="intro-v16-orbit intro-orbit-b"/>
      <div className="intro-v16-orbit intro-orbit-c"/>

      <div className="intro-v16-ghost intro-ghost-main">{current[1]}</div>
      <div className="intro-v16-ghost intro-ghost-secondary">{phase===0?"BUILD":phase===1?"IMPACT":"QUESTION"}</div>

      <div className="intro-v16-top">
        <span>VJ STARTUPS / HYDERABAD</span>
        <span>VNRVJIET / STUDENT FOUNDERS</span>
      </div>

      <div className="intro-v16-side intro-side-left">
        <span>01 / QUESTION</span>
        <span>02 / BUILD</span>
        <span>03 / IMPACT</span>
      </div>

      <div className="intro-v16-side intro-side-right">
        <span>PROBLEM</span>
        <span>EVIDENCE</span>
        <span>MOMENTUM</span>
      </div>

      <div className="intro-v16-center">
        <div className="intro-v16-signal">
          <i/><i/><i/><i/><i/>
        </div>
        <div className="intro-v16-brand">
          <span>VJ</span>
          <b>STARTUPS</b>
        </div>
        <div className="intro-v16-current">
          <span>{current[0]}</span>
          <strong>{current[1]}</strong>
          <small>{current[2]}</small>
        </div>
        <div className="intro-v16-word">{current[1]}</div>
      </div>

      <div className="intro-v16-meter">
        <div className="intro-v16-meter-top">
          <span>BUILDING THE NEXT THING</span>
          <span>{String(p).padStart(3,"0")}</span>
        </div>
        <div className="intro-v16-bar"><span style={{width:`${p}%`}}/></div>
        <div className="intro-v16-ticks">
          <i className={phase===0?"active":""}/>
          <i className={phase===1?"active":""}/>
          <i className={phase===2?"active":""}/>
        </div>
      </div>

      <div className="intro-v16-footer">
        <span>VJ / STARTUPS / 2026</span>
        <span>TURNING QUESTIONS INTO VENTURES</span>
        <span>{current[0]} / 03</span>
      </div>

      {/* Moved with `translate` (the overlay is viewport-sized, so vw/vh match the old %):
          animating left/top registered as a layout shift every frame. */}
      <div className="intro-v16-pulse" style={{translate:`${12+p*.72}vw ${24+Math.sin(p*.08)*11}vh`}}/>
      <div className="intro-v16-pulse pink" style={{translate:`${76-p*.33}vw ${70-Math.sin(p*.05)*13}vh`}}/>
    </div>
  );
}
function mixHex(a:string,b:string,t:number){
  const pa=[1,3,5].map(i=>parseInt(a.slice(i,i+2),16));
  const pb=[1,3,5].map(i=>parseInt(b.slice(i,i+2),16));
  const r=pa.map((v,i)=>Math.round(v+(pb[i]-v)*t));
  return `rgb(${r[0]},${r[1]},${r[2]})`;
}
const ease=(t:number)=>t*t*(3-2*t);
const band=(p:number,a:number,b:number)=>ease(Math.min(Math.max((p-a)/(b-a),0),1));

type Announcement={title:string;content:string};

function useLatestAnnouncement(){
  const [news,setNews]=useState<Announcement|null>(null);
  useEffect(()=>{
    let live=true;
    fetch(`${API_BASE}/announcements-api/`)
      .then(r=>r.json())
      .then(d=>{if(live&&d?.success&&d.announcements?.length)setNews(d.announcements[0]);})
      .catch(()=>{});
    return()=>{live=false;};
  },[]);
  return news;
}

function Hero() {
  const { user }=useUser();
  const news=useLatestAnnouncement();
  const outer=useRef<HTMLElement>(null);
  const sticky=useRef<HTMLDivElement>(null);
  const reveal=useRef<HTMLDivElement>(null);
  const blobWrap=useRef<HTMLDivElement>(null);
  const blob=useRef<HTMLDivElement>(null);
  const blobImg=useRef<HTMLImageElement>(null);
  const cover=useRef<HTMLDivElement>(null);
  const ribbon=useRef<HTMLDivElement>(null);

  const pointer=useRef({rx:0,ry:0,tx:0,ty:0});

  useEffect(()=>{
    const el=sticky.current;
    if(!el)return;
    const move=(e:PointerEvent)=>{
      const r=el.getBoundingClientRect();
      pointer.current.tx=((e.clientX-r.left)/r.width-.5)*18;
      pointer.current.ty=((e.clientY-r.top)/r.height-.5)*12;
      if(reveal.current){
        reveal.current.style.setProperty("--cx",`${e.clientX}px`);
        reveal.current.style.setProperty("--cy",`${e.clientY}px`);
      }
    };
    el.addEventListener("pointermove",move,{passive:true});
    return()=>el.removeEventListener("pointermove",move);
  },[]);

  // How far the lens must grow to cover the screen: its size now follows the space the headline
  // leaves (phones), so a fixed 3.6x could stop short and leave a band.
  const grow=useRef(2.6);
  useEffect(()=>{
    const off=onMeasure(()=>{
      const el=blobWrap.current;
      if(el&&el.offsetWidth&&el.offsetHeight)grow.current=Math.max(2.6,Math.max(window.innerWidth/el.offsetWidth,window.innerHeight/el.offsetHeight)*1.08-1);
    });
    return()=>{off()};
  },[]);

  useSectionFrame(outer,frame=>{
      const now=frame.now;
      const p=progressOf(frame);
      const q=pointer.current;
      q.rx+=(q.tx-q.rx)*.08;
      q.ry+=(q.ty-q.ry)*.08;
      sticky.current?.style.setProperty("--hx",`${q.rx}px`);
      sticky.current?.style.setProperty("--hy",`${q.ry}px`);

      const textOut=band(p,.16,.38);
      const blobT=band(p,.30,.82);
      const bgT=band(p,.32,.88);
      // Phones and portrait tablets: the photo stays under the numbers and both leave with the
      // scroll, so the pin never releases onto an empty black screen.
      const tall=window.innerWidth/window.innerHeight<1.4;
      const ribbonIn=band(p,.55,.70);
      const ribbonOut=tall?0:band(p,.84,.97);
      const ribbonOpacity=Math.max(0,ribbonIn-ribbonOut);

      // Lets the overlay header switch to dark ink while the hero is still white.
      const light=bgT<.5?"1":"0";
      const root=outer.current?.closest<HTMLElement>(".vj-landing");
      if(root&&root.dataset.heroLight!==light)root.dataset.heroLight=light;
      if(sticky.current){
        sticky.current.style.setProperty("--fade",String(1-textOut));
        sticky.current.style.setProperty("--fadeY",`${-textOut*46}px`);
        sticky.current.style.background=mixHex("#ffffff","#080808",bgT);
        sticky.current.style.setProperty("--tail",String(band(p,.5,.8)));
      }
      if(blobWrap.current){
        blobWrap.current.style.transform=`translate(-50%,-52%) scale(${1+blobT*grow.current})`;
      }
      if(blob.current){
        const wobble=Math.sin(now*.0007)*3*(1-blobT);
        const r=Math.max(0,43-blobT*40+wobble);
        blob.current.style.borderRadius=`${r}%`;
      }
      if(blobImg.current){
        blobImg.current.style.filter=`saturate(${(.52*(1-blobT)).toFixed(3)}) contrast(1.04) brightness(${(1-blobT*(tall?.45:.82)).toFixed(3)})`;
      }
      if(cover.current){
        cover.current.style.opacity=String(tall?blobT*.5:Math.min(1,blobT*1.1));
      }
      if(ribbon.current){
        ribbon.current.style.opacity=String(ribbonOpacity);
        ribbon.current.style.transform=`translate3d(0,${(1-ribbonIn)*16}px,0)`;
      }
  });

  return (
    <section className="opening" data-tone="ink" ref={outer} id="top">
      <div className="hero-v12 opening-sticky" ref={sticky}>
      <div className="hero-v12-top">
        <span>VJ STARTUPS / HYDERABAD</span>
        {news
          ? <span className="hero-news" title={`${news.title} — ${news.content}`}><b>NEWS</b>{news.title}</span>
          : <span>REAL PROBLEMS / REAL BUILDERS / REAL VENTURES</span>}
      </div>

      <div className="hero-v12-orbits" aria-hidden="true">
        <span className="hero-orbit-v12 orbit-one"/>
        <span className="hero-orbit-v12 orbit-two"/>
        <span className="hero-orbit-v12 orbit-three"/>
      </div>

      <div className="hero-v12-ghost ghost-one" aria-hidden="true">QUESTION</div>
      <div className="hero-v12-ghost ghost-two" aria-hidden="true">IMPACT</div>

      <div className="hero-v12-stage-wrap" ref={blobWrap}>
        <div className="hero-v12-stage opening-blob" ref={blob} aria-hidden="true">
          <img src={IMG.hero} alt="" ref={blobImg} {...{fetchpriority:"high"}}/>
          <div className="opening-cover" ref={cover}/>
          
          <div className="hero-v12-stage-caption">A POSSIBILITY BECOMING A THING</div>
        </div>
      </div>

      <div className="hero-v12-reveal" ref={reveal} aria-hidden="true">
        <div>
          <span>THE ANSWER</span>
          <b>IS IN THE WORK.</b>
        </div>
      </div>

      <div className="hero-v12-copy">
        <span className="hero-v12-kicker">THE STARTUP QUESTION</span>
        <h1>
          <span className="hero-v12-line hero-v12-what">WHAT</span>
          <span className="hero-v12-line hero-v12-if"><i>IF YOU</i></span>
          <span className="hero-v12-line hero-v12-didnt">DIDN&apos;T</span>
          <span className="hero-v12-line hero-v12-need">NEED AN IDEA?</span>
        </h1>
      </div>

      <div className="hero-v12-intro">
        <p>Start with what is broken.<br/>Follow the evidence.<br/>Build until reality says yes.</p>
        <Magnetic href="/problems"><span>Explore problems</span><Arrow/></Magnetic>
        <Magnetic href="/ideas" variant="ghost"><span>View solutions</span></Magnetic>
      </div>

      

      <div className="hero-v12-bottom">
        <span>A STUDENT STARTUP COMMUNITY AT VNRVJIET</span>
        <span>PROBLEMS → IDEAS → STARTUPS</span>
      </div>

      <div className="opening-ribbon" ref={ribbon} aria-hidden="true">
        <span>{counters.startups}</span><small>STARTUPS</small>
        <span>{counters.students}</span><small>FUTURE BUILDERS</small>
        <span>{counters.funded}</span><small>FUNDED</small>
        <span>15</span><small>RESEARCH PARTNERS</small>
      </div>
      </div>
    </section>
  );
}
function Morph() {
  const ref=useRef<HTMLElement>(null), words=useRef<Array<HTMLDivElement|null>>([]);
  useSectionFrame(ref,frame=>{
      const p=progressOf(frame);
      words.current.forEach((node,i)=>{
        if(!node)return;
        const phase=i/4;
        const local=Math.min(1,Math.max(0,1-Math.abs(p-phase)*7.5));
        const distance=p-phase;
        const y=distance*44;
        node.style.setProperty("--local",String(local));
        node.style.setProperty("--blur",`${(1-local)*22}px`);
        node.style.transform=`translate3d(-50%,calc(-50% + ${y}vh),0) scale(${.82+local*.18})`;
      });
  });
  const wordsList=["PROBLEM","EVIDENCE","BUILD","IMPACT"];
  return <section className="morph-v13 light" data-tone="paper" ref={ref}>
    <div className="morph-v13-sticky">
      <div className="morph-v13-top"><span>01 / HOW A VENTURE FORMS</span><span>AN IDEA HAS NO SHAPE.</span></div>
      <div className="morph-v13-intro"><span className="chapter-label dark">FROM A THOUGHT</span><h2>MAKE IT<br/><i>REAL.</i></h2></div>
      <div className="morph-v13-stage">
        <div className="morph-v13-ripple r1"/><div className="morph-v13-ripple r2"/><div className="morph-v13-ripple r3"/>
        {wordsList.map((word,i)=><div className="morph-v13-word" key={word} ref={n=>{words.current[i]=n}}><span className="morph-v13-liquid">{word}</span><span className="morph-v13-clean">{word}</span></div>)}
      </div>
      <div className="morph-v13-bottom"><span>THE PROBLEM COMES FIRST. THE IDEA FOLLOWS.</span></div>
    </div>
  </section>;
}
function Starting() {
  const [active,setActive]=useState(0);
  const items=[
    ["I HAVE A PROBLEM","Good. Stay here a little longer.","ProblemHub is where friction becomes a defined problem worth solving.","Open ProblemHub","/problems"],
    ["I HAVE AN IDEA","Now make it uncomfortable.","IdeaHub helps you test the assumptions hidden inside the idea.","Validate your idea","/idea-validation"],
    ["I HAVE A PROTOTYPE","Put it in the world.","Use the journey to validate the product, collect evidence, and iterate.","Enter the journey","/journey"],
    ["I HAVE TRACTION","Make it repeatable.","StartupHub is where evidence becomes systems, networks, and growth.","Explore StartupHub","/startups"],
  ];
  return <section className="starting light" data-tone="paper" id="start"><Reveal className="starting-head"><span className="chapter-label dark">02 / ORIENTATION</span><h2>WHERE ARE<br/><i>YOU NOW?</i></h2><p>Don't follow a template. Start from the truth of what you already have.</p></Reveal><div className="starting-panel" data-reveal><div className="starting-tabs">{items.map(([label],i)=><button key={label} className={i===active?"active":""} onClick={()=>setActive(i)}><small>0{i+1}</small>{label}</button>)}</div><div className="starting-response"><span className="response-no">0{active+1}</span><span className="kicker dark">YOUR NEXT MOVE</span><h3>{items[active][1]}</h3><p>{items[active][2]}</p><Magnetic href={items[active][4]}><span>{items[active][3]}</span><Arrow/></Magnetic></div></div></section>;
}

function Journey() {
  const ref=useRef<HTMLElement>(null),[index,setIndex]=useState(0),[dir,setDir]=useState(1);
  const fills=useRef<Array<HTMLSpanElement|null>>([]),percentRef=useRef<HTMLSpanElement>(null),last=useRef(0);
  useSectionFrame(ref,frame=>{
    const p=progressOf(frame);
    const exact=p*STAGES.length;
    const i=Math.min(STAGES.length-1,Math.floor(exact));
    const local=Math.min(Math.max(exact-i,0),1);
    if(i!==last.current){setDir(i>last.current?1:-1);last.current=i;setIndex(i);}
    // Continuous progress, written directly (no re-render per frame).
    ref.current?.style.setProperty("--lp",local.toFixed(3));
    fills.current.forEach((fill,k)=>{if(fill)fill.style.transform=`scaleX(${k<i?1:k>i?0:local})`;});
    if(percentRef.current)percentRef.current.textContent=`${Math.round(p*100)}%`;
  });
  const go=(i:number)=>{const el=ref.current;if(!el)return;const top=el.getBoundingClientRect().top+window.scrollY;const travel=el.offsetHeight-window.innerHeight;window.scrollTo({top:top+travel*((i+.5)/STAGES.length),behavior:"smooth"})};
  const s=STAGES[index];
  return <section className="journey" data-tone="ink" id="journey" ref={ref} style={{"--dir":dir} as CSSProperties}>
    <div className="journey-sticky">
      <div className="journey-top"><span>03 / THE JOURNEY</span><span>07 STAGES</span></div>
      <div className="journey-copy">
        <div className="journey-count" aria-hidden="true"><span style={{transform:`translate3d(0,${(-index/STAGES.length)*100}%,0)`}}>{STAGES.map(x=><b key={x[0]}>{x[0]}</b>)}</span></div>
        <div className="journey-stage" key={index}>
          <span className="stage-kicker">{s[1]}</span>
          <h2 aria-label={s[2]}>{s[2].split(" ").map((word,k)=><Fragment key={k}>{word.split(/(?<=-)/).map((part,j)=><span key={j} className="jw" aria-hidden="true"><span style={{"--k":k} as CSSProperties}>{part}</span></span>)}{" "}</Fragment>)}</h2>
          <p>{s[3]}</p>
          <Link to="/journey">Open your journey <Arrow/></Link>
        </div>
      </div>
      <div className="journey-image">
        {STAGES.map((x,i)=><img key={x[0]} src={x[4]} alt="" className={i<index?"is-past":i===index?"active":""} loading="lazy" decoding="async"/>)}
        <div className="journey-shade"/>
        <div className="journey-image-meta"><span>VIRTUAL STARTUP JOURNEY / {s[0]}</span><span ref={percentRef}>0%</span></div>
      </div>
      <div className="journey-steps" role="tablist" aria-label="Journey stages">
        {STAGES.map((x,i)=><button key={x[0]} role="tab" aria-selected={i===index} className={i===index?"active":i<index?"done":""} onClick={()=>go(i)}>
          <span className="journey-step-label"><b>{x[0]}</b><em>{x[1]}</em></span>
          <span className="journey-step-track"><span ref={n=>{fills.current[i]=n}}/></span>
        </button>)}
      </div>
    </div>
  </section>;
}

function Sphere() {
  const ref=useRef<HTMLElement>(null), cards=useRef<Array<HTMLDivElement|null>>([]), bg=useRef<HTMLDivElement>(null);
  const motion=useRef({cur:0,targetX:0,targetY:0,px:0,py:0});
  useEffect(()=>{
    const move=(e:PointerEvent)=>{
      const el=ref.current;if(!el)return;
      const r=el.getBoundingClientRect();
      motion.current.targetX=((e.clientX-r.left)/r.width-.5)*14;
      motion.current.targetY=((e.clientY-r.top)/r.height-.5)*10;
    };
    window.addEventListener("pointermove",move,{passive:true});
    return()=>window.removeEventListener("pointermove",move);
  },[]);
  useSectionFrame(ref,frame=>{
      const m=motion.current;
      const scrollTarget=progressOf(frame);
      m.cur+=(scrollTarget-m.cur)*.075;
      m.px+=(m.targetX-m.px)*.055; m.py+=(m.targetY-m.py)*.055;
      const {cur,px,py}=m;

      cards.current.forEach((c,i)=>{
        if(!c)return;
        const a=cur*Math.PI*2+(i*Math.PI*2)/3;
        const front=Math.cos(a);
        const side=Math.sin(a);
        const x=side*27;
        const y=front*7;
        const depth=(front+1)*95;
        const scale=.72+(front+1)*.15;
        const opacity=.30+(front+1)*.35;
        const lift=(1-front)*2;
        c.style.transform=`translate3d(calc(-50% + ${x+px}px),calc(-50% + ${y+py+lift}px),${depth}px) rotateY(${side*13}deg) rotateZ(${side*7}deg) scale(${scale})`;
        c.style.opacity=String(opacity);
        c.style.zIndex=String(Math.round((front+1)*100));
      });

      if(bg.current){
        bg.current.style.transform=`translate(-50%,-50%) rotate(${cur*410}deg) scale(${1+.035*Math.sin(cur*Math.PI*2)})`;
        bg.current.style.setProperty("--bx",`${px*.6}px`);
        bg.current.style.setProperty("--by",`${py*.6}px`);
      }
  });
  return <section className="sphere" data-tone="ink" ref={ref}>
    <div className="sphere-sticky">
      <div className="sphere-top"><span>04 / THREE LENSES</span><span>ASKED OF EVERY VENTURE</span></div>
      <div className="sphere-background" ref={bg}>
        <svg viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <radialGradient id="orbitGlow"><stop offset="0%" stopColor="#d7ff63" stopOpacity=".18"/><stop offset="50%" stopColor="#d7ff63" stopOpacity=".05"/><stop offset="100%" stopColor="#d7ff63" stopOpacity="0"/></radialGradient>
            <filter id="orbitBlur"><feGaussianBlur stdDeviation="8"/></filter>
          </defs>
          <ellipse className="orbit-halo" cx="500" cy="350" rx="360" ry="210" fill="url(#orbitGlow)"/>
          <path className="swirl blur" d="M90 370 C 150 110, 460 30, 900 210 C 680 155, 410 105, 245 350 C 110 545, 455 690, 900 485 C 620 620, 300 575, 120 335"/>
          <path className="swirl" d="M90 370 C 150 110, 460 30, 900 210 C 680 155, 410 105, 245 350 C 110 545, 455 690, 900 485 C 620 620, 300 575, 120 335"/>
          <path className="swirl-secondary" d="M180 330 C 330 150, 650 150, 820 345 C 670 520, 340 535, 180 330"/>
          <path className="swirl-secondary" d="M235 345 C 360 220, 635 205, 765 345 C 625 470, 365 465, 235 345"/>
          <circle className="orbit-dot od-a" cx="188" cy="225" r="4"/>
          <circle className="orbit-dot od-b" cx="817" cy="349" r="5"/>
          <circle className="orbit-dot od-c" cx="350" cy="585" r="3"/>
          <circle className="orbit-dot od-d" cx="620" cy="98" r="3"/>
        </svg>
      </div>
      <div className="sphere-title"><span>THREE</span><i>LENSES</i><small>one venture / three questions</small></div>
      <div className="sphere-cards">
        {[["PROBLEM",IMG.people],["BUILD",IMG.prototype],["IMPACT",IMG.founders]].map(([title,img],i)=>
          <div key={title} className="sphere-card" ref={n=>{cards.current[i]=n}}>
            <img src={img as string} alt="" loading="lazy" decoding="async"/>
            <div className="sphere-overlay"/>
            <span className="sphere-card-no">0{i+1}</span>
            <div><small>{title}</small><b>{title==="PROBLEM"?"What deserves to exist?":title==="BUILD"?"What can we make real?":"What survives outside the room?"}</b></div>
          </div>
        )}
      </div>
      <div className="sphere-bottom"><span>PROBLEM → BUILD → IMPACT</span></div>
    </div>
  </section>;
}
function Hubs() {
  const [active,setActive]=useState(0);return <section className="hubs light" data-tone="paper"><Reveal className="hubs-head"><span className="chapter-label dark">05 / ENTRY POINTS</span><h2>THREE DOORS.<br/><i>ONE SYSTEM.</i></h2><p>Different starts. Same underlying journey from problem to proof.</p></Reveal><div className="hub-layout" data-reveal><div className="hub-list">{HUBS.map((h,i)=><button key={h[0]} className={i===active?"active":""} onMouseEnter={()=>setActive(i)} onClick={()=>setActive(i)}><span>0{i+1}</span><div><small>{h[1]}</small><b>{h[0]}</b></div><Arrow/></button>)}</div><div className="hub-view">{HUBS.map((h,i)=><img key={h[0]} src={h[3]} alt="" className={i===active?"active":""} loading="lazy" decoding="async"/>)}<div><span>{HUBS[active][1]}</span><h3>{HUBS[active][2]}</h3><Link className="hub-enter" to={HUBS[active][4]}>Enter {HUBS[active][0]} <Arrow/></Link></div></div></div></section>;
}

// The messy middle, shown with the platform's own work: problems students posted and ideas
// answering them, from the live API. The stock photos only stand in when there is no data.
const WORK_SLOTS=[["wp-a",52,IMG.prototype],["wp-b",-36,IMG.research],["wp-c",25,IMG.pitch],["wp-d",-49,IMG.founders]] as const;

function useRealWork(ref:RefObject<HTMLElement>){
  const [work,setWork]=useState<NetItem[]|null>(null);
  useEffect(()=>{
    const el=ref.current;if(!el)return;
    let cancelled=false;
    const io=new IntersectionObserver(([entry])=>{
      if(!entry.isIntersecting)return;
      io.disconnect();
      loadNetworkData(API_BASE,VENTURE_NAMES).then(data=>{
        if(cancelled||!data)return;
        const pick=(kind:NetItem["kind"])=>data.items.filter(i=>i.kind===kind&&i.readable&&i.href&&i.title.length<=90).slice(0,2);
        const problems=pick("problem"),ideas=pick("idea");
        if(problems.length<2||ideas.length<2)return;
        setWork([problems[0],ideas[0],problems[1],ideas[1]]);
      });
    },{rootMargin:"150% 0px"});
    io.observe(el);
    return()=>{cancelled=true;io.disconnect()};
  },[ref]);
  return work;
}

function WorkField() {
  const ref=useRef<HTMLDivElement>(null);const work=useRealWork(ref);useEffect(()=>{
    // The collage drifts toward the cursor through one eased loop. Setting a transform per pointer
    // event restarted a CSS transition each time, so the cards shook instead of gliding. Mouse
    // only: on touch, the pointer moves are the finger scrolling the page.
    const el=ref.current;if(!el||!window.matchMedia("(hover:hover) and (pointer:fine)").matches)return;
    const ns=Array.from(el.querySelectorAll<HTMLElement>("[data-depth]")).map(n=>({n,d:Number(n.dataset.depth||0)}));
    const target={x:0,y:0},cur={x:0,y:0};let raf=0;
    const loop=()=>{
      cur.x+=(target.x-cur.x)*.09;cur.y+=(target.y-cur.y)*.09;
      for(const {n,d} of ns)n.style.transform=`translate3d(${(cur.x*d).toFixed(2)}px,${(cur.y*d).toFixed(2)}px,0)`;
      raf=Math.abs(target.x-cur.x)+Math.abs(target.y-cur.y)>.0005?requestAnimationFrame(loop):0;
    };
    const kick=()=>{if(!raf)raf=requestAnimationFrame(loop)};
    const move=(e:PointerEvent)=>{if(e.pointerType!=="mouse")return;const r=el.getBoundingClientRect();target.x=(e.clientX-r.left)/r.width-.5;target.y=(e.clientY-r.top)/r.height-.5;kick()};
    const leave=()=>{target.x=0;target.y=0;kick()};
    el.addEventListener("pointermove",move,{passive:true});el.addEventListener("pointerleave",leave);
    return()=>{el.removeEventListener("pointermove",move);el.removeEventListener("pointerleave",leave);cancelAnimationFrame(raf)};
  },[]);return <section className="work-field light" data-tone="paper" ref={ref}><div className="work-top"><span>06 / THE WORK</span><span>{work?"POSTED BY STUDENTS":"WORK IN PROGRESS"}</span></div><div className="work-word">BUILD</div>{WORK_SLOTS.map(([slot,depth,img],i)=>{const w=work?.[i];return <div key={slot} className={`work-pic ${slot}${w?" is-card":""}`} data-depth={depth}>{w?<Link to={w.href!} className={`work-card is-${w.kind}`}><span>{w.kind==="problem"?"Problem":"Idea"}<small>{w.kind==="problem"?" / posted by a student":" / answering a problem"}</small></span><b>{w.title}</b><em>Open ↗</em></Link>:<img src={img} alt="" loading="lazy" decoding="async"/>}</div>})}<span className="work-note wn-a" data-depth="25">question → evidence</span><span className="work-note wn-b" data-depth="-18">prototype / 04</span><span className="work-note wn-c" data-depth="33">iteration / 07</span><div className="work-rule"/><div className="work-caption"><span>THE THING THAT LOOKS LIKE A STARTUP<br/>IS USUALLY A COLLECTION OF ITERATIONS.</span><span>{work?"VJ / WORK LOG / LIVE FROM THE PLATFORM":"VJ / WORK LOG"}</span></div></section>;
}

function Ventures() {
  const [active,setActive]=useState(0), v=VENTURES[active];return <section className="ventures light" data-tone="paper" id="ventures"><Reveal className="ventures-head"><span className="chapter-label dark">07 / PROOF</span><h2>IDEAS THAT<br/><i>MOVED.</i></h2><p>Selected ventures and technologies already moving through the ecosystem.</p></Reveal><div className="venture-stage" data-reveal><div className="venture-menu">{VENTURES.map((x,i)=><button key={x[0]} className={i===active?"active":""} onClick={()=>setActive(i)}><span>{x[0]}</span><div><small>{x[1]}</small><b>{x[2]}</b></div><Arrow/></button>)}</div><div className="venture-image"><img src={v[4]} alt="" key={v[0]} loading="lazy" decoding="async"/><div><span>{v[1]}</span><span>{v[0]} / 03</span></div></div><div className="venture-copy"><span className="kicker dark">{v[1]}</span><h3>{v[2]}</h3><p>{v[3]}</p><Link to="/startups">Explore the build <Arrow/></Link></div></div></section>;
}

const VENTURE_NAMES=VENTURES.map(v=>v[2]);
// Where each force sits on the weave: [strand, position along it].
const FORCE_PINS:[("upperLine"|"upperRibbon"|"lowerLine"|"lowerRibbon"),number][]=[
  ["upperLine",.1],    // 01 Students
  ["upperRibbon",.9],  // 02 Problems
  ["lowerLine",.84],   // 03 Research
  ["lowerRibbon",.66], // 04 Mentors
  ["lowerRibbon",.2],  // 05 Industry
  ["upperRibbon",.3],  // 06 Capital
  ["upperLine",.52],   // 07 Campus
];

function Network() {
  const sectionRef=useRef<HTMLElement>(null);
  const stickyRef=useRef<HTMLDivElement>(null);
  const headRef=useRef<HTMLDivElement>(null);
  const mapRef=useRef<HTMLDivElement>(null);
  const upperRef=useRef<SVGGElement>(null);
  const lowerRef=useRef<SVGGElement>(null);
  const panelRef=useRef<HTMLDivElement>(null);
  const nodes=useRef<Array<HTMLSpanElement|null>>([]);

  // Each force is pinned to a point on a weave strand (its connector line drops onto the curve),
  // appears when the drawing reaches it, and travels with its strand when the weave parts.
  const pins=useRef<{x:number,y:number,side:1|-1,cx:number,cy:number,t:number,w:number,h:number}[]>([]);
  const mapScale=useRef({sx:1,sy:1});
  useEffect(()=>{
    const map=mapRef.current;
    if(!map)return;
    const measure=()=>{
      const strands={
        upperLine:map.querySelector<SVGPathElement>(".network-v16-weave-upper .network-v16-line"),
        upperRibbon:map.querySelector<SVGPathElement>(".network-v16-weave-upper .network-v16-ribbon"),
        lowerLine:map.querySelector<SVGPathElement>(".network-v16-weave-lower .network-v16-line"),
        lowerRibbon:map.querySelector<SVGPathElement>(".network-v16-weave-lower .network-v16-ribbon"),
      };
      const boxes={upper:upperRef.current?.getBBox(),lower:lowerRef.current?.getBBox()};
      mapScale.current={sx:map.clientWidth/1200,sy:map.clientHeight/720};
      pins.current=FORCE_PINS.map(([strand,t],i)=>{
        const path=strands[strand];
        const point=path?path.getPointAtLength(path.getTotalLength()*t):{x:600,y:360};
        const upper=strand.startsWith("upper");
        const box=upper?boxes.upper:boxes.lower;
        const node=nodes.current[i];
        return {x:point.x,y:point.y,side:upper?1:-1,cx:box?box.x+box.width/2:600,cy:box?box.y+box.height/2:360,t,w:node?.offsetWidth??90,h:node?.offsetHeight??30};
      });
    };
    measure();
    document.fonts?.ready.then(measure);
    const ro=new ResizeObserver(measure);
    ro.observe(map);
    return()=>ro.disconnect();
  },[]);

  useSectionFrame(sectionRef,frame=>{
      const p=progressOf(frame);
      // Enter: the weave draws itself, then parts to reveal the panel.
      const draw=band(p,.02,.3);
      const open=band(p,.38,.9);
      const eased=1-Math.pow(1-open,3);
      const map=mapRef.current;
      map?.style.setProperty("--weave-draw",String(draw));
      map?.style.setProperty("--network-open",String(eased));
      stickyRef.current?.style.setProperty("--network-open",String(eased));
      const upAngle=-eased*1.25,downAngle=eased*1.4;
      if(upperRef.current)upperRef.current.style.transform=`translate3d(0,${-eased*205}px,0) rotate(${upAngle}deg)`;
      if(lowerRef.current)lowerRef.current.style.transform=`translate3d(0,${eased*215}px,0) rotate(${downAngle}deg)`;
      if(panelRef.current){
        panelRef.current.style.opacity=String(Math.max(0,eased-.05));
        panelRef.current.style.transform=`translate3d(-50%,${(1-eased)*95}px,0) scale(${.94+eased*.06})`;
      }

      const {sx,sy}=mapScale.current;
      pins.current.forEach((pin,i)=>{
        const node=nodes.current[i];
        if(!node)return;
        const angle=((pin.side>0?upAngle:downAngle)*Math.PI)/180;
        const dx=pin.x-pin.cx,dy=pin.y-pin.cy;
        const x=pin.cx+dx*Math.cos(angle)-dy*Math.sin(angle);
        const y=pin.cy+dx*Math.sin(angle)+dy*Math.cos(angle)+(pin.side>0?-205:215)*eased;
        // The map now runs edge to edge, so keep each label a little inside the screen.
        const inset=16;
        const left=Math.min(Math.max(x*sx-pin.w/2,inset),(map?.clientWidth??0)-pin.w-inset);
        node.style.transform=`translate3d(${left}px,${y*sy-26-pin.h}px,0)`;
        // Labels step aside as the panel arrives, so it lands on a clear field.
        node.style.opacity=String(Math.min(Math.max((draw-pin.t)*7,0),1)*(1-eased*(window.innerWidth<1100?1:.85)));
      });

  });

  useEffect(()=>{
    const clear=()=>{
      if(!headRef.current||!mapRef.current)return;
      const headBottom=headRef.current.getBoundingClientRect().bottom;
      const sticky=mapRef.current.parentElement;
      const stickyTop=sticky?sticky.getBoundingClientRect().top:0;
      mapRef.current.style.top=`${headBottom-stickyTop+24}px`;
    };
    clear();
    document.fonts?.ready.then(clear);
    window.addEventListener("resize",clear);
    return()=>window.removeEventListener("resize",clear);
  },[]);


  return (
    <section className="network-v16 dark" data-tone="ink" id="network" ref={sectionRef}>
      <div className="network-v16-sticky" ref={stickyRef}>
        <div className="network-v16-head" data-reveal ref={headRef}>
          <span className="chapter-label">08 / THE NETWORK</span>
          <h2>ONE BUILDER.<br/><i>MANY FORCES.</i></h2>
          <p>The right people, knowledge, access and momentum turn a single build into a living ecosystem.</p>
        </div>

        <div className="network-v16-map" ref={mapRef} data-reveal>
          <div className="network-v16-glow"/>
          <div className="network-v16-ghost">NETWORK</div>

          <svg className="network-v16-svg" viewBox="0 0 1200 720" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <filter id="networkV16Soft"><feGaussianBlur stdDeviation="8"/></filter>
              <linearGradient id="networkV16Gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#d7ff63" stopOpacity="0"/>
                <stop offset="22%" stopColor="#d7ff63" stopOpacity=".58"/>
                <stop offset="50%" stopColor="#ffffff" stopOpacity=".28"/>
                <stop offset="78%" stopColor="#ff4aa7" stopOpacity=".5"/>
                <stop offset="100%" stopColor="#ff4aa7" stopOpacity="0"/>
              </linearGradient>
            </defs>

            <g ref={upperRef} className="network-v16-weave-upper">
              <path pathLength={1} className="network-v16-blur" d="M30 535 C165 115 455 55 665 270 S1050 585 1160 95"/>
              <path pathLength={1} className="network-v16-line" d="M30 535 C165 115 455 55 665 270 S1050 585 1160 95"/>
              <path className="network-v16-ribbon" d="M10 235 C210 620 505 660 770 385 S1035 70 1190 515"/>
              <path className="network-v16-ribbon-thin" d="M10 235 C210 620 505 660 770 385 S1035 70 1190 515"/>
            </g>

            <g ref={lowerRef} className="network-v16-weave-lower">
              <path pathLength={1} className="network-v16-blur" d="M40 175 C235 555 505 665 735 390 S1000 85 1180 520"/>
              <path pathLength={1} className="network-v16-line" d="M40 175 C235 555 505 665 735 390 S1000 85 1180 520"/>
              <path className="network-v16-ribbon" d="M25 510 C205 105 485 65 700 320 S1010 610 1185 155"/>
              <path className="network-v16-ribbon-thin" d="M25 510 C205 105 485 65 700 320 S1010 610 1185 155"/>
            </g>

            <path className="network-v16-center-thread" d="M70 360 C325 330 560 390 1130 352"/>
            <path className="network-v16-dotted" d="M145 440 C330 175 590 120 900 245 C705 175 505 245 410 410 C320 560 585 625 935 495"/>
          </svg>

          <div className="network-v16-opening">
            <span>NOBODY BUILDS ALONE</span>
            <i/>
          </div>

          <div className="network-v16-node network-node-0" ref={n=>{nodes.current[0]=n}}><b>01</b>STUDENTS</div>
          <div className="network-v16-node network-node-1" ref={n=>{nodes.current[1]=n}}><b>02</b>PROBLEMS</div>
          <div className="network-v16-node network-node-2" ref={n=>{nodes.current[2]=n}}><b>03</b>RESEARCH</div>
          <div className="network-v16-node network-node-3" ref={n=>{nodes.current[3]=n}}><b>04</b>MENTORS</div>
          <div className="network-v16-node network-node-4" ref={n=>{nodes.current[4]=n}}><b>05</b>INDUSTRY</div>
          <div className="network-v16-node network-node-5" ref={n=>{nodes.current[5]=n}}><b>06</b>CAPITAL</div>
          <div className="network-v16-node network-node-6" ref={n=>{nodes.current[6]=n}}><b>07</b>CAMPUS</div>

          <div className="network-v16-panel" ref={panelRef}>
            <span>THE NETWORK OPENS THE NEXT DOOR</span>
            <h3>CONNECTION<br/><i>BECOMES MOMENTUM.</i></h3>
            <div className="network-v16-panel-stats">
              <span>PEOPLE</span>
              <span>KNOWLEDGE</span>
              <span>ACCESS</span>
              <span>MOMENTUM</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
type StageUnlock={userName:string;stageName:string;completedAt:string};

const since=(iso:string)=>{
  const hours=Math.max(0,(Date.now()-new Date(iso).getTime())/36e5);
  if(hours<1)return "now";
  if(hours<24)return `${Math.floor(hours)}h`;
  const days=Math.floor(hours/24);
  return days<7?`${days}d`:`${Math.floor(days/7)}w`;
};

function useJourneyActivity(){
  const [data,setData]=useState<{total:number|null;recent:StageUnlock[]}|null>(null);
  useEffect(()=>{
    let live=true;
    fetch(`${API_BASE}/notification-api/stage-notifications/stats`)
      .then(r=>r.ok?r.json():Promise.reject(r.status))
      .then(d=>{if(live)setData({total:d.totalCount||0,recent:d.recentNotifications||[]});})
      .catch(()=>{if(live)setData({total:null,recent:[]});});
    return()=>{live=false;};
  },[]);
  return data;
}

// The platform's own record: what students actually posted, newest first, with real dates.
// Built from the same cached request as the network scene, and only once the section nears.
type RecordRow={key:string;date:string;kind:"problem"|"idea"|"unlock";label:string;text:string;href:string|null};
type PlatformRecord={rows:RecordRow[]};

function usePlatformRecord(ref:RefObject<HTMLElement>){
  const [record,setRecord]=useState<PlatformRecord|null|false>(null);
  useEffect(()=>{
    const el=ref.current;if(!el)return;
    let cancelled=false;
    const io=new IntersectionObserver(([entry])=>{
      if(!entry.isIntersecting)return;
      io.disconnect();
      loadNetworkData(API_BASE,VENTURE_NAMES).then(data=>{
        if(cancelled)return;
        if(!data){setRecord(false);return;}
        const dated=data.items.filter(i=>i.kind!=="venture"&&i.createdAt&&i.href);
        const rows:RecordRow[]=dated.filter(i=>i.readable).map(i=>({
          key:`${i.kind}-${i.href}`,date:i.createdAt!,kind:i.kind as "problem"|"idea",
          label:i.kind==="problem"?"Problem posted":"Idea posted",text:i.title,href:i.href,
        }));
        setRecord({rows});
      });
    },{rootMargin:"150% 0px"});
    io.observe(el);
    return()=>{cancelled=true;io.disconnect()};
  },[ref]);
  return record;
}

const recordDate=(iso:string)=>new Date(iso).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});

// Start here: what a student came for, right under the hero, so nobody has to scroll through
// the story to find it. What's happening (real posts), what support exists (programs running
// now), and the first step. The story continues below for anyone who wants it.
type StartPost={key:string;kind:"problem"|"idea";title:string;href:string;date:string};
const SUPPORT_IDS=["startup-challenge-2","mentorship-program-1","innovation-internship-1","monthly-connect-4"];

function useLatestPosts(){
  const [posts,setPosts]=useState<StartPost[]|null|false>(null);
  useEffect(()=>{
    let live=true;
    const get=(url:string)=>fetch(url).then(r=>r.ok?r.json():Promise.reject(r.status));
    Promise.allSettled([get(`${API_BASE}/problem-api/problems?limit=8`),get(`${API_BASE}/idea-api/ideas`)]).then(([p,i])=>{
      if(!live)return;
      if(p.status!=="fulfilled"&&i.status!=="fulfilled"){setPosts(false);return;}
      const rawP=p.status==="fulfilled"?(p.value?.problems??p.value??[]):[];
      const rawI=i.status==="fulfilled"&&Array.isArray(i.value)?i.value:[];
      const all:StartPost[]=[
        ...rawP.filter((x:any)=>x?.problemId!=null&&x.title&&x.createdAt).map((x:any)=>({key:`p-${x.problemId}`,kind:"problem" as const,title:String(x.title).trim(),href:`/problems/${x.problemId}`,date:x.createdAt})),
        ...rawI.filter((x:any)=>x?.ideaId&&x.title&&x.createdAt).map((x:any)=>({key:`i-${x.ideaId}`,kind:"idea" as const,title:String(x.title).trim(),href:`/ideas/${getIdeaNavigationSlug({title:String(x.title),ideaId:String(x.ideaId)})}`,date:x.createdAt})),
      ].filter(x=>isReadableTitle(x.title)).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,3);
      setPosts(all);
    });
    return()=>{live=false};
  },[]);
  return posts;
}

function StartHere(){
  const {user}=useUser();
  const posts=useLatestPosts();
  const support=SUPPORT_IDS.map(id=>startupPrograms.find(p=>p.id===id)).filter((p):p is StartupProgram=>Boolean(p));
  const running=startupPrograms.filter(p=>p.status==="active").length;
  const mentors=startupPrograms.find(p=>p.id==="mentorship-program-1")?.mentors?.length??0;
  const need=(to:string)=>user?to:"/login";
  const steps:[string,string,string][]=[
    ["Post a problem you've noticed","On campus, at home, anywhere. Problems are where ventures start.",need("/submit-problem")],
    ["Turn it into an idea","Pick a problem, yours or someone else's, and propose a way to solve it.",need("/submit-idea")],
    ["Walk the 7-stage journey","Tick off each stage, pass its quiz, and unlock the next one.","/journey"],
  ];
  return <section className="start-here dark" data-tone="ink" id="start-here">
    <Reveal className="start-here-head">
      <span className="chapter-label">FOR EVERY STUDENT</span>
      <h2>WHAT&apos;S ON.<br/><i>WHERE TO BEGIN.</i></h2>
      <p>What's happening on campus, the support you can get, and your first step.</p>
    </Reveal>
    <div className="start-here-grid" data-reveal>
      <div className="start-col">
        <span className="start-col-label"><b>01</b>Happening now</span>
        <ul className="start-list">
          {posts&&posts.length?posts.map(post=><li key={post.key}><Link to={post.href}>
            <small><i className={`is-${post.kind}`}/>{post.kind==="problem"?"Problem posted":"Idea posted"} · {recordDate(post.date)}</small>
            <b>{post.title}</b>
          </Link></li>):<li className="start-empty">{posts===false?"Couldn't load the latest posts.":"Loading the latest posts…"}</li>}
        </ul>
        <p className="start-note">{running} programs are running right now.</p>
        <Link className="start-more" to="/problems">See every problem <Arrow/></Link>
      </div>
      <div className="start-col">
        <span className="start-col-label"><b>02</b>Support you can get</span>
        <ul className="start-list">
          {support.map(p=><li key={p.id}><Link to={`/programs/${p.id}`}>
            <small>{p.duration}</small>
            <b>{p.title}</b>
            <span>{p.id==="mentorship-program-1"&&mentors?`${mentors} faculty mentors, one-on-one, by appointment`:p.subtitle}</span>
          </Link></li>)}
        </ul>
        <Link className="start-more" to="/programs">All {startupPrograms.length} programs <Arrow/></Link>
      </div>
      <div className="start-col is-journey">
        <span className="start-col-label"><b>03</b>Start your journey</span>
        <ol className="start-steps">
          {steps.map(([title,text,to],i)=><li key={title}><Link to={to}>
            <em>{String(i+1).padStart(2,"0")}</em>
            <div><b>{title}</b><span>{text}</span></div>
          </Link></li>)}
        </ol>
        <Magnetic href={user?"/journey":"/login"} className="start-cta">{user?"Continue your journey":"Start your journey"} <Arrow/></Magnetic>
      </div>
    </div>
  </section>;
}


function Community() {
  const ref=useRef<HTMLElement>(null);
  const activity=useJourneyActivity();
  const record=usePlatformRecord(ref);
  const unlocks:RecordRow[]=(activity?.recent??[]).map(n=>({
    key:`unlock-${n.userName}-${n.stageName}-${n.completedAt}`,date:String(n.completedAt),kind:"unlock",
    label:"Stage unlocked",text:`${n.userName.split(" ")[0]} reached ${n.stageName}`,href:"/journey",
  }));
  const rows=[...unlocks,...(record?record.rows:[])].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,6);
  return <section className="community light" data-tone="paper" id="community" ref={ref}>
    <Reveal className="community-head"><span className="chapter-label dark">09 / IN MOTION</span><h2>THE WORK IS<br/><i>STILL MOVING.</i></h2><p>Not a highlights reel: the latest things students actually posted on the platform, newest first.</p></Reveal>
    <div className="feed" data-reveal>
      {rows.length?rows.map((row,i)=>{
        const body=<><span>{recordDate(row.date)}</span><i className={`is-${row.kind}`}/><div><b>{row.label.toUpperCase()}</b><span>{row.kind==="unlock"?row.text:<em>“{row.text}”</em>}</span></div><small>{String(i+1).padStart(2,"0")}</small></>;
        return row.href?<Link className="feed-row" to={row.href} key={row.key}>{body}</Link>:<div className="feed-row" key={row.key}>{body}</div>;
      }):<div className="feed-row feed-empty"><span>—</span><i/><div><b>{record===false?"COULDN'T REACH THE PLATFORM":"LOADING"}</b><span>{record===false?<>Browse the <Link to="/problems"><em>problems</em></Link> directly.</>:"Reading the latest posts…"}</span></div><small>00</small></div>}
    </div>
    <div className="community-foot" data-reveal>
      <Link className="community-link" to="/problems">Read every problem <Arrow/></Link>
    </div>
  </section>;
}

function FAQ() {
  const [open,setOpen]=useState<number|null>(null), items=[["What is VJ Startups?","A campus startup platform helping college entrepreneurs turn real-world challenges into innovations through a structured journey."],["Who can join?","Students and emerging builders can discover problems, develop ideas, connect with peers, and progress through the startup journey."],["What is the Virtual Startup Journey?","A seven-stage system covering Problem Discovery, Idea & Concept, Research & Feasibility, User Validation, Prototype Development, MVP & Launch, and Growth & Scaling."],["How do the Hubs work?","ProblemHub focuses on discovery, IdeaHub on solution development, and StartupHub on building and scaling ventures."],["Does the ecosystem include mentors and partners?","Yes. The public platform describes entrepreneurship partners, research partners, industry mentors, and a broader network around founders."]];return <section className="faq light" data-tone="paper" id="faq"><Reveal className="faq-head"><span className="chapter-label dark">11 / QUESTIONS</span><h2>GOOD QUESTIONS<br/><i>CHANGE THINGS.</i></h2><p>Start with the answer that gets you back to building.</p></Reveal><div className="faq-list" data-reveal>{items.map(([q,a],i)=><div className={`faq-item ${open===i?"open":""}`} key={q}><button onClick={()=>setOpen(open===i?null:i)}><span>0{i+1}</span><b>{q}</b><i>{open===i?"−":"+"}</i></button><div><p>{a}</p></div></div>)}</div></section>;
}

const TONES:Record<string,string>={ink:"#080808",paper:"#f0eee8",pink:"#ff4aa7"};

// The landing is one story in three acts; the intro counts through the same words. The rail
// states where you are in it and jumps between acts.
const ACTS=[{id:"top",roman:"I",name:"Question"},{id:"journey",roman:"II",name:"Build"},{id:"ventures",roman:"III",name:"Impact"}] as const;

function ActRail(){
  const railRef=useRef<HTMLElement>(null);
  const fills=useRef<Array<HTMLSpanElement|null>>([]);
  const [lengths,setLengths]=useState<number[]>([1,1,1]);
  const [active,setActive]=useState(0);
  useEffect(()=>{
    let starts:number[]=[],end=1;
    const measure=()=>{
      starts=ACTS.map(a=>{const el=document.getElementById(a.id);return el?el.getBoundingClientRect().top+window.scrollY:0;});
      const footer=document.querySelector(".vj-landing .sc-footer");
      end=footer?footer.getBoundingClientRect().top+window.scrollY:document.documentElement.scrollHeight;
      setLengths(starts.map((start,i)=>Math.max((i<starts.length-1?starts[i+1]:end)-start,1)));
    };
    let raf=0;
    const paint=()=>{
      raf=0;
      const focus=window.scrollY+window.innerHeight*.5;
      let current=0;
      starts.forEach((start,i)=>{
        const stop=i<starts.length-1?starts[i+1]:end;
        const fill=fills.current[i];
        if(fill)fill.style.transform=`scaleY(${Math.min(Math.max((focus-start)/(stop-start),0),1)})`;
        if(focus>=start)current=i;
      });
      setActive(current);
      // Out of the way during the hero and once the footer arrives.
      railRef.current?.classList.toggle("is-visible",window.scrollY>window.innerHeight*.7&&focus<end);
    };
    const schedule=()=>{if(!raf)raf=requestAnimationFrame(paint)};
    const stop=onMeasure(()=>{measure();schedule();});
    measure();schedule();
    window.addEventListener("scroll",schedule,{passive:true});
    return()=>{stop();window.removeEventListener("scroll",schedule);cancelAnimationFrame(raf)};
  },[]);
  return <nav className="act-rail" ref={railRef} aria-label="Story chapters">
    {ACTS.map((act,i)=><a key={act.id} href={`#${act.id}`} className={i===active?"is-on":""} style={{flexGrow:lengths[i]}} aria-current={i===active?"step":undefined}>
      <span className="act-track"><span className="act-fill" ref={n=>{fills.current[i]=n}}/></span>
      <span className="act-label"><b>{act.roman}</b>{act.name}</span>
    </a>)}
  </nav>;
}

function PageField(){
  const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    let marks:{el:HTMLElement,top:number,tone:string,shown:string}[]=[];
    const measure=()=>{
      marks=Array.from(document.querySelectorAll<HTMLElement>("[data-tone]")).map(el=>({el,top:el.getBoundingClientRect().top+window.scrollY,tone:el.dataset.tone||"ink",shown:""}));
    };
    let raf=0,applied="",appliedMid="",appliedTop="";
    const schedule=()=>{if(!raf)raf=requestAnimationFrame(tick)};
    const tick=()=>{
      raf=0;
      if(marks.length&&ref.current){
        // On tall screens (portrait tablets and phones) the flip happens lower, so the next
        // section's opening text arrives after the colour has changed, not before.
        const tall=window.innerWidth/window.innerHeight<1.4;
        const focus=window.scrollY+window.innerHeight*(tall?.7:.5);
        // The blend spans at most 320px around each section boundary. As 60% of the screen height
        // it grew past short sections on tall phones and tablets, leaving their text on mid-grey.
        const w=Math.min(window.innerHeight*.6,tall?420:320);
        let color=TONES[marks[0].tone];
        let midTone=marks[0].tone;
        let from=marks[0].tone,to=from,mix=1;
        for(let i=1;i<marks.length;i++){
          const t=ease(band(focus,marks[i].top-w/2,marks[i].top+w/2));
          if(t===0)break;
          // On tall screens the content dissolves across the whole window, so the colour itself
          // turns in its middle stretch, while the screen is between contents: mid-grey is a blink.
          const c=tall?ease(band(t,.3,.7)):t;
          color=c===1?TONES[marks[i].tone]:c===0?TONES[marks[i-1].tone]:mixHex(TONES[marks[i-1].tone],TONES[marks[i].tone],c);
          if(t>=.5)midTone=marks[i].tone;
          if(marks[i].tone!==marks[i-1].tone){from=marks[i-1].tone;to=marks[i].tone;mix=t;}
          if(t<1)break;
        }
        if(color!==applied){ref.current.style.backgroundColor=color;applied=color;}
        // Tall screens show two sections at once near every boundary, and one screen colour can't
        // suit both. So as the colour turns, the outgoing tone's sections dissolve in the first
        // half of the turn and the incoming tone's arrive in the second; text never sits on the
        // other section's colour, and there is no seam or band between them.
        for(const m of marks){
          let o=1;
          if(tall){
            if(mix<1&&from!==to)o=m.tone===from?1-band(mix,0,.4):m.tone===to?band(mix,.6,1):0;
            else o=m.tone===to?1:0;
          }
          const v=o.toFixed(3);
          if(v!==m.shown){m.el.style.opacity=o===1?"":v;m.shown=v;}
        }
        // Which tone is on screen, for chrome that adapts to it (act rail at mid-screen, header at the top).
        const root=ref.current.parentElement;
        if(midTone!==appliedMid){root?.setAttribute("data-field",midTone);appliedMid=midTone;}
        let topTone=marks[0].tone;
        for(const m of marks){if(m.top<=window.scrollY+40)topTone=m.tone;else break;}
        if(topTone!==appliedTop){root?.setAttribute("data-top",topTone);appliedTop=topTone;}
      }
    };
    // Section tops are read in the shared measure pass (frame.ts), not on every body resize.
    const off=onMeasure(()=>{measure();schedule()});
    window.addEventListener("scroll",schedule,{passive:true});
    return()=>{off();window.removeEventListener("scroll",schedule);cancelAnimationFrame(raf)};
  },[]);
  return <div className="page-field" ref={ref} aria-hidden="true"/>;
}

export default function Landing(){
  const { user }=useUser();
  const progressRef=useRef<HTMLSpanElement>(null);
  useEffect(()=>{
    const observer=new IntersectionObserver(entries=>entries.forEach(e=>e.isIntersecting&&e.target.classList.add("revealed")),{threshold:.07});
    document.querySelectorAll("[data-reveal]").forEach(el=>observer.observe(el));
    return()=>observer.disconnect();
  },[]);
  useEffect(()=>{
    let raf=0;
    const paint=()=>{
      raf=0;
      const {scrollMax}=pageMetrics();
      if(progressRef.current)progressRef.current.style.transform=`scaleX(${scrollMax>0?window.scrollY/scrollMax:0})`;
    };
    const schedule=()=>{if(!raf)raf=requestAnimationFrame(paint)};
    const stop=onMeasure(schedule);
    window.addEventListener("scroll",schedule,{passive:true});
    schedule();
    return()=>{stop();window.removeEventListener("scroll",schedule);cancelAnimationFrame(raf)};
  },[]);
  return <div className="vj-landing"><Intro/><Cursor/><SmoothScroll/><PageField/><ActRail/><div className="global-progress"><span ref={progressRef}/></div><a href="#main" className="skip-link">Skip to content</a><SiteNav overlay brandHref="#top"/><main id="main" tabIndex={-1}><Hero/><StartHere/><section className="statement dark" data-tone="ink"><Reveal><span className="chapter-label">00 / THE PREMISE</span><h2>DON&apos;T START<br/><span>WITH THE IDEA.</span></h2><p>Start with the thing that keeps breaking.</p></Reveal></section><Morph/><Starting/><Journey/><Sphere/><Hubs/><WorkField/><Ventures/><Network/><Community/><section className="recognition dark" data-tone="ink"><Reveal><span className="chapter-label">10 / SIGNALS</span><h2>PROOF IS A<br/><i>MILESTONE.</i></h2><p>Recognition and funding are signals along the journey, not the destination.</p></Reveal><div className="recognition-list"><div><span>2024</span><b>Best Innovation Award</b><small>National Startup Competition</small></div><div><span>₹2.8Cr</span><b>Total funding raised</b><small>Across the current funded portfolio</small></div><div><span>{String(counters.funded).padStart(2,"0")}</span><b>Funded startups</b><small>Ventures that moved beyond the idea stage</small></div></div></section><FAQ/><section className="contact-v13 dark" data-tone="pink" id="contact">
  <div className="contact-v13-back" aria-hidden="true">
    <span>QUESTION</span><span>BUILD</span><span>PROVE</span><span>IMPACT</span>
  </div>
  <Reveal className="contact-v13-main">
    <span className="chapter-label">12 / YOUR TURN</span>
    <h2>
      <span className="contact-line">WHAT <i>WILL</i></span>
      <span className="contact-line accent">YOU <i>BUILD?</i></span>
    </h2>
    <Magnetic href={user?"/journey":"/login"}><span>Start your journey</span><Arrow/></Magnetic>
  </Reveal>
  <div className="contact-meta"><span>HYDERABAD / INDIA</span><span>PROBLEMS → IDEAS → STARTUPS</span><span>2026</span></div>
</section>
<SiteFooter tone="ink" topHref="#top"/></main></div>;
}
