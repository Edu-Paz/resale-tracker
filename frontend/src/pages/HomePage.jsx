import Footer from '../components/Footer'
import { routes } from '../routes'

function HomePage() {
  return (
    <>
      <main>
        <section className="hero">
          <p className="eyebrow">Ficha de controle para revendedores</p>
          <h1>Otimize suas revendas e maximize seus lucros</h1>
          <p className="hero-description">Registre compras, acompanhe seu estoque e descubra o resultado de cada venda em um só lugar.</p>
          <div className="hero-actions">
            <a href={routes.login} className="cta-button">Acessar minha conta</a>
            <a href={routes.register} className="secondary-button">Criar conta</a>
          </div>
        </section>

        <section className="features container">
          <h2>Funcionalidades principais</h2>
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-index">01</span>
              <h3>Gestão de inventário</h3>
              <p>Adicione, edite e remova itens do seu estoque com facilidade.</p>
            </div>
            <div className="feature-card">
              <span className="feature-index">02</span>
              <h3>Cálculo de lucro automático</h3>
              <p>Veja o resultado de cada venda e acompanhe seu balanço.</p>
            </div>
            <div className="feature-card">
              <span className="feature-index">03</span>
              <h3>Organização por categorias</h3>
              <p>Agrupe seus produtos e encontre rapidamente o que procura.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default HomePage
