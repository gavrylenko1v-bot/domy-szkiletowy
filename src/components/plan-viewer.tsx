"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "./icons";

export function PlanViewer({name,slug,floors}:{name:string;slug:string;floors:number}) {
  const [level,setLevel] = useState(0), [open,setOpen] = useState(false), [zoom,setZoom] = useState(100);
  const modal = useRef<HTMLDialogElement>(null), trigger=useRef<HTMLButtonElement>(null);
  const src = `/images/houses/${slug}/plan-${level}.svg`;
  useEffect(()=>{
    if(!open) return;
    const overflow=document.body.style.overflow;
    document.body.style.overflow="hidden";
    modal.current?.showModal();
    return ()=>{document.body.style.overflow=overflow;};
  },[open]);
  const close=()=>{modal.current?.close();setOpen(false);trigger.current?.focus();};
  const tabs=<div className="plan-tabs" role="group" aria-label="Kondygnacja rzutu">{Array.from({length:floors},(_,i)=><button key={i} type="button" aria-pressed={level===i} onClick={()=>setLevel(i)}>{i===0?"Parter":"Poddasze"}</button>)}</div>;
  return <div className="plan-viewer">
    {!open && tabs}
    <Image src={src} alt={`${name} — rzut koncepcyjny, ${level ? "poddasze" : "parter"}, wymiary i pomieszczenia`} width={1400} height={1000} className="plan-preview" unoptimized />
    <button className="button outline plan-expand" ref={trigger} onClick={()=>{setZoom(window.innerWidth<650?300:100);setOpen(true);}}>Powiększ rzut <ArrowUpRight size={18}/></button>
    {open && <dialog className="plan-dialog" ref={modal} aria-label={`Rzut ${name} — powiększenie`} onCancel={e=>{e.preventDefault();close();}}>
      <div className="plan-dialog-header"><strong>{name} · rzut koncepcyjny</strong><button className="button outline" autoFocus onClick={close}>Zamknij ×</button></div>
      <div className="plan-tools">{tabs}<label>Powiększenie <input type="range" min="100" max="400" step="25" value={zoom} onChange={e=>setZoom(Number(e.target.value))}/><output>{zoom}%</output></label></div>
      <p className="plan-help">Przesuń rysunek, aby zobaczyć szczegóły. Wymiary i powierzchnie podano w legendzie.</p>
      <div className="plan-pan" tabIndex={0} aria-label="Przewijany rzut domu">
        <Image src={src} alt={`Powiększony rzut ${name}`} width={1400} height={1000} unoptimized style={{width:`${zoom}%`,maxWidth:"none",height:"auto"}} />
      </div>
    </dialog>}
  </div>;
}
