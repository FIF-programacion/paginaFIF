import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SiteFooter } from "../components/SiteFooter";
import { KineticText } from "../components/KineticText";
import { VelocityText } from "../components/VelocityText";
import { ScrollSplitEvents } from "../components/ScrollSplitEvents";
import { Wordmark } from "../components/Brand";
import { ORG, assistanceWhatsAppUrl } from "../data/org";
import { useSlowPageScroll } from "../hooks/useSlowPageScroll";
import "./Landing.css";

const SECTIONS = [
  { id: "inicio", title: "Inicio" },
  { id: "nosotros", title: "Nosotros" },
  { id: "proyectos", title: "Proyectos" },
  { id: "eventos", title: "Eventos" },
  { id: "dona", title: "Dona ahora" },
  { id: "colaboradores", title: "Colaboradores" },
  { id: "multimedia", title: "Multimedia" },
  { id: "fif-learning", title: "FIF Learning" },
  { id: "contacto", title: "Contacto" },
];

const ABOUT_BANDS = [
  {
    kicker: "Nosotros",
    title: "Quiénes somos",
    text: "Somos una fundación comprometida con brindar oportunidades de aprendizaje, creatividad y desarrollo personal a niños y jóvenes. Creemos en el poder de la educación y el arte como herramientas para transformar vidas y construir comunidades más solidarias y conscientes.",
    image: "/images/Image1.jpg",
    side: "left",
  },
  {
    kicker: "Misión",
    title: "Misión",
    text: "Ser un espacio educativo innovador que nutre el potencial y el desarrollo integral de los niños, fomentando el amor por el aprendizaje, el pensamiento crítico y un carácter fuerte.",
    image: "/images/Image2.jpg",
    side: "right",
  },
  {
    kicker: "Enfoque",
    title: "Nuestro trabajo",
    text: "Nuestro trabajo se enfoca en crear espacios donde cada participante pueda descubrir su potencial, fortalecer su confianza y compartir con otros sus talentos. Desde nuestros inicios, hemos buscado ser un punto de encuentro entre la enseñanza, la expresión y la colaboración. Cada actividad que realizamos nace del deseo de inspirar curiosidad, empatía y sentido de pertenencia. En nuestra fundación, aprender también significa disfrutar, explorar y crecer juntos.",
    image: "/images/Image3.jpg",
    side: "left",
  },
  {
    kicker: "Visión",
    title: "Visión",
    text: "Ser reconocida en Ecuador como la fundación líder en el desarrollo integral de la niñez, transformando la educación en una aventura de vida. Aspiramos a que cada niño de FIF se convierta en un agente de cambio, capaz de destacar en cualquier ámbito, con una capacidad crítica mejorada y una visión equilibrada y creativa del mundo.",
    image: "/images/Image4.jpg",
    side: "right",
  },
];

const PROJECT_IMAGES = [
  "/images/Image1.jpg",
  "/images/Image2.jpg",
  "/images/Image3.jpg",
  "/images/Image4.jpg",
  "/images/Image5.jpg",
  "/images/proyectos-profes.jpg",
];

const EVENTS = [
  {
    title: "Soul Concert",
    date: "mar, 09 ene",
    place: "Mountain View",
    bgColor: "#5b9cf5",
    textColor: "#ffffff",
  },
  {
    title: "Modern Ballet",
    date: "mar, 06 feb",
    place: "Flatiron District",
    bgColor: "#9ee0c8",
    textColor: "#16362d",
  },
  {
    title: "Album Launch",
    date: "sáb, 17 mar",
    place: "West Village",
    bgColor: "#f3a3a0",
    textColor: "#4a1f1c",
  },
];

const ALLIES = [
  { name: "USFQ PASEC", src: "/images/allies/pasec.png" },
  { name: "Manualidades Mil Travesuras", src: "/images/allies/mil-travesuras.png" },
  { name: "K-School", src: "/images/allies/k-school.png" },
  { name: "McGraw Hill ALEKS", src: "/images/allies/aleks.jpg" },
  { name: "Donkey Burritos", src: "/images/allies/donkey-burritos.png" },
];

const HOURS = [
  { day: "Martes", time: "3:00 pm – 5:00 pm" },
  { day: "Jueves", time: "3:00 pm – 5:00 pm" },
  { day: "Sábado", time: "8:00 am – 1:00 pm" },
];

function clamp(value) {
  return Math.min(1, Math.max(0, value));
}

function usePinnedProgress(ref) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const travel = Math.max(1, el.offsetHeight - window.innerHeight);
      setProgress(clamp(-rect.top / travel));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ref]);

  return progress;
}

function IconSocial({ name }) {
  const icons = {
    facebook: <path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v3H6v4h3v8h4v-8h3.2L17 12h-4V9c0-.6.4-1 1-1Z" />,
    instagram: <path d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5Zm8 2H8a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3Zm-4 3.2A4.8 4.8 0 1 1 7.2 13 4.8 4.8 0 0 1 12 8.2Zm0 2A2.8 2.8 0 1 0 14.8 13 2.8 2.8 0 0 0 12 10.2ZM17.4 6.3a1.1 1.1 0 1 1-1.1 1.1 1.1 1.1 0 0 1 1.1-1.1Z" />,
    tiktok: <path d="M14.2 3h3.1c.3 2.4 1.6 4.2 4.2 4.5v3.1c-1.4 0-2.7-.4-4.1-1.2v6.8A6.7 6.7 0 1 1 9.2 9.6v3.3a3.5 3.5 0 1 0 2.5 3.3V3Z" />,
    linkedin: <path d="M6.5 9H3.6v12h2.9V9ZM5 3.4A1.7 1.7 0 1 0 5 6.8 1.7 1.7 0 0 0 5 3.4ZM20.4 9c-2.3 0-3.7 1.2-4.3 2.4V9h-2.9v12h2.9v-6.4c0-1.7.9-2.8 2.4-2.8s2.2.9 2.2 2.8V21H21V14c0-3-1.5-5-4.6-5Z" />,
  };
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="lp-social-icon">
      {icons[name]}
    </svg>
  );
}

function FadeIn({ children, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function Landing() {
  const heroRef = useRef(null);
  const [active, setActive] = useState("inicio");
  const heroProgress = usePinnedProgress(heroRef);
  const scrollToId = useSlowPageScroll();
  const wa = assistanceWhatsAppUrl("Hola FIF, quiero conocer más sobre la fundación.");

  const shrink = clamp((heroProgress - 0.08) / 0.5);
  const fade = clamp((heroProgress - 0.84) / 0.14);
  const scale = 1 - shrink * 0.36;
  const copyOpacity = 1 - Math.min(1, heroProgress / 0.18);

  useEffect(() => {
    document.documentElement.classList.add("lp-html");
    const update = () => {
      const marker = window.innerHeight * 0.42;
      let current = SECTIONS[0].id;
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= marker) current = section.id;
      }
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      document.documentElement.classList.remove("lp-html");
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (!id) return;
    const timer = window.setTimeout(() => {
      scrollToId(id);
    }, 60);
    return () => window.clearTimeout(timer);
  }, [scrollToId]);

  const goTo = (id) => (event) => {
    event.preventDefault();
    scrollToId(id);
  };

  return (
    <div className="lp-page">
      <a className="skip-link" href="#contenido">Saltar al contenido</a>

      <header className="lp-header">
        <Link to="/" className="lp-brand">
          <img src="/images/LOGO_COLOR.png" alt="" />
          <span>FIF</span>
        </Link>
        <a href="#dona" className="lp-chip" onClick={goTo("dona")}>Dona hoy</a>
      </header>

      <nav className="lp-nav" aria-label="Secciones de la página">
        <p className="lp-nav-caption">Menu</p>
        <ul className="lp-nav-list">
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={`lp-nav-link ${active === section.id ? "is-active" : ""}`}
                aria-current={active === section.id ? "true" : undefined}
                onClick={goTo(section.id)}
              >
                <span className="lp-nav-line" aria-hidden="true" />
                <span className="lp-nav-name">{section.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <main id="contenido">
        <section className="lp-hero" id="inicio" ref={heroRef}>
          <div className="lp-hero-sticky">
            <div
              className="lp-hero-frame"
              style={{
                transform: `translate(-50%, -50%) scale(${scale})`,
                opacity: 1 - fade,
              }}
            >
              <video className="lp-hero-video" autoPlay muted loop playsInline poster="/images/Image1.jpg">
                <source src="/videos/videoInicio.mp4" type="video/mp4" />
              </video>
              <div className="lp-hero-copy" style={{ opacity: copyOpacity }}>
                <h1>
                  <span>Fundación</span>
                  <span>Integral</span>
                  <span>de Familias</span>
                </h1>
                <div className="lp-hero-actions">
                  <a href="#dona" className="lp-hero-cta" onClick={goTo("dona")}>Dona hoy</a>
                  <Link to="/fif-learning" className="lp-hero-cta lp-hero-cta-learning">FIF LEARNING</Link>
                </div>
                <p className="lp-scroll-hint">Desliza</p>
              </div>
            </div>
          </div>
        </section>

        <section className="lp-about" id="nosotros">
          {ABOUT_BANDS.map((item) => (
            <div className={`lp-about-band is-${item.side}`} key={item.title}>
              <article className="lp-about-block">
                <p className="lp-kicker">{item.kicker}</p>
                <KineticText
                  text={item.title}
                  splitBy="words"
                  direction={item.side}
                  className="lp-about-title"
                  as="h2"
                />
                <KineticText
                  text={item.text}
                  splitBy="words"
                  direction={item.side}
                  stagger={0.018}
                  className="lp-about-copy"
                  as="p"
                />
              </article>
              <motion.figure
                className="lp-about-photo"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <img src={item.image} alt="" />
              </motion.figure>
            </div>
          ))}
        </section>

        <section className="lp-projects" id="proyectos">
          <div className="lp-projects-head">
            <h2>Nuestros proyectos</h2>
          </div>
          <div className="lp-fish">
            {[0, 1, 2].map((row) => (
              <div key={row} className={`lp-fish-row ${row % 2 ? "is-alt" : ""}`}>
                <div className="lp-fish-set">
                  {PROJECT_IMAGES.map((src) => (
                    <div className="lp-fish-cell" key={`${row}-a-${src}`}>
                      <img src={src} alt="" />
                    </div>
                  ))}
                </div>
                <div className="lp-fish-set">
                  {PROJECT_IMAGES.map((src) => (
                    <div className="lp-fish-cell" key={`${row}-b-${src}`}>
                      <img src={src} alt="" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <ScrollSplitEvents
          imageSrc="/images/Image5.jpg"
          cards={EVENTS.map((event) => ({
            ...event,
            moreHref: "#contacto",
            registerHref: assistanceWhatsAppUrl(`Hola, quiero inscribirme en ${event.title}.`),
          }))}
        />

        <section className="lp-velocity-section">
          <VelocityText text="DONA AHORA" />
        </section>

        <section className="lp-donate" id="dona">
          <FadeIn>
            <p className="lp-kicker">Dona ahora</p>
            <h2>Tu apoyo sostiene talleres, familias y aprendizaje.</h2>
            <div className="lp-donate-grid">
              <article className="lp-donate-card">
                <h3>Donación individual</h3>
                <p>Un aporte único o mensual para seguir formando mentes curiosas.</p>
                <Link to="/dona/individual" className="lp-hero-cta">Donar</Link>
              </article>
              <article className="lp-donate-card">
                <h3>Organización</h3>
                <p>Paquetes para empresas y aliados que quieren impulsar un programa.</p>
                <Link to="/dona/paquetes" className="lp-hero-cta">Ver paquetes</Link>
              </article>
            </div>
          </FadeIn>
        </section>

        <section className="lp-allies" id="colaboradores">
          <FadeIn>
            <p className="lp-kicker">Colaboradores</p>
            <h2>Nuestros colaboradores</h2>
          </FadeIn>
          <div className="lp-ally-marquee">
            <div className="lp-ally-track">
              <div className="lp-ally-set">
                {ALLIES.map((ally) => (
                  <figure key={ally.name} className="lp-ally">
                    <img src={ally.src} alt="" />
                    <figcaption>{ally.name}</figcaption>
                  </figure>
                ))}
              </div>
              <div className="lp-ally-set" aria-hidden="true">
                {ALLIES.map((ally) => (
                  <figure key={`${ally.name}-dup`} className="lp-ally">
                    <img src={ally.src} alt="" />
                    <figcaption>{ally.name}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="lp-plain lp-multimedia" id="multimedia">
          <FadeIn>
            <p className="lp-kicker">Multimedia</p>
            <h2>Podcast y YouTube</h2>
            <div className="lp-media">
              <a href={ORG.social.podcast} target="_blank" rel="noreferrer">
                <span>Podcast</span>
                <strong>Conversando con los Profes</strong>
              </a>
              <a href={ORG.social.youtube} target="_blank" rel="noreferrer">
                <span>YouTube</span>
                <strong>Canal FIF</strong>
              </a>
            </div>
          </FadeIn>
        </section>

        <section className="lp-portal" id="fif-learning">
          <div className="lp-portal-frame">
            <img src="/images/Image1.jpg" alt="" />
            <div className="lp-portal-copy">
              <p className="lp-kicker">Portal</p>
              <h2 className="lp-portal-wordmark"><Wordmark size="lg" /></h2>
              <p>El espacio digital de refuerzo académico para estudiantes, familias y docentes.</p>
              <Link to="/fif-learning" className="lp-hero-cta">Entrar al portal</Link>
            </div>
          </div>
        </section>

        <section className="lp-plain" id="contacto">
          <FadeIn>
            <p className="lp-kicker">Contacto</p>
            <h2>Horarios y datos</h2>
            <div className="lp-contact">
              <article className="lp-contact-card">
                <h3>Datos</h3>
                <a href={`tel:${ORG.phone.replace(/\s/g, "")}`}>{ORG.phone}</a>
                <a href={`mailto:${ORG.email}`}>{ORG.email}</a>
                <a href={wa} target="_blank" rel="noreferrer">WhatsApp</a>
              </article>
              <article className="lp-contact-card">
                <h3>Horarios</h3>
                <ul>
                  {HOURS.map((row) => (
                    <li key={row.day}>
                      <span>{row.day}</span>
                      <span>{row.time}</span>
                    </li>
                  ))}
                </ul>
              </article>
              <article className="lp-contact-card">
                <h3>Redes</h3>
                <div className="lp-socials">
                  <a href={ORG.social.facebook} target="_blank" rel="noreferrer"><IconSocial name="facebook" /> Facebook</a>
                  <a href={ORG.social.tiktok} target="_blank" rel="noreferrer"><IconSocial name="tiktok" /> TikTok</a>
                  <a href={ORG.social.linkedin} target="_blank" rel="noreferrer"><IconSocial name="linkedin" /> LinkedIn</a>
                  <a href={ORG.social.instagram} target="_blank" rel="noreferrer"><IconSocial name="instagram" /> Instagram</a>
                </div>
              </article>
            </div>
          </FadeIn>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
