import ChatWidget from '@/components/chat-widget/ChatWidget';
import { Search } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0c1e35] text-white selection:bg-[#48da40] selection:text-[#0c1e35] font-sans">
      {/* Navbar Minimalista (Copia Exacta) */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0c1e35]/90 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-3xl font-bold tracking-tighter flex items-center gap-1 cursor-pointer">
              <span className="text-white">3D</span>
              <span className="text-white/90 font-light italic">realtodigital</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-6 text-[11px] font-extrabold uppercase tracking-[0.15em] text-white/90">
            <a href="#" className="hover:text-[#48da40] transition-colors flex items-center gap-1">Consultoría BIM <span className="text-[8px]">▼</span></a>
            <a href="#" className="text-[#48da40] border-b-2 border-[#48da40] pb-1 flex items-center gap-1">Escaneado 3D <span className="text-[8px]">▼</span></a>
            <a href="#" className="hover:text-[#48da40] transition-colors">Impresión 3D</a>
            <a href="#" className="hover:text-[#48da40] transition-colors flex items-center gap-1">Otros servicios <span className="text-[8px]">▼</span></a>
            <a href="#" className="hover:text-[#48da40] transition-colors">Porfolio</a>
            <a href="#" className="hover:text-[#48da40] transition-colors">Blog</a>
            <a href="#" className="hover:text-[#48da40] transition-colors">Quienes Somos</a>
            <a href="#" className="hover:text-[#48da40] transition-colors">Contacto</a>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition scale-90">
              <img src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg" className="w-5 h-auto rounded-[1px]" alt="US" />
            </div>
            <Search className="w-4 h-4 cursor-pointer hover:text-[#48da40] transition" />
          </div>
        </div>
      </nav>

      {/* Hero Section (Réplica Exacta) */}
      <section className="relative min-h-screen flex items-center pt-24 overflow-hidden">
        {/* Wireframe Mesh Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0c1e35] via-[#102b53] to-[#0c1e35]"></div>

          {/* Rejilla estructural */}
          <div className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '80px 80px'
            }}>
          </div>

          {/* Círculo de luz radial */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#48da40]/5 rounded-full blur-[120px]"></div>

          {/* El elemento "Malla de edificio" simulado por CSS */}
          <div className="absolute bottom-0 right-0 w-[60%] h-[70%] bg-gradient-to-tl from-[#48da40]/10 to-transparent skew-x-[-20deg] opacity-20 transform translate-x-20"></div>
        </div>

        <div className="container mx-auto px-10 relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-7xl md:text-8xl font-black mb-6 leading-[0.95] tracking-tight text-white uppercase italic">
              Expertos en <br />
              Escaneado 3D
            </h1>

            <p className="text-2xl md:text-3xl font-extrabold text-white mb-6 leading-snug drop-shadow-md">
              Escaneado 3D preciso para transformar tus proyectos, con modelado BIM e impresión 3D que optimizan cada detalle.
            </p>

            <p className="text-md text-white/70 mb-10 max-w-2xl leading-relaxed italic border-l-2 border-[#48da40]/30 pl-6">
              Sea cual sea el tamaño de tus proyectos, ofrecemos soluciones técnicas basadas en el escaneado 3D, adaptándonos a las necesidades específicas de cada proyecto.
            </p>

            <button className="bg-[#48da40] hover:bg-[#3ecb37] text-white px-12 py-5 rounded-[4px] font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:shadow-[#48da40]/20 transition-all transform hover:-translate-y-0.5">
              SOLICITAR INFORMACIÓN
            </button>
          </div>
        </div>

        {/* Debug UI (Para estética industrial) */}
        <div className="absolute bottom-12 right-12 z-10 hidden xl:flex flex-col items-end gap-2 opacity-20 pointer-events-none font-mono">
          <div className="text-[9px] font-bold tracking-[0.5em] uppercase">Status: System_Operational</div>
          <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-[#48da40] w-3/4 animate-pulse"></div>
          </div>
          <div className="text-[8px]">Scan_Buffer: 100% / Latency: 12ms</div>
        </div>
      </section>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}
