import {useEffect,useState} from 'react';
import {base44,configured,disconnect} from './api';
import SignIn from './SignIn';
import EmployeePortal from '../app/employee/EmployeePortal';
import AdminEmployeeDashboard from '../app/office/AdminEmployeeDashboard';
import OfficeDashboard from '../app/office/OfficeDashboard';
import DemoDashboard from '../app/demo/DemoDashboard';
import FacilitiesHome from '../app/facilities/FacilitiesHome';
import InactiveRecords from '../app/inactive/InactiveRecords';
import FeedbackWorkspace from '../app/facility-feedback/FeedbackWorkspace';
import ContractAgreement from '../app/facility-contract/ContractAgreement';
import TrainingVideos from '../app/training/TrainingVideos';
import EmploymentAccessMonitor from '../app/EmploymentAccessMonitor';
import {themeVariables,defaultTheme} from '../lib/theme';
export default function App(){const [session,setSession]=useState<any>(null),[error,setError]=useState(''),[ready,setReady]=useState(false),[employment,setEmployment]=useState<any>(null),[demoAllowed,setDemoAllowed]=useState(false);const path=window.location.pathname;useEffect(()=>{for(const [name,value]of Object.entries(themeVariables(defaultTheme)))document.documentElement.style.setProperty(name,value);let active=true;async function load(){if(!configured||(path==='/signin'||path.includes('reset-password'))){setReady(true);return;}try{await base44.auth.me();const r=await fetch('/api/session');const x=await r.json();if(!r.ok)throw new Error(x.error);if(!active)return;setSession(x);if(['quit','terminated'].includes(x.status)&&!x.office){const er=await fetch('/api/employment?self=1');if(!er.ok)throw new Error('Employment Records Unavailable');setEmployment(await er.json());}if(path.startsWith('/demo/')){const r=await fetch('/api/demo-access?token='+encodeURIComponent(path.split('/')[2]||''));if(!r.ok)throw new Error('This Demo Link Has Expired Or Was Revoked');setDemoAllowed(true);}const tr=await fetch('/api/theme');if(tr.ok){const t=await tr.json();if(t.colors)for(const [name,value]of Object.entries(themeVariables(t.colors)))document.documentElement.style.setProperty(name,value);}}catch(e:any){if(e.status===401||e.response?.status===401){setSession(null);}else setError(e.message||'Could Not Verify Account Access');}finally{if(active)setReady(true);}}void load();return()=>{active=false;}},[path]);
 if(!ready)return <main className="employee-content"><p role="status">Opening Always Nursing…</p></main>;
 if(!configured)return <><p className="banner">Link This Project To Your Base44 App And Build Through The Base44 CLI To Enable Sign-In.</p><SignIn/></>;
 if(error)return <main className="employee-content"><section className="panel"><h1>Unable To Open This Page</h1><p role="alert">{error}</p><button onClick={()=>window.location.reload()}>Retry</button><a href="/signin">Sign In</a></section></main>;
 if(path==='/signout')return <main className="employee-content"><h1>Sign Out Of Always Nursing</h1><button className="primary" onClick={()=>{disconnect();base44.auth.logout('/signin')}}>Sign Out</button></main>;
 if(!session)return <SignIn/>;
 if(employment&&!session.office){if(path==='/shift-preview')return <InactiveRecords {...employment}/>;return <><EmploymentAccessMonitor/><InactiveRecords {...employment}/></>;}
 let view:React.ReactNode;
 if(path==='/office'||path==='/'){view=session.office?<OfficeDashboard/>:<EmployeePortal displayName={session.user.displayName}/>;}
 else if(path==='/employee')view=session.office?<AdminEmployeeDashboard/>:<EmployeePortal displayName={session.user.displayName}/>;
 else if(path==='/office/demo')view=session.office?<DemoDashboard admin/>:<p>Agency Access Required</p>;
 else if(path.startsWith('/demo/'))view=demoAllowed?<DemoDashboard token={path.split('/')[2]}/>:<p>Demo Link Not Authorized</p>;
 else if(path==='/facilities')view=<div className="facilities-page-background"><main className="facility-contract-page"><FacilitiesHome office={session.office}/></main></div>;
 else if(path==='/facility-contract')view=<ContractAgreement office={session.office}/>;
 else if(path==='/facility-feedback')view=<FeedbackWorkspace office={session.office}/>;
 else if(path==='/training')view=<TrainingVideos/>;
 else view=session.office&&path.startsWith('/office')?<OfficeDashboard/>:<EmployeePortal displayName={session.user.displayName}/>;
 return <><EmploymentAccessMonitor/>{view}{session.office&&<section className="panel" style={{margin:24}}><h2>Agency Records Backup</h2><p>Download A Records Snapshot For Secure Agency Storage. Uploaded File Contents Must Be Backed Up Separately.</p><a className="button-link" href="/api/native-backup" download="Always-Nursing-Records.sqlite3">Download Records Backup</a></section>}</>;
}
