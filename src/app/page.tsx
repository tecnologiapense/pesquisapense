import SurveyForm from "@/components/SurveyForm";

const LOGO_PENSE =
  "https://lp.penserevalida.com/wp-content/uploads/2026/08/logo-pense-dark_1.png";

export default function Home() {
  return (
    <div className="landing">
      <header className="topbar">
        <div className="wrap">
          <div className="logos">
            <img
              className="logo-img logo-pense"
              src={LOGO_PENSE}
              alt="Pense Revalida"
              width={1601}
              height={801}
            />
          </div>
          <a href="#pesquisa" className="btn btn-primary">
            Responder pesquisa
          </a>
        </div>
      </header>

      <section className="hero">
        <div className="wrap">
          <span className="badge">
            <span className="dot">
              <svg viewBox="0 0 24 24" fill="none" stroke="#18242F" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12l5 5L20 7" />
              </svg>
            </span>
            Exclusivo para aprovados no Revalida INEP
          </span>

          <h1>
            Parabéns pela aprovação no Revalida INEP! Queremos entender a sua{" "}
            <span className="grad-text">jornada até aqui.</span>
          </h1>

          <p>
            Aqui é do <strong>Pense Revalida</strong>, a maior comunidade de revalidação do Brasil
            e pioneira no método de treinamento prático para a 2ª fase.
          </p>
          <p>
            Estamos fazendo uma pesquisa rápida com médicos formados no exterior para entender por
            que alguns profissionais não chegaram a usar nossa plataforma na 2ª fase, ou tiveram
            pouco contato com ela.
          </p>

          <div className="callout">
            <span className="ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6" />
                <path d="M12 2v13" />
                <path d="m7 9 5-7 5 7" />
              </svg>
            </span>
            <p>
              <strong>Respondendo, você desbloqueia</strong> as mesmas condições especiais dos
              alunos Pense com a Caveo, nossa parceira que já atende mais de 20 mil médicos — entre
              elas, a abertura do seu CNPJ 100% gratuita (economia de mais de R$ 2 mil) e outros
              benefícios para o início da sua carreira.
            </p>
          </div>

          <p className="warning">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            Atenção: os bônus só são ativados ao contratar o Plano de Carreira da Caveo.
          </p>

          <p className="timing">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Leva só alguns minutos
          </p>

          <div className="hero-cta">
            <a href="#pesquisa" className="btn btn-primary">
              Responder pesquisa agora
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <section className="form-section" id="pesquisa">
        <div className="wrap">
          <div className="form-card">
            <h2>Pesquisa de Mercado</h2>
            <p className="sub">
              Suas respostas são muito importantes para entendermos hábitos de estudo, critérios
              de escolha e percepções sobre as empresas que atuam nesse mercado. A pesquisa é
              rápida e leva aproximadamente 3 minutos.
            </p>
            <SurveyForm />
          </div>
        </div>
      </section>

      <footer className="foot">
        <div className="wrap">
          <div className="logos">
            <img className="logo-img logo-pense" src={LOGO_PENSE} alt="Pense Revalida" width={1601} height={801} />
          </div>
          <span>© 2026 Pense Revalida. Todos os direitos reservados.</span>
        </div>
      </footer>
    </div>
  );
}
