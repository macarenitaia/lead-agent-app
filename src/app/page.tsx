import ChatWidget from '@/components/chat-widget/ChatWidget';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Agente IA de Captura de Leads
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              Conversaciones inteligentes que convierten visitantes en clientes
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: '🧠',
                title: 'IA con PNL',
                description: 'Técnicas avanzadas de programación neurolingüística para captura empática'
              },
              {
                icon: '📊',
                title: 'CRM Integrado',
                description: 'Sincronización automática con Odoo para gestión completa de leads'
              },
              {
                icon: '🔍',
                title: 'RAG Potenciado',
                description: 'Base de conocimiento inteligente para respuestas precisas y contextuales'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className={`rounded-2xl p-8 ${index === 0 ? 'bg-gradient-to-br from-indigo-100 to-indigo-50' :
                  index === 1 ? 'bg-gradient-to-br from-purple-100 to-purple-50' :
                    'bg-gradient-to-br from-pink-100 to-pink-50'
                  } border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300`}
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Demo Section */}
          <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Prueba el Asistente Virtual
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Haz clic en el botón flotante en la esquina inferior derecha para iniciar una conversación 👉
            </p>

            <div className="flex flex-col gap-4 text-left max-w-2xl mx-auto bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-800 text-center mb-2">✨ Características destacadas:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">
                    <strong>Captura inteligente:</strong> Obtiene datos de forma natural sin presionar
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">
                    <strong>Cualificación automática:</strong> Evalúa la calidad del lead en tiempo real
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">
                    <strong>Agendamiento directo:</strong> Propone y confirma reuniones al instante
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">
                    <strong>Sync con Odoo:</strong> Los leads se sincronizan automáticamente con tu CRM
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-12 text-gray-500 text-sm">
            <p>Powered by OpenAI GPT-4 · Supabase · Odoo Integration</p>
          </div>
        </div>
      </main>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}
