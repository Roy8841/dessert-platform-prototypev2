'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Heart, Store, User, Star, Factory } from 'lucide-react'

const COLORS = {
  primary: '#FFD479',
  text: '#6B4E37',
  bg: '#FFF8F3',
}

const MOQ_TIERS = [
  { qty: 12, unit: 2.8 },
  { qty: 36, unit: 2.4 },
  { qty: 72, unit: 2.0 },
]

const SAMPLE_PRODUCTS = [
  { id: 1, name: 'Lemon Butter Bar', price: 3.5, storage: '상온', baker: '가연', img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b' },
  { id: 2, name: 'Peanut Butter Bar', price: 3.5, storage: '상온', baker: '민수', img: 'https://images.unsplash.com/photo-1541782814453-c7c4e6c1e1a9' },
  { id: 3, name: 'Dark Choco Bar', price: 3.8, storage: '상온', baker: '소윤', img: 'https://images.unsplash.com/photo-1542826438-3094dc2c1f33' },
  { id: 4, name: 'Matcha Choc-Chip', price: 3.8, storage: '상온', baker: '유진', img: 'https://images.unsplash.com/photo-1541782814453-c7c4e6c1e1a9' },
  { id: 5, name: 'Plain Butter Bar', price: 3.2, storage: '상온', baker: '가연', img: 'https://images.unsplash.com/photo-1511910849309-0dffb9423d5b' },
  { id: 6, name: 'Earl Grey Bar', price: 3.6, storage: '상온', baker: '민수', img: 'https://images.unsplash.com/photo-1604908176997-123ed9bdfb5d' },
]

export default function Page() {
  const [role, setRole] = useState<'guest'|'consumer'|'buyer'|'seller'>('guest')
  const [likes, setLikes] = useState<Record<number, boolean>>({})
  const [b2bOpen, setB2bOpen] = useState<number|null>(null)

  return (
    <div className="min-h-screen">
      <Header role={role} onReset={() => setRole('guest')} />
      {role === 'guest' ? (
        <>
          <Hero onPrimary={() => scrollToId('featured')} onSecondary={() => scrollToId('feed')} />
          <FeaturedBakers />
          <Feed role={role} likes={likes} onLike={(id)=>setLikes(s=>({...s,[id]:!s[id]}))} onB2B={(id)=>setB2bOpen(id)} />
          <RoleCTA onSelect={setRole} />
          <BrandMessage />
        </>
      ) : (
        <>
          <HeroLogged role={role} onExplore={()=>scrollToId('feed')} />
          <FeaturedBakers compact />
          <Feed role={role} likes={likes} onLike={(id)=>setLikes(s=>({...s,[id]:!s[id]}))} onB2B={(id)=>setB2bOpen(id)} />
          <BrandMessage />
        </>
      )}

      {b2bOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={()=>setB2bOpen(null)}>
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-xl" onClick={(e)=>e.stopPropagation()}>
            <h3 className="text-xl font-semibold mb-2">함께하기(납품 문의) 📦</h3>
            <p className="text-sm mb-4">MOQ 기준 도매 단가표 — 선택 시 문의서에 자동 반영됩니다.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {MOQ_TIERS.map(t => (
                <div key={t.qty} className="border rounded-xl p-3 hover:shadow">
                  <div className="text-sm">{t.qty}ea</div>
                  <div className="text-2xl font-bold">${t.unit.toFixed(2)}</div>
                  <div className="text-xs opacity-70">총액 {(t.qty * t.unit).toFixed(2)}</div>
                </div>
              ))}
            </div>
            <InquiryForm onClose={()=>setB2bOpen(null)} />
          </div>
        </div>
      )}

      <StickyCTA role={role} onRoleChange={setRole} />
    </div>
  )
}

function Header({ role, onReset }:{ role:string, onReset:()=>void }) {
  return (
    <header className="w-full h-16 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40 backdrop-blur bg-[#FFF8F3]/80">
      <div className="flex items-center gap-2">
        <Store size={22} />
        <span className="font-semibold">Butter&Story</span>
      </div>
      <div className="hidden md:flex items-center gap-6 text-sm">
        <a href="#featured" className="hover:opacity-70">스토리</a>
        <a href="#feed" className="hover:opacity-70">디저트</a>
        <a href="#brand" className="hover:opacity-70">Our Mission</a>
      </div>
      <div className="flex items-center gap-3">
        {role === 'guest' ? (
          <>
            <button className="px-3 py-1.5 text-sm rounded-full border">로그인</button>
            <button className="px-3 py-1.5 text-sm rounded-full" style={{ backgroundColor: COLORS.primary }}>회원가입</button>
          </>
        ) : (
          <button onClick={onReset} className="px-3 py-1.5 text-sm rounded-full border flex items-center gap-2">
            <User size={16} /> {role === 'consumer' ? '소비자' : role === 'buyer' ? '바이어' : '셀러'} 모드
          </button>
        )}
      </div>
    </header>
  )
}

function Hero({ onPrimary, onSecondary }:{ onPrimary:()=>void, onSecondary:()=>void }) {
  return (
    <section className="px-4 md:px-8 py-12 md:py-16 text-center" style={{ background: `linear-gradient(180deg, ${COLORS.bg} 0%, #FFE9BE 90%)` }}>
      <h1 className="text-2xl md:text-4xl font-bold mb-3">당신의 한 입이, 누군가의 꿈을 굽습니다.</h1>
      <p className="max-w-2xl mx-auto opacity-90 mb-6">로컬 홈베이커의 진심이 담긴 디저트를 당신 근처에서 만나보세요.</p>
      <div className="flex items-center justify-center gap-3">
        <button onClick={onPrimary} className="px-4 py-2 rounded-full" style={{ backgroundColor: COLORS.primary }}>🧁 홈베이커 이야기 보기</button>
        <button onClick={onSecondary} className="px-4 py-2 rounded-full border">🍪 디저트 둘러보기</button>
      </div>
    </section>
  )
}

function HeroLogged({ role, onExplore }:{ role:string, onExplore:()=>void }) {
  const label = role === 'consumer' ? '응원 중인 베이커 2명' : role === 'buyer' ? '납품 요청 1건 대기 중' : '오늘 제작 3건'
  return (
    <section className="px-4 md:px-8 py-8 text-center border-b">
      <p className="text-sm opacity-80 mb-2">{label}</p>
      <h2 className="text-xl md:text-3xl font-semibold mb-3">사람의 이야기에서 시작되는 달콤한 파트너십</h2>
      <button onClick={onExplore} className="px-4 py-2 rounded-full" style={{ backgroundColor: COLORS.primary }}>지금 둘러보기</button>
    </section>
  )
}

function FeaturedBakers({ compact=false }:{ compact?:boolean }) {
  return (
    <section id="featured" className={`px-4 md:px-8 ${compact ? 'py-8':'py-12'}`}>
      <div className="flex items-center gap-2 mb-4">
        <Star size={18} />
        <h3 className="text-lg md:text-xl font-semibold">이런 사람들이 우리의 디저트를 굽습니다</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['가연','민수','소윤'].map((name, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="h-40 rounded-xl bg-gray-200 mb-3" />
            <div className="font-semibold mb-1">{name} 베이커</div>
            <div className="text-sm opacity-80 mb-3">{i===0?'아이와 함께 만드는 매일의 달콤함':i===1?'한입으로 전하는 고향의 맛':'버터의 결을 살린 레시피'}</div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm rounded-full border">스토리 보기</button>
              <button className="px-3 py-1.5 text-sm rounded-full" style={{ backgroundColor: COLORS.primary }}>제품 보기</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Feed({ role, likes, onLike, onB2B }:{ role:string, likes:Record<number, boolean>, onLike:(id:number)=>void, onB2B:(id:number)=>void }) {
  return (
    <section id="feed" className="px-4 md:px-8 py-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg md:text-xl font-semibold">디저트 피드</h3>
        <div className="flex gap-2 text-sm">
          <button className="px-3 py-1.5 rounded-full border">신상</button>
          <button className="px-3 py-1.5 rounded-full border">인기</button>
          <button className="px-3 py-1.5 rounded-full border">근처</button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {SAMPLE_PRODUCTS.map(p => (
          <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="relative">
              <Image src={p.img} alt={p.name} width={800} height={600} className="w-full h-40 md:h-52 object-cover" />
              <button onClick={()=>onLike(p.id)} className="absolute top-2 right-2 bg-white/90 rounded-full p-1 shadow">
                <Heart size={18} className={likes[p.id] ? 'fill-red-500 text-red-500':''} />
              </button>
            </div>
            <div className="p-3">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm">${p.price.toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-2 text-xs mt-1 opacity-80">
                <span className="px-2 py-0.5 rounded-full border">{p.storage}</span>
                <span className="px-2 py-0.5 rounded-full border">by {p.baker}</span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                {role === 'buyer' ? (
                  <button onClick={()=>onB2B(p.id)} className="w-full px-3 py-1.5 text-sm rounded-full" style={{ backgroundColor: COLORS.primary }}>함께하기(납품)</button>
                ) : role === 'consumer' ? (
                  <button className="w-full px-3 py-1.5 text-sm rounded-full" style={{ backgroundColor: COLORS.primary }}>장바구니</button>
                ) : (
                  <button className="w-full px-3 py-1.5 text-sm rounded-full border">자세히 보기</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function BrandMessage() {
  return (
    <section id="brand" className="px-4 md:px-8 py-12 text-center">
      <p className="max-w-2xl mx-auto leading-relaxed">
        우리는 단순히 디저트를 팔지 않습니다. 이곳엔 제빵사의 꿈, 엄마의 마음, 그리고 매일의 정성이 있습니다. 당신의 한 입이, 누군가의 내일을 굽습니다.
      </p>
      <button className="mt-4 px-4 py-2 rounded-full border">Our Story</button>
    </section>
  )
}

function RoleCTA({ onSelect }:{ onSelect:(r:'consumer'|'buyer'|'seller')=>void }) {
  return (
    <section className="px-4 md:px-8 py-10 text-center border-t">
      <h4 className="text-lg font-semibold mb-2">당신은 누구인가요?</h4>
      <p className="opacity-80 mb-5">가입 없이 둘러볼 수 있지만, 역할을 선택하면 더 맞춤 경험을 드려요.</p>
      <div className="flex flex-col md:flex-row gap-3 justify-center">
        <button onClick={()=>onSelect('consumer')} className="px-4 py-2 rounded-full" style={{ backgroundColor: COLORS.primary }}>🍪 일반 소비자</button>
        <button onClick={()=>onSelect('buyer')} className="px-4 py-2 rounded-full border">☕ 카페/바이어</button>
        <button onClick={()=>onSelect('seller')} className="px-4 py-2 rounded-full border">👩‍🍳 홈베이커</button>
      </div>
    </section>
  )
}

function StickyCTA({ role, onRoleChange }:{ role:string, onRoleChange:(r:any)=>void }) {
  return (
    <div className="fixed bottom-4 left-0 right-0 px-4 md:px-8 z-40">
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur shadow-lg border rounded-2xl p-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm">
          <Factory size={16} />
          <span className="hidden sm:inline">One Product, Two Paths — 같은 디저트도 소비자/바이어에게 다른 흐름</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <button onClick={()=>onRoleChange('consumer')} className={`px-3 py-1.5 rounded-full border ${role==='consumer'?'bg-yellow-200':''}`}>소비자 모드</button>
          <button onClick={()=>onRoleChange('buyer')} className={`px-3 py-1.5 rounded-full border ${role==='buyer'?'bg-yellow-200':''}`}>바이어 모드</button>
          <button onClick={()=>onRoleChange('seller')} className={`px-3 py-1.5 rounded-full border ${role==='seller'?'bg-yellow-200':''}`}>셀러 모드</button>
        </div>
      </div>
    </div>
  )
}

function InquiryForm({ onClose }:{ onClose:()=>void }) {
  return (
    <form className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs opacity-70">수량(개)</label>
          <input className="w-full border rounded-lg px-3 py-2" placeholder="예: 36" />
        </div>
        <div>
          <label className="text-xs opacity-70">희망 납품일</label>
          <input type="date" className="w-full border rounded-lg px-3 py-2" />
        </div>
      </div>
      <div>
        <label className="text-xs opacity-70">납품 주기</label>
        <select className="w-full border rounded-lg px-3 py-2">
          <option>1회</option>
          <option>매주</option>
          <option>격주</option>
          <option>매월</option>
        </select>
      </div>
      <div>
        <label className="text-xs opacity-70">메모</label>
        <textarea className="w-full border rounded-lg px-3 py-2" rows={3} placeholder="포장 단위, 알러지, 픽업/배송 등" />
      </div>
      <div className="flex items-center justify-end gap-2 pt-2">
        <button type="button" onClick={onClose} className="px-3 py-1.5 rounded-full border">취소</button>
        <button type="submit" className="px-3 py-1.5 rounded-full" style={{ backgroundColor: COLORS.primary }}>견적 요청</button>
      </div>
    </form>
  )
}

function scrollToId(id:string) {
  const el = document.getElementById(id)
  el?.scrollIntoView({ behavior: 'smooth' })
}
