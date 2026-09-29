"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";

const IMG = {
  hero: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=2200&q=92",
  people: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1800&q=92",
  pitch: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1800&q=92",
  research: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1800&q=92",
  prototype: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1800&q=92",
  founders: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1800&q=92",
  room: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1800&q=92",
  campus: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1800&q=92",
  energy: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1600&q=92",
  health: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=92",
  iot: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=92",
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
  ["ProblemHub", "DISCOVER", "The problem is the first customer.", IMG.people],
  ["IdeaHub", "CREATE", "Turn a real observation into something testable.", IMG.pitch],
  ["StartupHub", "SCALE", "Take evidence, make it traction, and keep going.", IMG.founders],
] as const;

const VENTURES = [
  ["01", "Clean Energy", "ATLAST Hydrogen Solutions", "Hydrogen fuel-cell technology transforming automotive and energy applications.", IMG.energy],
  ["02", "HealthTech", "Salcit AI Health", "AI-powered cough analysis for respiratory screening and remote monitoring.", IMG.health],
  ["03", "Industrial IoT", "Alltronics IoT Solutions", "Smart IoT and AI-enabled electronic testing, EV battery monitoring, and industrial automation.", IMG.iot],
] as const;

function Mark() {
  return <a className="brand" href="#top" aria-label="VJ Startups"><span className="brand-symbol"><i/><i/><i/><i/><i/><i/></span><span>VJ STARTUPS</span></a>;
}
function Arrow() { return <span className="arrow">↗</span>; }
function Reveal({ children, className="" }: { children: React.ReactNode; className?: string }) { return <div data-reveal className={className}>{children}</div>; }

function Magnetic({ href, children }: { href:string; children:React.ReactNode }) {
  const ref=useRef<HTMLAnchorElement>(null);
  return <a ref={ref} href={href} className="magnetic" onMouseMove={(e)=>{const r=ref.current?.getBoundingClientRect();if(!r||!ref.current)return;ref.current.style.setProperty("--tx",`${((e.clientX-r.left)/r.width-.5)*11}px`);ref.current.style.setProperty("--ty",`${((e.clientY-r.top)/r.height-.5)*11}px`);}} onMouseLeave={()=>{ref.current?.style.setProperty("--tx","0px");ref.current?.style.setProperty("--ty","0px");}}>{children}</a>;
}

function Cursor() {
  const blob=useRef<HTMLDivElement>(null), ring=useRef<HTMLDivElement>(null);
  const target=useRef({x:0,y:0}), current=useRef({x:0,y:0});
  useEffect(()=>{
    target.current={x:window.innerWidth/2,y:window.innerHeight/2};current.current={...target.current};
    let raf=0;
    const move=(e:PointerEvent)=>{
      target.current.x=e.clientX;target.current.y=e.clientY;
      const interactive=Boolean((e.target as HTMLElement|null)?.closest("a,button"));
      document.documentElement.style.setProperty("--cursor-active",interactive?"1":"0");
      document.documentElement.style.setProperty("--cx",`${e.clientX}px`);
      document.documentElement.style.setProperty("--cy",`${e.clientY}px`);
    };
    const loop=()=>{current.current.x+=(target.current.x-current.current.x)*.12;current.current.y+=(target.current.y-current.current.y)*.12;if(blob.current)blob.current.style.transform=`translate3d(${current.current.x}px,${current.current.y}px,0) translate(-50%,-50%)`;if(ring.current)ring.current.style.transform=`translate3d(${target.current.x}px,${target.current.y}px,0) translate(-50%,-50%)`;raf=requestAnimationFrame(loop);};
    window.addEventListener("pointermove",move,{passive:true});raf=requestAnimationFrame(loop);
    return()=>{window.removeEventListener("pointermove",move);cancelAnimationFrame(raf)};
  },[]);
  return <><div ref={blob} className="cursor-blob"><span>VIEW</span></div><div ref={ring} className="cursor-ring"/></>;
}

function SmoothScroll() {
  useEffect(()=>{
    const lenis=new Lenis({duration:1.15, smoothWheel:true, syncTouch:true, wheelMultiplier:.9, touchMultiplier:1});
    let raf=0;
    const frame=(time:number)=>{lenis.raf(time);raf=requestAnimationFrame(frame)};
    raf=requestAnimationFrame(frame);
    const click=(e:MouseEvent)=>{
      const anchor=(e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if(!anchor)return;
      const id=anchor.getAttribute("href");
      if(!id||id==="#")return;
      const target=document.querySelector<HTMLElement>(id);
      if(!target)return;
      e.preventDefault();lenis.scrollTo(target,{offset:-72,duration:1.2});
      history.replaceState(null,"",id);
    };
    document.addEventListener("click",click);
    return()=>{document.removeEventListener("click",click);cancelAnimationFrame(raf);lenis.destroy()};
  },[]);
  return null;
}

function Intro() {
  const [done,setDone]=useState(false);
  const [p,setP]=useState(0);

  useEffect(()=>{
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
        <span>SYSTEM / 00 — INITIALISING</span>
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

      <div className="intro-v16-pulse" style={{left:`${12+p*.72}%`,top:`${24+Math.sin(p*.08)*11}%`}}/>
      <div className="intro-v16-pulse pink" style={{left:`${76-p*.33}%`,top:`${70-Math.sin(p*.05)*13}%`}}/>
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

function Hero() {
  const outer=useRef<HTMLElement>(null);
  const sticky=useRef<HTMLDivElement>(null);
  const reveal=useRef<HTMLDivElement>(null);
  const blobWrap=useRef<HTMLDivElement>(null);
  const blob=useRef<HTMLDivElement>(null);
  const blobImg=useRef<HTMLImageElement>(null);
  const cover=useRef<HTMLDivElement>(null);
  const ribbon=useRef<HTMLDivElement>(null);

  useEffect(()=>{
    const el=sticky.current;
    if(!el)return;
    let rx=0,ry=0,tx=0,ty=0,raf=0;
    const move=(e:PointerEvent)=>{
      const r=el.getBoundingClientRect();
      tx=((e.clientX-r.left)/r.width-.5)*18;
      ty=((e.clientY-r.top)/r.height-.5)*12;
      if(reveal.current){
        reveal.current.style.setProperty("--cx",`${e.clientX}px`);
        reveal.current.style.setProperty("--cy",`${e.clientY}px`);
      }
    };
    const loop=()=>{
      rx+=(tx-rx)*.08;
      ry+=(ty-ry)*.08;
      el.style.setProperty("--hx",`${rx}px`);
      el.style.setProperty("--hy",`${ry}px`);
      raf=requestAnimationFrame(loop);
    };
    el.addEventListener("pointermove",move,{passive:true});
    raf=requestAnimationFrame(loop);
    return()=>{el.removeEventListener("pointermove",move);cancelAnimationFrame(raf)};
  },[]);

  useEffect(()=>{
    let raf=0;
    const tick=(now:number)=>{
      const el=outer.current;
      if(!el){raf=requestAnimationFrame(tick);return}
      const rect=el.getBoundingClientRect();
      const total=Math.max(el.offsetHeight-window.innerHeight,1);
      const p=Math.min(Math.max(-rect.top/total,0),1);

      const textOut=band(p,.16,.38);
      const blobT=band(p,.30,.82);
      const bgT=band(p,.32,.88);
      const ribbonIn=band(p,.55,.70);
      const ribbonOut=band(p,.84,.97);
      const ribbonOpacity=Math.max(0,ribbonIn-ribbonOut);

      if(sticky.current){
        sticky.current.style.setProperty("--fade",String(1-textOut));
        sticky.current.style.setProperty("--fadeY",`${-textOut*46}px`);
        sticky.current.style.background=mixHex("#ffffff","#080808",bgT);
      }
      if(blobWrap.current){
        blobWrap.current.style.transform=`translate(-50%,-52%) scale(${1+blobT*2.6})`;
      }
      if(blob.current){
        const wobble=Math.sin(now*.0007)*3*(1-blobT);
        const r=Math.max(0,43-blobT*40+wobble);
        blob.current.style.borderRadius=`${r}%`;
      }
      if(blobImg.current){
        blobImg.current.style.filter=`saturate(${(.52*(1-blobT)).toFixed(3)}) contrast(1.04) brightness(${(1-blobT*.82).toFixed(3)})`;
      }
      if(cover.current){
        cover.current.style.opacity=String(Math.min(1,blobT*1.1));
      }
      if(ribbon.current){
        ribbon.current.style.opacity=String(ribbonOpacity);
        ribbon.current.style.transform=`translate3d(0,${(1-ribbonIn)*16}px,0)`;
      }

      raf=requestAnimationFrame(tick);
    };
    raf=requestAnimationFrame(tick);
    return()=>cancelAnimationFrame(raf);
  },[]);

  return (
    <section className="opening" data-tone="ink" ref={outer} id="top">
      <div className="hero-v12 opening-sticky" ref={sticky}>
      <div className="hero-v12-top">
        <span>VJ STARTUPS / HYDERABAD</span>
        <span>REAL PROBLEMS / REAL BUILDERS / REAL VENTURES</span>
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
          <img src={IMG.hero} alt="" ref={blobImg}/>
          <div className="opening-cover" ref={cover}/>
          <div className="hero-v12-stage-no">VJ / 00</div>
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
        <Magnetic href="#start"><span>Find where you are</span><Arrow/></Magnetic>
      </div>

      <div className="hero-v12-side hero-side-left">00 — QUESTION</div>
      <div className="hero-v12-side hero-side-right">MOVE YOUR CURSOR</div>

      <div className="hero-v12-bottom">
        <span>SCROLL TO BEGIN ↓</span>
        <span>VJ / 00 → 01</span>
      </div>

      <div className="opening-ribbon" ref={ribbon} aria-hidden="true">
        <span>35</span><small>STARTUPS</small>
        <span>87</span><small>FUTURE BUILDERS</small>
        <span>8</span><small>FUNDED</small>
        <span>15</span><small>RESEARCH PARTNERS</small>
      </div>
      </div>
    </section>
  );
}
function Morph() {
  const ref=useRef<HTMLElement>(null), words=useRef<Array<HTMLDivElement|null>>([]);
  useEffect(()=>{
    let raf=0;
    const tick=()=>{
      const el=ref.current;
      if(!el){raf=requestAnimationFrame(tick);return}
      const rect=el.getBoundingClientRect();
      const range=Math.max(el.offsetHeight-window.innerHeight,1);
      const p=Math.min(Math.max(-rect.top/range,0),1);
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
      raf=requestAnimationFrame(tick);
    };
    raf=requestAnimationFrame(tick);
    return()=>cancelAnimationFrame(raf);
  },[]);
  const wordsList=["PROBLEM","EVIDENCE","BUILD","IMPACT"];
  return <section className="morph-v13 light" data-tone="paper" ref={ref}>
    <div className="morph-v13-sticky">
      <div className="morph-v13-top"><span>01 / FLUID → FORM</span><span>AN IDEA HAS NO SHAPE.</span></div>
      <div className="morph-v13-intro"><span className="chapter-label dark">FROM A THOUGHT</span><h2>MAKE IT<br/><i>REAL.</i></h2></div>
      <div className="morph-v13-stage">
        <div className="morph-v13-ripple r1"/><div className="morph-v13-ripple r2"/><div className="morph-v13-ripple r3"/>
        {wordsList.map((word,i)=><div className="morph-v13-word" key={word} ref={n=>{words.current[i]=n}}><span className="morph-v13-liquid">{word}</span><span className="morph-v13-clean">{word}</span></div>)}
      </div>
      <div className="morph-v13-bottom"><span>SCROLL IT INTO FOCUS.</span><span>VJ / 01</span></div>
    </div>
  </section>;
}
function Starting() {
  const [active,setActive]=useState(0);
  const items=[
    ["I HAVE A PROBLEM","Good. Stay here a little longer.","ProblemHub is where friction becomes a defined problem worth solving."],
    ["I HAVE AN IDEA","Now make it uncomfortable.","IdeaHub helps you test the assumptions hidden inside the idea."],
    ["I HAVE A PROTOTYPE","Put it in the world.","Use the journey to validate the product, collect evidence, and iterate."],
    ["I HAVE TRACTION","Make it repeatable.","StartupHub is where evidence becomes systems, networks, and growth."],
  ];
  return <section className="starting light" data-tone="paper" id="start"><Reveal className="starting-head"><span className="chapter-label dark">01A / ORIENTATION</span><h2>WHERE ARE<br/><i>YOU NOW?</i></h2><p>Don't follow a template. Start from the truth of what you already have.</p></Reveal><div className="starting-panel" data-reveal><div className="starting-tabs">{items.map(([label],i)=><button key={label} className={i===active?"active":""} onClick={()=>setActive(i)}><small>0{i+1}</small>{label}</button>)}</div><div className="starting-response"><span className="response-no">0{active+1}</span><span className="kicker dark">YOUR NEXT MOVE</span><h3>{items[active][1]}</h3><p>{items[active][2]}</p><Magnetic href="#journey"><span>Enter the journey</span><Arrow/></Magnetic></div></div></section>;
}

function Journey() {
  const ref=useRef<HTMLElement>(null), [index,setIndex]=useState(0),[percent,setPercent]=useState(0);
  useEffect(()=>{let raf=0;const tick=()=>{const el=ref.current;if(!el){raf=requestAnimationFrame(tick);return}const r=el.getBoundingClientRect();const total=Math.max(el.offsetHeight-window.innerHeight,1);const p=Math.min(Math.max(-r.top/total,0),1);setPercent(Math.round(p*100));setIndex(Math.min(STAGES.length-1,Math.floor(p*STAGES.length)));raf=requestAnimationFrame(tick)};raf=requestAnimationFrame(tick);return()=>cancelAnimationFrame(raf)},[]);
  const go=(i:number)=>{const el=ref.current;if(!el)return;const top=el.getBoundingClientRect().top+window.scrollY;const travel=el.offsetHeight-window.innerHeight;window.scrollTo({top:top+travel*((i+.5)/STAGES.length),behavior:"smooth"})};
  const s=STAGES[index];
  return <section className="journey" data-tone="ink" id="journey" ref={ref}><div className="journey-sticky"><div className="journey-top"><span>02 / THE JOURNEY</span><span>{s[0]} / 07</span></div><div className="journey-copy"><span className="stage-kicker">{s[1]}</span><span className="stage-number">{s[0]}</span><h2>{s[2]}</h2><p>{s[3]}</p><a href="#contact">Keep building <Arrow/></a></div><div className="journey-image">{STAGES.map((x,i)=><img key={x[0]} src={x[4]} alt="" className={i===index?"active":""}/>) }<div className="journey-shade"/><div className="journey-image-meta"><span>VIRTUAL STARTUP JOURNEY</span><span>{percent}%</span></div></div><div className="journey-dots">{STAGES.map((x,i)=><button key={x[0]} className={i===index?"active":""} onClick={()=>go(i)}>{x[0]}<i/></button>)}</div></div></section>;
}

function Sphere() {
  const ref=useRef<HTMLElement>(null), cards=useRef<Array<HTMLDivElement|null>>([]), bg=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    let raf=0,cur=0,targetX=0,targetY=0,px=0,py=0;
    const move=(e:PointerEvent)=>{
      const el=ref.current;if(!el)return;
      const r=el.getBoundingClientRect();
      targetX=((e.clientX-r.left)/r.width-.5)*14;
      targetY=((e.clientY-r.top)/r.height-.5)*10;
    };
    const tick=()=>{
      const el=ref.current;
      if(!el){raf=requestAnimationFrame(tick);return}
      const r=el.getBoundingClientRect();
      const total=Math.max(el.offsetHeight-window.innerHeight,1);
      const scrollTarget=Math.min(Math.max(-r.top/total,0),1);
      cur+=(scrollTarget-cur)*.075;
      px+=(targetX-px)*.055; py+=(targetY-py)*.055;

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
      raf=requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove",move,{passive:true});
    raf=requestAnimationFrame(tick);
    return()=>{window.removeEventListener("pointermove",move);cancelAnimationFrame(raf)};
  },[]);
  return <section className="sphere" data-tone="ink" ref={ref}>
    <div className="sphere-sticky">
      <div className="sphere-top"><span>03 / THREE LENSES</span><span>SCROLL — THE SYSTEM ROTATES WITH YOU</span></div>
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
            <img src={img as string} alt=""/>
            <div className="sphere-overlay"/>
            <span className="sphere-card-no">0{i+1}</span>
            <div><small>{title}</small><b>{title==="PROBLEM"?"What deserves to exist?":title==="BUILD"?"What can we make real?":"What survives outside the room?"}</b></div>
          </div>
        )}
      </div>
      <div className="sphere-bottom"><span>PROBLEM → BUILD → IMPACT</span><span>VJ / 03</span></div>
    </div>
  </section>;
}
function Hubs() {
  const [active,setActive]=useState(0);return <section className="hubs light" data-tone="paper"><Reveal className="hubs-head"><span className="chapter-label dark">04 / ENTRY POINTS</span><h2>THREE DOORS.<br/><i>ONE SYSTEM.</i></h2><p>Different starts. Same underlying journey from problem to proof.</p></Reveal><div className="hub-layout" data-reveal><div className="hub-list">{HUBS.map((h,i)=><button key={h[0]} className={i===active?"active":""} onMouseEnter={()=>setActive(i)} onClick={()=>setActive(i)}><span>0{i+1}</span><div><small>{h[1]}</small><b>{h[0]}</b></div><Arrow/></button>)}</div><div className="hub-view">{HUBS.map((h,i)=><img key={h[0]} src={h[3]} alt="" className={i===active?"active":""}/>)}<div><span>{HUBS[active][1]}</span><h3>{HUBS[active][2]}</h3></div></div></div></section>;
}

function WorkField() {
  const ref=useRef<HTMLDivElement>(null);useEffect(()=>{const el=ref.current;if(!el)return;const ns=Array.from(el.querySelectorAll<HTMLElement>("[data-depth]"));const move=(e:PointerEvent)=>{const r=el.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;ns.forEach(n=>{const d=Number(n.dataset.depth||0);n.style.transform=`translate3d(${x*d}px,${y*d}px,0) rotate(${x*d*.03}deg)`})};const leave=()=>ns.forEach(n=>n.style.transform="translate3d(0,0,0)");el.addEventListener("pointermove",move);el.addEventListener("pointerleave",leave);return()=>{el.removeEventListener("pointermove",move);el.removeEventListener("pointerleave",leave)}},[]);return <section className="work-field light" data-tone="paper" ref={ref}><div className="work-top"><span>05 / THE WORK</span><span>THE MESSY MIDDLE</span></div><div className="work-word">BUILD</div><div className="work-pic wp-a" data-depth="52"><img src={IMG.prototype} alt=""/></div><div className="work-pic wp-b" data-depth="-36"><img src={IMG.research} alt=""/></div><div className="work-pic wp-c" data-depth="25"><img src={IMG.pitch} alt=""/></div><div className="work-pic wp-d" data-depth="-49"><img src={IMG.founders} alt=""/></div><span className="work-note wn-a" data-depth="25">question → evidence</span><span className="work-note wn-b" data-depth="-18">prototype / 04</span><span className="work-note wn-c" data-depth="33">iteration / 07</span><div className="work-rule"/><div className="work-caption"><span>THE THING THAT LOOKS LIKE A STARTUP<br/>IS USUALLY A COLLECTION OF ITERATIONS.</span><span>VJ / WORK LOG</span></div></section>;
}

function Ventures() {
  const [active,setActive]=useState(0), v=VENTURES[active];return <section className="ventures light" data-tone="paper" id="ventures"><Reveal className="ventures-head"><span className="chapter-label dark">06 / PROOF</span><h2>IDEAS THAT<br/><i>MOVED.</i></h2><p>Selected ventures and technologies already moving through the ecosystem.</p></Reveal><div className="venture-stage" data-reveal><div className="venture-menu">{VENTURES.map((x,i)=><button key={x[0]} className={i===active?"active":""} onClick={()=>setActive(i)}><span>{x[0]}</span><div><small>{x[1]}</small><b>{x[2]}</b></div><Arrow/></button>)}</div><div className="venture-image"><img src={v[4]} alt="" key={v[0]}/><div><span>{v[1]}</span><span>{v[0]} / 03</span></div></div><div className="venture-copy"><span className="kicker dark">{v[1]}</span><h3>{v[2]}</h3><p>{v[3]}</p><a href="#contact">Explore the build <Arrow/></a></div></div></section>;
}

function Network() {
  const sectionRef=useRef<HTMLElement>(null);
  const headRef=useRef<HTMLDivElement>(null);
  const mapRef=useRef<HTMLDivElement>(null);
  const upperRef=useRef<SVGGElement>(null);
  const lowerRef=useRef<SVGGElement>(null);
  const panelRef=useRef<HTMLDivElement>(null);
  const nodes=useRef<Array<HTMLSpanElement|null>>([]);
  const labels=["STUDENTS","PROBLEMS","RESEARCH","MENTORS","INDUSTRY","CAPITAL","CAMPUS"];

  useEffect(()=>{
    let raf=0;
    const tick=()=>{
      const section=sectionRef.current;
      if(!section){
        raf=requestAnimationFrame(tick);
        return;
      }

      const rect=section.getBoundingClientRect();
      const travel=Math.max(section.offsetHeight-window.innerHeight,1);
      const p=Math.min(Math.max(-rect.top/travel,0),1);
      const open=Math.min(Math.max((p-.30)/.56,0),1);
      const eased=1-Math.pow(1-open,3);

      if(upperRef.current){
        upperRef.current.style.transform=`translate3d(0,${-eased*205}px,0) rotate(${-eased*1.25}deg)`;
      }
      if(lowerRef.current){
        lowerRef.current.style.transform=`translate3d(0,${eased*215}px,0) rotate(${eased*1.4}deg)`;
      }
      if(panelRef.current){
        panelRef.current.style.opacity=String(Math.max(0,eased-.05));
        panelRef.current.style.transform=`translate3d(-50%,${(1-eased)*95}px,0) scale(${.94+eased*.06})`;
      }
      if(mapRef.current){
        mapRef.current.style.setProperty("--network-open",String(eased));
      }

      nodes.current.forEach((node,i)=>{
        if(!node)return;
        const direction=i%2===0?-1:1;
        const amount=eased*(20+(i%3)*10);
        node.style.transform=`translate3d(0,${direction*amount}px,0)`;
        node.style.opacity=String(.42+eased*.48);
      });

      raf=requestAnimationFrame(tick);
    };

    raf=requestAnimationFrame(tick);
    return()=>cancelAnimationFrame(raf);
  },[]);

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
      <div className="network-v16-sticky">
        <div className="network-v16-head" data-reveal ref={headRef}>
          <span className="chapter-label">07 / THE NETWORK</span>
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
              <path className="network-v16-blur" d="M30 535 C165 115 455 55 665 270 S1050 585 1160 95"/>
              <path className="network-v16-line" d="M30 535 C165 115 455 55 665 270 S1050 585 1160 95"/>
              <path className="network-v16-ribbon" d="M10 235 C210 620 505 660 770 385 S1035 70 1190 515"/>
              <path className="network-v16-ribbon-thin" d="M10 235 C210 620 505 660 770 385 S1035 70 1190 515"/>
            </g>

            <g ref={lowerRef} className="network-v16-weave-lower">
              <path className="network-v16-blur" d="M40 175 C235 555 505 665 735 390 S1000 85 1180 520"/>
              <path className="network-v16-line" d="M40 175 C235 555 505 665 735 390 S1000 85 1180 520"/>
              <path className="network-v16-ribbon" d="M25 510 C205 105 485 65 700 320 S1010 610 1185 155"/>
              <path className="network-v16-ribbon-thin" d="M25 510 C205 105 485 65 700 320 S1010 610 1185 155"/>
            </g>

            <path className="network-v16-center-thread" d="M70 360 C325 330 560 390 1130 352"/>
            <path className="network-v16-dotted" d="M145 440 C330 175 590 120 900 245 C705 175 505 245 410 410 C320 560 585 625 935 495"/>
          </svg>

          <div className="network-v16-opening">
            <span>KEEP GOING</span>
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

          <div className="network-v16-caption">
            <span>PEOPLE / KNOWLEDGE / ACCESS / MOMENTUM</span>
            <span>SCROLL DOWN — LET THE WEAVE OPEN</span>
          </div>
        </div>

        <div className="network-v16-bottom">
          <span>35 STARTUPS</span><span>87 FUTURE BUILDERS</span><span>15 RESEARCH PARTNERS</span><span>10+ INDUSTRY MENTORS</span><span>8 FUNDED</span>
        </div>
      </div>
    </section>
  );
}
function Community() {
  const feed=[["05h","KARTHIK","completed","User Validation"],["08h","BHARGAVI","completed","Problem Discovery"],["12h","BHAVISWA","completed","Prototype Development"],["1d","SRIRAM","completed","Research & Feasibility"]];return <section className="community light" data-tone="paper" id="community"><Reveal className="community-head"><span className="chapter-label dark">08 / IN MOTION</span><h2>THE WORK IS<br/><i>STILL MOVING.</i></h2><p>Startup building isn't a before-and-after story. The interesting part is the work between the milestones.</p></Reveal><div className="feed" data-reveal>{feed.map(([time,name,action,stage],i)=><div className="feed-row" key={name+stage}><span>{time}</span><i/><div><b>{name}</b><span>{action} <em>“{stage}”</em></span></div><small>0{i+1}</small></div>)}</div><div className="community-count" data-reveal><strong>847</strong><span>ENTREPRENEURS<br/>ON THE JOURNEY</span></div></section>;
}

function FAQ() {
  const [open,setOpen]=useState<number|null>(null), items=[["What is VJ Startups?","A campus startup platform helping college entrepreneurs turn real-world challenges into innovations through a structured journey."],["Who can join?","Students and emerging builders can discover problems, develop ideas, connect with peers, and progress through the startup journey."],["What is the Virtual Startup Journey?","A seven-stage system covering Problem Discovery, Idea & Concept, Research & Feasibility, User Validation, Prototype Development, MVP & Launch, and Growth & Scaling."],["How do the Hubs work?","ProblemHub focuses on discovery, IdeaHub on solution development, and StartupHub on building and scaling ventures."],["Does the ecosystem include mentors and partners?","Yes. The public platform describes entrepreneurship partners, research partners, industry mentors, and a broader network around founders."]];return <section className="faq light" data-tone="paper" id="faq"><Reveal className="faq-head"><span className="chapter-label dark">09 / QUESTIONS</span><h2>GOOD QUESTIONS<br/><i>CHANGE THINGS.</i></h2><p>Start with the answer that gets you back to building.</p></Reveal><div className="faq-list" data-reveal>{items.map(([q,a],i)=><div className={`faq-item ${open===i?"open":""}`} key={q}><button onClick={()=>setOpen(open===i?null:i)}><span>0{i+1}</span><b>{q}</b><i>{open===i?"−":"+"}</i></button><div><p>{a}</p></div></div>)}</div></section>;
}

const TONES:Record<string,string>={ink:"#080808",paper:"#f0eee8",pink:"#ff4aa7"};

function PageField(){
  const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    let marks:{top:number,tone:string}[]=[];
    const measure=()=>{
      marks=Array.from(document.querySelectorAll<HTMLElement>("[data-tone]")).map(el=>({top:el.getBoundingClientRect().top+window.scrollY,tone:el.dataset.tone||"ink"}));
    };
    measure();
    document.fonts?.ready.then(measure);
    const ro=new ResizeObserver(measure);
    ro.observe(document.body);
    let raf=0,applied="";
    const tick=()=>{
      if(marks.length&&ref.current){
        const focus=window.scrollY+window.innerHeight*.5;
        const w=window.innerHeight*.6;
        let color=TONES[marks[0].tone];
        for(let i=1;i<marks.length;i++){
          const t=ease(band(focus,marks[i].top-w/2,marks[i].top+w/2));
          if(t===0)break;
          color=t===1?TONES[marks[i].tone]:mixHex(TONES[marks[i-1].tone],TONES[marks[i].tone],t);
          if(t<1)break;
        }
        if(color!==applied){ref.current.style.backgroundColor=color;applied=color;}
      }
      raf=requestAnimationFrame(tick);
    };
    raf=requestAnimationFrame(tick);
    return()=>{ro.disconnect();cancelAnimationFrame(raf)};
  },[]);
  return <div className="page-field" ref={ref} aria-hidden="true"/>;
}

export default function Home(){
  const progressRef=useRef<HTMLSpanElement>(null);
  const [navHidden,setNavHidden]=useState(false);
  useEffect(()=>{
    const observer=new IntersectionObserver(entries=>entries.forEach(e=>e.isIntersecting&&e.target.classList.add("revealed")),{threshold:.07});
    document.querySelectorAll("[data-reveal]").forEach(el=>observer.observe(el));
    return()=>observer.disconnect();
  },[]);
  useEffect(()=>{
    let raf=0;
    let lastY=window.scrollY;
    let hidden=false;
    const tick=()=>{
      const y=window.scrollY;
      const max=document.documentElement.scrollHeight-window.innerHeight;
      if(progressRef.current)progressRef.current.style.transform=`scaleX(${max>0?y/max:0})`;

      const delta=y-lastY;
      if(y<90){
        hidden=false;
      }else if(delta>7){
        hidden=true;
      }else if(delta<-7){
        hidden=false;
      }
      setNavHidden(hidden);
      lastY=y;
      raf=requestAnimationFrame(tick);
    };

    raf=requestAnimationFrame(tick);
    return()=>cancelAnimationFrame(raf);
  },[]);
  return <><Intro/><Cursor/><SmoothScroll/><PageField/><div className="global-progress"><span ref={progressRef}/></div><header className={`nav ${navHidden?"nav-hidden":""}`}><nav><Mark/><div className="links"><a href="#journey">Journey</a><a href="#proof">Experience</a><a href="#ventures">Ventures</a><a href="#network">Network</a></div><div className="nav-right"><span>HYDERABAD / IN</span><Magnetic href="#contact"><span>Start building</span><Arrow/></Magnetic></div><button className="menu" aria-label="Menu"><span/><span/></button></nav></header><main><Hero/><section className="statement dark" data-tone="ink"><Reveal><span className="chapter-label">00 / THE PREMISE</span><h2>DON&apos;T START<br/><span>WITH THE IDEA.</span></h2><p>Start with the thing that keeps breaking.</p></Reveal></section><Morph/><Starting/><Journey/><Sphere/><Hubs/><WorkField/><Ventures/><Network/><Community/><section className="recognition dark" data-tone="ink"><Reveal><span className="chapter-label">08A / SIGNALS</span><h2>PROOF IS A<br/><i>MILESTONE.</i></h2><p>Recognition and funding are signals along the journey, not the destination.</p></Reveal><div className="recognition-list"><div><span>2024</span><b>Best Innovation Award</b><small>National Startup Competition</small></div><div><span>₹2.8Cr</span><b>Total funding raised</b><small>Across the current funded portfolio</small></div><div><span>08</span><b>Funded startups</b><small>Ventures that moved beyond the idea stage</small></div></div></section><FAQ/><section className="contact-v13 dark" data-tone="pink" id="contact">
  <div className="contact-v13-back" aria-hidden="true">
    <span>QUESTION</span><span>BUILD</span><span>PROVE</span><span>IMPACT</span>
  </div>
  <Reveal className="contact-v13-main">
    <span className="chapter-label">10 / YOUR TURN</span>
    <h2>
      <span className="contact-line">WHAT <i>WILL</i></span>
      <span className="contact-line accent">YOU <i>BUILD?</i></span>
    </h2>
    <Magnetic href="/login"><span>Start your journey</span><Arrow/></Magnetic>
  </Reveal>
  <div className="contact-meta"><span>HYDERABAD / INDIA</span><span>PROBLEMS → IDEAS → STARTUPS</span><span>2026</span></div>
</section>
<footer className="footer-v13" data-tone="ink">
  <div className="footer-word"><span>VJ</span><i>STARTUPS</i></div>
  <div className="footer-orbits"><span/><span/><span/></div>
  <div className="footer-grid">
    <div className="footer-brand"><Mark/></div>
    <div><b>EXPLORE</b><a href="#start">Start here</a><a href="#journey">Journey</a><a href="#ventures">Ventures</a></div>
    <div><b>NETWORK</b><a href="#network">Mentors</a><a href="#network">Research</a><a href="#network">Industry</a></div>
    <div><b>RESOURCES</b><a href="#community">Stories</a><a href="#faq">FAQ</a><a href="#contact">Contact</a></div>
  </div>
  <div className="footer-bottom"><span>© 2026 VJ Startups</span><span>BUILD WHAT MATTERS.</span><a href="#top">BACK TO TOP ↑</a></div>
</footer></main></>;
}
