import ChatWidget from '@/components/chat-widget/ChatWidget';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#061224] text-white relative overflow-hidden">
      {/* Patrón de Rejilla de Fondo */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}>
      </div>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Header */}
          <div className="mb-16">
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] text-sm font-bold tracking-widest uppercase">
              Solución Técnica de Vanguardia
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-8 tracking-tighter text-white">
              Agente IA de <span className="text-[#22c55e]">Captura de Leads</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 mb-8 max-w-3xl mx-auto">
              Conversaciones técnicas de alta precisión que transforman visitantes en oportunidades estratégicas para Odoo CRM.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {[
              {
                icon: '🧠',
                title: 'IA con PNL Avanzado',
                description: 'Algoritmos diseñados para la captura empática y validación técnica de requerimientos.'
              },
              {
                icon: '🏢',
                title: 'Ecosistema Odoo',
                description: 'Sincronización bidireccional inmediata para una gestión de CRM sin fricciones.'
              },
              {
                icon: '🛰️',
                title: 'RAG de Ingeniería',
                description: 'Acceso instantáneo a su base de conocimiento técnica (BIM, Escaneo, Metrología).'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group rounded-2xl p-8 bg-[#0c1e35] border border-slate-800 shadow-2xl hover:border-[#22c55e]/50 transition-all duration-300 relative overflow-hidden text-left"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#22c55e]/5 rounded-bl-full group-hover:bg-[#22c55e]/10 transition-colors"></div>
                <div className="text-4xl mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-[#22c55e] transition-colors">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Demo Section */}
          <div className="bg-[#0c1e35] rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] p-1 md:p-12 border border-slate-800 relative overflow-hidden">
            {/* Adorno decorativo */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#22c55e] to-transparent opacity-50"></div>

            <div className="p-8 md:p-0">
              <h2 className="text-4xl font-bold mb-6 text-white tracking-tight">
                Validación de <span className="text-[#22c55e]">Asesoría Virtual</span>
              </h2>
              <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
                Interactúe con nuestro consultor digital especializado en Escaneo 3D y servicios BIM para experimentar el flujo de cualificación técnica.
              </p>

              <div className="grid md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
                <div className="bg-[#061224] rounded-2xl p-8 border border-slate-800 relative group">
                  <div className="absolute -top-3 -right-3 w-12 h-12 bg-[#22c55e] rounded-xl flex items-center justify-center shadow-[0_0_15px_#22c55e66] transition-transform group-hover:scale-110">
                    <span className="text-white font-black">AI</span>
                  </div>
                  <h3 className="font-bold text-white text-xl mb-4">Capacidades Críticas:</h3>
                  <ul className="space-y-4">
                    {[
                      'Extracción de metadatos corporativos',
                      'Cualificación por nivel de detalle (LOD)',
                      'Agendamiento inteligente de consultoría',
                      'Normalización de datos para ERP'
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-[#22c55e] rounded-full shadow-[0_0_5px_#22c55e]"></div>
                        <span className="text-slate-300 text-sm font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col justify-center items-center md:items-start space-y-6">
                  <div className="p-6 bg-[#22c55e]/5 rounded-2xl border border-[#22c55e]/10">
                    <p className="text-[#22c55e] font-bold text-sm uppercase tracking-widest mb-2">Instrucciones</p>
                    <p className="text-slate-400 text-sm">
                      Haga clic en el terminal de asistencia ubicado en la esquina inferior derecha para iniciar el protocolo de captura.
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-slate-500 text-xs font-mono uppercase tracking-tighter italic">
                    <span className="animate-pulse text-[#22c55e]">●</span> System status: online / ready_for_test
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-20 py-8 border-t border-slate-800/50 text-slate-600 text-xs font-medium tracking-widest uppercase">
            <p>Framework: Next.js 16 · Engine: GPT-4o · Backend: Supabase · CRM: Odoo v17</p>
          </div>
        </div>
      </main>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}
