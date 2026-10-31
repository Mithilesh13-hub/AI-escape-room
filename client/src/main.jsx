import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

class AppErrorBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error) { console.error('Application render failed:', error); }
  render() {
    if (this.state.error) return <main style={{minHeight:'100vh',background:'#11110f',color:'#eeeae1',padding:'12vh 8vw',fontFamily:'sans-serif'}}><p style={{color:'#d9a962',letterSpacing:'.12em',fontSize:12}}>AFTER HOURS · STARTUP ERROR</p><h1 style={{fontFamily:'Georgia,serif',fontWeight:400}}>The door didn’t open.</h1><p style={{maxWidth:620,color:'#c3bcae',lineHeight:1.7}}>The page hit a client-side error while rendering. Refresh once; if it persists, the message below identifies what failed.</p><pre style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere',maxWidth:800,padding:18,background:'#1b1a16',border:'1px solid #55452d',color:'#f0c58a'}}>{this.state.error.message}</pre><button onClick={()=>location.reload()} style={{padding:'12px 18px',marginTop:12,background:'#d9a962',border:0,cursor:'pointer'}}>Refresh the page</button></main>;
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(<React.StrictMode><AppErrorBoundary><App/></AppErrorBoundary></React.StrictMode>);
