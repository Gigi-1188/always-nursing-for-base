import {createClient} from '@base44/sdk';
import {Actor} from 'base44:runtime/actors';
import {secrets} from 'base44:runtime';
import initSql from '../../../native/vendor/sql-asm.js';
import {NativeEngine} from '../../../native/engine.ts';
import type {ApiRequest} from '../../../native/dispatch.ts';
// One canonical room. Do not change this ID on upgrades; that would create an empty database.
const ROOM='always-nursing-records-v1';
const MAX_PARTS=350,PART_SIZE=48000;
type Connection={id:string;identity:{type:string;userId?:string};send:(x:unknown)=>void;reject:(code:number,reason:string)=>void};
export default class StaffingHub extends Actor<any,any>{
 private engine:NativeEngine|null=null;
 private uploads=new Map<string,{id:string;parts:string[];next:number;total:number;bytes:number;at:number}>();
 private rates=new Map<string,{count:number;start:number}>();
 async handleStart(){if(this.instanceId!==ROOM)return;const SQL=await initSql();this.engine=new NativeEngine(SQL,this.storage,this.client,()=>({STAFF_AUTH_IDS:secrets.get('STAFF_AUTH_IDS'),STAFF_EMAILS:secrets.get('STAFF_EMAILS'),CUSTOMER_DEMO_HASH:secrets.get('CUSTOMER_DEMO_HASH'),CUSTOMER_DEMO_EXPIRES:secrets.get('CUSTOMER_DEMO_EXPIRES')}),async token=>{const config=this.client.getConfig();return createClient({appId:config.appId,serverUrl:config.serverUrl,token}).auth.me();});await this.engine.initialize();}
 handleConnect(conn:Connection){if(this.instanceId!==ROOM||conn.identity?.type!=='authenticated'||!conn.identity.userId){conn.reject(403,'Always Nursing Sign-In Required');return;}conn.send({type:'ready'});}
 async handleMessage(conn:Connection,msg:any){if(this.instanceId!==ROOM||conn.identity?.type!=='authenticated'||!conn.identity.userId)return;let id='';try{
  if(!msg||msg.type!=='part'||typeof msg.id!=='string'||!/^[a-f0-9-]{36}$/.test(msg.id)||!Number.isInteger(msg.index)||!Number.isInteger(msg.total)||msg.total<1||msg.total>MAX_PARTS||typeof msg.data!=='string'||msg.data.length>PART_SIZE)throw new Error('Invalid Transport Message');id=msg.id;
  for(const [key,value]of this.uploads)if(Date.now()-value.at>120000)this.uploads.delete(key);
  const key=conn.id+':'+id;let pending=this.uploads.get(key);
  if(msg.index===0){const r=this.rates.get(conn.identity.userId);if(r&&Date.now()-r.start<60000&&r.count>=240)throw new Error('Please Wait Before Retrying');this.rates.set(conn.identity.userId,{count:r&&Date.now()-r.start<60000?r.count+1:1,start:r&&Date.now()-r.start<60000?r.start:Date.now()});if(this.uploads.size>=8)throw new Error('Uploads Busy; Please Retry');pending={id,parts:[],next:0,total:msg.total,bytes:0,at:Date.now()};this.uploads.set(key,pending);}
  if(!pending||pending.total!==msg.total||pending.next!==msg.index)throw new Error('Upload Order Changed; Please Retry');if([...this.uploads.values()].reduce((n,x)=>n+x.bytes,0)+msg.data.length>24000000)throw new Error("Uploads Busy");pending.parts.push(msg.data);pending.next++;pending.bytes+=msg.data.length;
  if(pending.next!==msg.total)return;this.uploads.delete(key);const input=JSON.parse(pending.parts.join('')) as ApiRequest;if(input.id!==id)throw new Error('Request ID Changed');if(!this.engine)throw new Error('Backend Is Starting; Please Retry');const response=await this.engine.run(conn.identity.userId,input);const encoded=JSON.stringify(response),total=Math.ceil(encoded.length/PART_SIZE);for(let i=0;i<total;i++)conn.send({type:'reply-part',id,index:i,total,data:encoded.slice(i*PART_SIZE,(i+1)*PART_SIZE)});
 }catch{if(id)this.uploads.delete(conn.id+":"+id);conn.send({type:'error',id,message:'Could Not Complete This Request. Please Refresh And Retry.'});}}
 handleClose(conn:Connection){for(const key of this.uploads.keys())if(key.startsWith(conn.id+':'))this.uploads.delete(key);}
 handleTick(){}
}
