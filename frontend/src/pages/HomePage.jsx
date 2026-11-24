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

const steps = [
  {
    index: '1',
    title: 'Cadastre seus itens',
    description: 'Registre o custo de compra, o frete e o preço de venda de cada produto.',
  },
  {
    index: '2',
    title: 'Registre as vendas',
    description: 'Marque cada item como vendido e adicione despesas quando for necessário.',
  },
  {
    index: '3',
    title: 'Acompanhe seu lucro',
    description: 'Veja o balanço e as margens em tempo real, sem planilhas.',
  },
]

function HomePage({ onNavigate }) {
  return (
    <>
      <main>
        <section className="hero">
          <span className="hero-badge">Controle financeiro para revendedores</span>
          <h1>
            Otimize suas revendas e{' '}
            <span className="hero-highlight">maximize seus lucros</span>
          </h1>
          <p className="hero-description">
            Registre compras, acompanhe seu estoque e descubra o resultado de cada venda em um só lugar.
          </p>
          <div className="hero-actions">
            <AppLink href={routes.login} className="cta-button" onNavigate={onNavigate}>
              Acessar minha conta
            </AppLink>
            <AppLink href={routes.register} className="secondary-button" onNavigate={onNavigate}>
              Criar conta
            </AppLink>
          </div>
          <p className="hero-trust">Sem mensalidade &bull; Seus dados em um só lugar &bull; Margens em tempo real</p>
        </section>

        <section className="preview container">
          <h2 className="section-title">Como o Revendi calcula seu lucro</h2>
          <div className="preview-grid">
            <article className="preview-item">
              <span className="preview-label">Preço de venda</span>
              <span className="preview-value">R$ 150,00</span>
            </article>
            <span className="preview-op">&minus;</span>
            <article className="preview-item">
              <span className="preview-label">Custo + frete</span>
              <span className="preview-value">R$ 98,00</span>
            </article>
            <span className="preview-op">=</span>
            <article className="preview-item preview-result">
              <span className="preview-label">Lucro líquido</span>
              <span className="preview-value">R$ 52,00</span>
            </article>
          </div>
          <p className="preview-note">Exemplo ilustrativo. O cálculo do seu lucro é feito automaticamente a cada venda.</p>
        </section>

        <section className="features container">
          <h2 className="section-title">Funcionalidades principais</h2>
          <div className="features-grid">
            {features.map((feature) => (
              <FeatureCard key={feature.index} {...feature} />
            ))}
          </div>
        </section>

        <section className="steps container">
          <h2 className="section-title">Comece em 3 passos</h2>
          <ol className="steps-grid">
            {steps.map((step) => (
              <li key={step.index} className="step">
                <span className="step-number">{step.index}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="cta-banner container">
          <h2>Pronto para ter o controle real das suas revendas?</h2>
          <p>Comece grátis e transforme cada item vendido em um número claro de lucro.</p>
          <div className="hero-actions">
            <AppLink href={routes.register} className="cta-button" onNavigate={onNavigate}>
              Criar conta gratuita
            </AppLink>
            <AppLink href={routes.login} className="secondary-button" onNavigate={onNavigate}>
              Já tenho conta
            </AppLink>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default HomePage
