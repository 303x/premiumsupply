
'use client';
import { useState } from 'react';
import { createClient } from '../../lib/supabaseBrowser';

export default function Signup(){
  const [msg,setMsg]=useState('');
  async function submit(e){
    e.preventDefault();
    const fd=new FormData(e.currentTarget);
    const supabase=createClient();
    const {data,error}=await supabase.auth.signUp({
      email:fd.get('email'),
      password:fd.get('password'),
      options:{data:{full_name:fd.get('full_name'),referrer_name:fd.get('referrer_name')}}
    });
    if(error){setMsg(error.message);return;}
    if(data.user){
      await supabase.from('profiles').upsert({
        id:data.user.id,
        email:fd.get('email'),
        full_name:fd.get('full_name'),
        referrer_name:fd.get('referrer_name'),
        status:'pending',
        role:'member'
      });
    }
    setMsg('Registration received. Access remains pending until the referral is checked and the account is approved.');
    e.currentTarget.reset();
  }
  return <main className="shell">
    <a href="/">← Home</a>
    <section className="section form">
      <div className="card">
        <h1>Referral sign up</h1>
        <p className="muted">Membership is referral-only. Enter the name of the existing member who referred you.</p>
        <form onSubmit={submit}>
          <label>Full name<input name="full_name" required/></label>
          <label>Email<input name="email" type="email" required/></label>
          <label>Create password<input name="password" type="password" minLength="8" required/></label>
          <label>Referring member<input name="referrer_name" required/></label>
          <button style={{marginTop:16}}>Request membership</button>
        </form>
        {msg && <p className="notice">{msg}</p>}
      </div>
    </section>
  </main>
}
