export default function LandingPage() {
  return (
    <div className="hero is-fullheight" style={{
      background: 'linear-gradient(135deg, hsl(var(--bulma-info-h), var(--bulma-info-s), var(--bulma-info-l)) 0%, hsl(var(--bulma-link-h), var(--bulma-link-s), var(--bulma-link-l)) 100%)'
    }}>
      <div className="hero-body">
        <div className="container">
          <div className="columns is-vcentered">
            {/* Left Column - Text Content */}
            <div className="column is-6 has-text-white">
              <div className="mb-4">
                <span style={{ fontSize: '3rem' }}>🎯</span>
              </div>
              
              <h1 className="title is-1 has-text-white mb-6">
                Tu Entrevista Inteligente
              </h1>
              
              <h2 className="subtitle is-4 has-text-white-bis mb-6">
                Practica tus entrevistas con IA y encuentra el trabajo perfecto para ti
              </h2>

              <div className="buttons mb-6">
                <button className="button is-primary is-large is-rounded has-shadow">
                  <span className="mr-2">🎤</span> Comenzar Entrevista
                </button>
                <button className="button is-light is-large is-rounded has-shadow">
                  <span className="mr-2">💼</span> Ver Empleos
                </button>
              </div>

              {/* Stats Section */}
              <div className="is-hidden-mobile">
                <div className="level has-text-centered mt-6 has-background-white-ter p-4" style={{ borderRadius: '1rem' }}>
                  <div className="level-item">
                    <div>
                      <p className="heading">Empresas</p>
                      <p className="title">500+</p>
                    </div>
                  </div>
                  <div className="level-item">
                    <div>
                      <p className="heading">Entrevistas</p>
                      <p className="title">10k+</p>
                    </div>
                  </div>
                  <div className="level-item">
                    <div>
                      <p className="heading">Empleos</p>
                      <p className="title">2k+</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          
          </div>

          {/* Features Section */}
          <div className="columns is-multiline mt-6">
            <div className="column is-4">
              <div className="box has-background-white-ter has-text-centered p-6" 
                   style={{ height: '100%', borderRadius: '1rem' }}>
                <span style={{ fontSize: '3.5rem' }}>🎤</span>
                <h3 className="title is-4 mt-4">Entrevistas por Voz</h3>
                <p>Practica con nuestro asistente AI usando reconocimiento de voz natural</p>
              </div>
            </div>

            <div className="column is-4">
              <div className="box has-background-white-ter has-text-centered p-6" 
                   style={{ height: '100%', borderRadius: '1rem' }}>
                <span style={{ fontSize: '3.5rem' }}>🤖</span>
                <h3 className="title is-4 mt-4">IA Avanzada</h3>
                <p>Algoritmo inteligente que encuentra los trabajos ideales para tu perfil</p>
              </div>
            </div>

            <div className="column is-4">
              <div className="box has-background-white-ter has-text-centered p-6" 
                   style={{ height: '100%', borderRadius: '1rem' }}>
                <span style={{ fontSize: '3.5rem' }}>📊</span>
                <h3 className="title is-4 mt-4">Feedback Instantáneo</h3>
                <p>Recibe retroalimentación detallada para mejorar tus entrevistas</p>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="has-text-centered mt-6 has-text-white">
            <p className="is-size-4 mb-4">Confían en nosotros</p>
            <div className="level is-mobile">
              <div className="level-item">⭐⭐⭐⭐⭐</div>
              <div className="level-item">|</div>
              <div className="level-item">10,000+ Entrevistas</div>
              <div className="level-item">|</div>
              <div className="level-item">500+ Empresas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}