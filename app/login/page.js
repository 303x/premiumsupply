
'use client';
import { useState } from 'react';
import { createClient } from '../../lib/supabaseBrowser';

export default function Login(){
  const [msg,setMsg]=useState('');
  async function submit(e){
    e.preventDefault();
    const fd=new FormData(e.currentTarget);
    const supabase=createClient();
    const {error}=await supabase.auth.signInWithPassword({
      email:fd.get('email'),password:fd.get('password')
    });
    if(error){setMsg(error.message);return;}
    window.location='/store';
  }
  return <main className="shell">
    <a href="/">← Home</a>
    <section className="section form">
      <div className="card">
        <h1>Member login</h1>
        <form onSubmit={submit}>
          <label>Email<input name="email" type="email" required/></label>
          <label>Password<input name="password" type="password" required/></label>
          <button style={{marginTop:16}}>Sign in</button>
        </form>
        {msg && <p className="notice">{msg}</p>}
        <p className="muted">New member? <a href="/signup"><u>Referral sign up</u></a></p>
      </div>
    </section>
  </main>
}
