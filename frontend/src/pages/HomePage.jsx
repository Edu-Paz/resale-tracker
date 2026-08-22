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
  return (
    <>
      <main>
        <section className="hero">
          <p className="eyebrow">Ficha de controle para revendedores</p>
          <h1>Otimize suas revendas e maximize seus lucros</h1>
          <p className="hero-description">Registre compras, acompanhe seu estoque e descubra o resultado de cada venda em um só lugar.</p>
          <div className="hero-actions">
            <AppLink href={routes.login} className="cta-button" onNavigate={onNavigate}>
              Acessar minha conta
            </AppLink>
            <AppLink href={routes.register} className="secondary-button" onNavigate={onNavigate}>
              Criar conta
            </AppLink>
          </div>
        </section>

        <section className="features container">
          <h2>Funcionalidades principais</h2>
          <div className="features-grid">
            {features.map((feature) => (
              <FeatureCard key={feature.index} {...feature} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default HomePage
