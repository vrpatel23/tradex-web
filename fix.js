const fs = require('fs')

const content = `import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{fontFamily:'system-ui,sans-serif',minHeight:'100vh',background:'#fff'}}>
      <nav style={{position:'sticky',top:0,background:'#fff',borderBottom:'1px solid #e5e7eb',padding:'0 24px'}}>
        <div style={{maxWidth:1200,margin:'0 auto',height:64,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <Link href="/" style={{display:'flex',alignItems:'center',gap:10,textDecoration:'none'}}>
            <div style={{width:36,height:36,background:'#16a34a',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <span style={{color:'#fff',fontWeight:700,fontSize:14}}>T</span>
            </div>
            <span style={{fontSize:18,fontWeight:600,color:'#111'}}>TradeX</span>
          </Link>
          <div style={{display:'flex',gap:8}}>
            <Link href="/login" style={{padding:'8px 16px',fontSize:14,border:'1px solid #e5e7eb',borderRadius:8,color:'#374151',textDecoration:'none'}}>Sign in</Link>
            <Link href="/login" style={{padding:'8px 16px',fontSize:14,background:'#16a34a',color:'#fff',borderRadius:8,textDecoration:'none',fontWeight:500}}>Start selling</Link>
          </div>
        </div>
      </nav>
      <div style={{maxWidth:1200,margin:'0 auto',padding:'80px 24px'}}>
        <h1 style={{fontSize:52,fontWeight:700,lineHeight:1.15,marginBottom:20}}>
          Buy and sell wholesale globally
        </h1>
        <p style={{fontSize:18,color:'#6b7280',marginBottom:36}}>
          India B2B wholesale marketplace. Real transactions, not just phone numbers.
        </p>
        <div style={{display:'flex',gap:12,marginBottom:48}}>
          <Link href="/login" style={{padding:'14px 32px',background:'#16a34a',color:'#fff',borderRadius:12,fontWeight:600,fontSize:15,textDecoration:'none'}}>Start selling free</Link>
          <Link href="/browse" style={{padding:'14px 32px',border:'1px solid #e5e7eb',color:'#374151',borderRadius:12,fontSize:15,textDecoration:'none'}}>Browse products</Link>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
          {[{n:'Cotton',i:'🧵',s:'cotton-textile'},{n:'Spices',i:'🌶',s:'spices-condiments'},{n:'Grains',i:'🌾',s:'grains-rice-pulses'},{n:'Seafood',i:'🐟',s:'seafood-marine'},{n:'Chemicals',i:'⚗️',s:'chemicals-pharma'},{n:'Engineering',i:'⚙️',s:'engineering-industrial'},{n:'Handicrafts',i:'🏺',s:'handicrafts-home-decor'},{n:'Gems',i:'💎',s:'gems-jewellery-leather'}].map(c => (
            <Link key={c.s} href={'/browse?category='+c.s} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10,padding:24,border:'1px solid #e5e7eb',borderRadius:16,textDecoration:'none',color:'#111'}}>
              <span style={{fontSize:32}}>{c.i}</span>
              <span style={{fontSize:13,fontWeight:500}}>{c.n}</span>
            </Link>
          ))}
        </div>
      </div>
      <div style={{textAlign:'center',padding:'32px',color:'#9ca3af',fontSize:13,borderTop:'1px solid #e5e7eb',marginTop:40}}>
        2025 TradeX. All rights reserved.
      </div>
    </div>
  )
}`

fs.writeFileSync('src/app/page.tsx', content)
console.log('Done!')
