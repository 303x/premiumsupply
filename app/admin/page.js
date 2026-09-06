
'use client';
import { useEffect,useState } from 'react';
import { createClient } from '../../lib/supabaseBrowser';

export default function Admin(){
  const [ready,setReady]=useState(false);
  const [allowed,setAllowed]=useState(false);
  const [products,setProducts]=useState([]);
  const [members,setMembers]=useState([]);
  const supabase=createClient();

  async function refresh(){
    const {data:{user}}=await supabase.auth.getUser();
    if(!user){window.location='/login';return;}
    const {data:profile}=await supabase.from('profiles').select('*').eq('id',user.id).single();
    if(!profile || profile.role!=='admin'){setReady(true);return;}
    setAllowed(true);setReady(true);
    const {data:p}=await supabase.from('products').select('*').order('created_at',{ascending:false});
    const {data:m}=await supabase.from('profiles').select('*').order('created_at',{ascending:false});
    setProducts(p||[]);setMembers(m||[]);
  }
  useEffect(()=>{refresh()},[]);

  async function saveProduct(e){
    e.preventDefault();
    const fd=new FormData(e.currentTarget);
    let image_url='';
    const file=fd.get('image');
    if(file && file.size){
      const path=`products/${Date.now()}-${file.name.replace(/\s+/g,'-')}`;
      const {error:upErr}=await supabase.storage.from('product-images').upload(path,file);
      if(upErr){alert(upErr.message);return;}
      const {data}=supabase.storage.from('product-images').getPublicUrl(path);
      image_url=data.publicUrl;
    }
    const {error}=await supabase.from('products').insert({
      name:fd.get('name'),size:fd.get('size'),price:Number(fd.get('price')||0),
      stock_status:fd.get('stock_status'),description:fd.get('description'),
      additional_info:fd.get('additional_info'),dosing:fd.get('dosing'),
      image_url,active:true
    });
    if(error){alert(error.message);return;}
    e.currentTarget.reset();refresh();
  }

  async function approve(id,status){
    const {error}=await supabase.from('profiles').update({status}).eq('id',id);
    if(error) alert(error.message); else refresh();
  }

  async function removeProduct(id){
    if(!confirm('Remove this product?')) return;
    const {error}=await supabase.from('products').delete().eq('id',id);
    if(error) alert(error.message); else refresh();
  }

  if(!ready) return <main className="shell"><p>Loading…</p></main>;
  if(!allowed) return <main className="shell"><div className="card"><h1>Admin only</h1></div></main>;

  return <main className="shell">
    <div className="nav"><a className="brand" href="/">◇ PREMIUM PEPTIDES</a><div className="navlinks"><a className="btn secondary" href="/store">Store</a></div></div>
    <section className="section">
      <div className="card">
        <h1>Product Manager</h1>
        <form onSubmit={saveProduct}>
          <div className="grid">
            <label>Product name<input name="name" required/></label>
            <label>Strength / size<input name="size"/></label>
            <label>Price (AUD)<input name="price" type="number" step="0.01"/></label>
            <label>Stock status<input name="stock_status" defaultValue="In stock"/></label>
          </div>
          <label>Product image<input name="image" type="file" accept="image/png,image/jpeg,image/webp"/></label>
          <label>Description<textarea name="description" rows="3"/></label>
          <label>Additional information<textarea name="additional_info" rows="4"/></label>
          <label>Dosing<textarea name="dosing" rows="4"/></label>
          <button style={{marginTop:16}}>Add product</button>
        </form>
      </div>
    </section>

    <section className="section">
      <div className="card">
        <h2>Products</h2>
        <table className="table"><thead><tr><th>Product</th><th>Price</th><th></th></tr></thead>
        <tbody>{products.map(p=><tr key={p.id}><td>{p.name} {p.size}</td><td>${Number(p.price||0).toFixed(2)}</td><td><button className="secondary" onClick={()=>removeProduct(p.id)}>Remove</button></td></tr>)}</tbody></table>
      </div>
    </section>

    <section className="section">
      <div className="card">
        <h2>Member approvals</h2>
        <table className="table"><thead><tr><th>Member</th><th>Referrer</th><th>Status</th><th></th></tr></thead>
        <tbody>{members.filter(m=>m.role!=='admin').map(m=><tr key={m.id}>
          <td>{m.full_name}<br/><span className="muted">{m.email}</span></td>
          <td>{m.referrer_name}</td><td>{m.status}</td>
          <td><div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            <button onClick={()=>approve(m.id,'approved')}>Approve</button>
            <button className="secondary" onClick={()=>approve(m.id,'suspended')}>Suspend</button>
          </div></td>
        </tr>)}</tbody></table>
      </div>
    </section>
  </main>
}
