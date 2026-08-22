<<<<<<< HEAD
import AppLink from '../components/AppLink'
import FeatureCard from '../components/FeatureCard'
import Footer from '../components/Footer'
import { routes } from '../routes/appRoutes'

const features = [
  {
    index: '01',
    title: 'Gestão de inventário',
    description: 'Adicione, edite e remova itens do seu estoque com facilidade.',
  },
  {
    index: '02',
    title: 'Cálculo de lucro automático',
    description: 'Veja o resultado de cada venda e acompanhe seu balanço.',
  },
  {
    index: '03',
    title: 'Organização por categorias',
    description: 'Agrupe seus produtos e encontre rapidamente o que procura.',
  },
]

function HomePage({ onNavigate }) {
=======
import Footer from '../components/Footer'
import { routes } from '../routes'

function HomePage() {
>>>>>>> origin/master
  return (
    <>
      <main>
        <section className="hero">
          <p className="eyebrow">Ficha de controle para revendedores</p>
          <h1>Otimize suas revendas e maximize seus lucros</h1>
          <p className="hero-description">Registre compras, acompanhe seu estoque e descubra o resultado de cada venda em um só lugar.</p>
          <div className="hero-actions">
<<<<<<< HEAD
            <AppLink href={routes.login} className="cta-button" onNavigate={onNavigate}>
              Acessar minha conta
            </AppLink>
            <AppLink href={routes.register} className="secondary-button" onNavigate={onNavigate}>
              Criar conta
            </AppLink>
=======
            <a href={routes.login} className="cta-button">Acessar minha conta</a>
            <a href={routes.register} className="secondary-button">Criar conta</a>
>>>>>>> origin/master
          </div>
        </section>

        <section className="features container">
          <h2>Funcionalidades principais</h2>
          <div className="features-grid">
<<<<<<< HEAD
            {features.map((feature) => (
              <FeatureCard key={feature.index} {...feature} />
            ))}
=======
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
>>>>>>> origin/master
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default HomePage
