
export default function Nav({loggedIn=false, admin=false}) {
  return <nav className="nav">
    <a className="brand" href="/">◇ PREMIUM PEPTIDES</a>
    <div className="navlinks">
      {loggedIn && <a className="btn secondary" href="/store">Store</a>}
      {admin && <a className="btn secondary" href="/admin">Admin</a>}
      {!loggedIn && <a className="btn secondary" href="/login">Member login</a>}
      {!loggedIn && <a className="btn" href="/signup">Referral sign up</a>}
      {loggedIn && <form action="/api/signout" method="post"><button type="submit" className="secondary">Sign out</button></form>}
    </div>
  </nav>
}
