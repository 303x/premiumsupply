
import { redirect } from 'next/navigation';
import { createClient } from '../../lib/supabaseServer';
import Nav from '../../components/Nav';

export default async function Store(){
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) redirect('/login');

  const {data:profile}=await supabase.from('profiles').select('*').eq('id',user.id).single();
  if(!profile || profile.status!=='approved'){
    return <main className="shell"><Nav loggedIn/><div className="card"><h1>Access pending</h1><p className="muted">Your referral is still awaiting manual approval.</p></div></main>;
  }

  const {data:products}=await supabase.from('products').select('*').eq('active',true).order('created_at',{ascending:false});

  return <main className="shell">
    <Nav loggedIn admin={profile.role==='admin'}/>
    <section className="section">
      <h1>Member Store</h1>
      <div className="grid">
        {(products||[]).map(p=><article className="card product" key={p.id}>
          {p.image_url ? <img src={p.image_url} alt={p.name}/> : <div className="product-image-wrap">Product image</div>}
          <h2>{p.name}</h2>
          <span className="badge">{p.size||''}</span>
          <p>{p.description}</p>
          <div className="price">${Number(p.price||0).toFixed(2)} AUD</div>
          <details><summary>Additional Information</summary><p className="muted">{p.additional_info||'No additional information added.'}</p></details>
          <details><summary>Dosing</summary><p className="muted">{p.dosing||'No dosing information added.'}</p></details>
        </article>)}
      </div>
    </section>
  </main>
}
