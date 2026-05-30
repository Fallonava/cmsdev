import Link from "next/link";
import { MapPin, Mail, Phone, ArrowUpRight } from "lucide-react";

export function Footer({ identity }: { identity?: any }) {
  return (
    <footer className="bg-[#1a1a1c] text-white pt-24 pb-12 rounded-t-[3rem] mt-12 overflow-hidden relative">
      {/* Decorative Blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-8 lg:px-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
          
          {/* Brand & Vision - Takes up more space */}
          <div className="md:col-span-6 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              {identity?.logoUrl ? (
                <div className="w-14 h-14 bg-white rounded-[1.25rem] flex items-center justify-center border border-white/10 overflow-hidden">
                  <img src={identity.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-[1.25rem] flex items-center justify-center border border-white/10">
                  <span className="text-white font-bold text-xl tracking-wider">M07</span>
                </div>
              )}
              <span className="font-bold text-3xl tracking-tight">{identity?.shortName || "MTs Muh 07"}</span>
            </div>
            <p className="text-gray-400 text-lg leading-relaxed max-w-md font-medium">
              Mendidik generasi islami, berakhlak mulia, tangguh, dan berprestasi unggul untuk masa depan yang lebih baik.
            </p>
            
            <div className="flex gap-3 mt-4">
              {[
                { name: 'Instagram', icon: <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path> },
                { name: 'Facebook', icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path> },
                { name: 'Youtube', icon: <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path> }
              ].map((social, i) => (
                <a key={i} href="#" aria-label={social.name} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {social.name === 'Instagram' && <><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></>}
                    {social.name === 'Facebook' && <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>}
                    {social.name === 'Youtube' && <><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></>}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 flex flex-col gap-6">
            <h3 className="font-bold text-sm tracking-[0.2em] uppercase text-gray-500">Tautan Cepat</h3>
            <div className="flex flex-col gap-4">
              {[
                { name: 'Profil Sekolah', href: '/profil' },
                { name: 'Program Akademik', href: '/akademik' },
                { name: 'Penerimaan Siswa', href: '/ppdb' },
                { name: 'Berita & Artikel', href: '/berita' }
              ].map((link) => (
                <Link key={link.name} href={link.href} className="text-gray-300 hover:text-white font-medium flex items-center gap-1 group w-fit transition-colors">
                  {link.name}
                  <ArrowUpRight size={14} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="md:col-span-3 flex flex-col gap-6">
            <h3 className="font-bold text-sm tracking-[0.2em] uppercase text-gray-500">Hubungi Kami</h3>
            <div className="flex flex-col gap-5 text-gray-300 font-medium">
              <div className="flex gap-4 items-start group cursor-default">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                  <MapPin size={18} />
                </div>
                <p className="text-sm leading-relaxed pt-1 whitespace-pre-wrap">
                  {identity?.address || "Jl. Raya Kejobong No. 123,\nPurbalingga, Jawa Tengah 53392"}
                </p>
              </div>
              <div className="flex gap-4 items-center group cursor-pointer hover:text-white transition-colors">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                  <Phone size={18} />
                </div>
                <p className="text-sm">{identity?.phone || "(0281) 123456"}</p>
              </div>
              <div className="flex gap-4 items-center group cursor-pointer hover:text-white transition-colors">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                  <Mail size={18} />
                </div>
                <p className="text-sm">{identity?.email || "info@mtsmuh07.sch.id"}</p>
              </div>
            </div>
          </div>

        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-medium text-gray-500">
          <p>&copy; {new Date().getFullYear()} {identity?.schoolName || "MTs Muhammadiyah 07 Purbalingga"}.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-gray-300 transition-colors">Kebijakan Privasi</Link>
            <Link href="#" className="hover:text-gray-300 transition-colors">Syarat Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
