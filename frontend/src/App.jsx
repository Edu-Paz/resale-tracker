import './App.css'

function App() {
  return (
    <>
      <header className="header">
        <div className="container">
          <div className="logo">Resale Tracker</div>
        </div>
      </header>

      <main>
        <section className="hero">
          <h1>Otimize suas revendas e maximize seus lucros</h1>
          <p>Uma solução completa para rastrear itens, categorias e métricas financeiras. Gerencie seu inventário, acompanhe compras e vendas, e calcule lucros automaticamente.</p>
          <a href="#" className="cta-button">Acessar minha conta / Criar conta</a>
        </section>

        <section className="features container">
          <h2>Funcionalidades Principais</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Gestão de Inventário</h3>
              <p>Adicione, edite e remova itens do seu estoque com facilidade, mantendo tudo organizado.</p>
            </div>
            <div className="feature-card">
              <h3>Cálculo de Lucro Automático</h3>
              <p>Ao vender um item, o sistema calcula o lucro e a margem para você, atualizando seu balanço.</p>
            </div>
            <div className="feature-card">
              <h3>Organização por Categorias</h3>
              <p>Crie categorias personalizadas para agrupar seus produtos e ter uma visão clara do seu negócio.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 Resale Tracker. Todos os direitos reservados.</p>
        </div>
      </footer>
    </>
  )
}

export default App
