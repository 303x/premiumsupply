
import Nav from '../components/Nav';
export default function Home(){
  return <main className="shell">
    <Nav />
    <section className="hero">
      <div>
        <div className="eyebrow">Private research access</div>
        <h1>PREMIUM<br/>PEPTIDES</h1>
        <p className="muted">Referral-only access to a private research catalogue. New accounts require a referral from an existing member and manual approval before access is granted.</p>
        <div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:20}}>
          <a className="btn" href="/login">Member login</a>
          <a className="btn secondary" href="/signup">Referral sign up</a>
        </div>
      </div>
      <div className="card">
        <div style={{fontSize:72}}>◇</div>
        <h2>QUALITY • PURITY • PERFORMANCE</h2>
        <p className="muted">Private by design. Catalogue and pricing are available only to approved members.</p>
      </div>
    </section>
  </main>
}
