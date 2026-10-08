import { useRef } from "react";
import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";

export function ScrollSplitEvents({ imageSrc, cards }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const leftX = useTransform(scrollYProgress, [0, 0.12, 0.42, 0.55], [0, 0, -48, -48]);
  const rightX = useTransform(scrollYProgress, [0, 0.12, 0.42, 0.55], [0, 0, 48, 48]);
  const scale = useTransform(scrollYProgress, [0, 0.12, 0.42], [1, 1, 0.92]);
  const rotateY = useTransform(scrollYProgress, [0.55, 0.86], [0, 180]);
  const rotateZLeft = useTransform(scrollYProgress, [0.55, 0.86], [0, 5]);
  const rotateZRight = useTransform(scrollYProgress, [0.55, 0.86], [0, -5]);

  const radius = useTransform(scrollYProgress, [0.12, 0.42], ["0px", "24px"]);
  const shadowOpacity = useTransform(scrollYProgress, [0.12, 0.42], [0, 0.28]);
  const boxShadow = useMotionTemplate`0 18px 40px rgba(0, 0, 0, ${shadowOpacity})`;

  const lead = cards.slice(0, 3);

  return (
    <section className="lp-events" id="eventos" ref={ref}>
      <div className="lp-events-pin">
        <p className="lp-kicker">Eventos</p>
        <motion.div className="lp-split" style={{ scale, transformStyle: "preserve-3d" }}>
          {lead.map((card, index) => (
            <motion.article
              key={card.title}
              className="lp-flip"
              style={{
                x: index === 0 ? leftX : index === 2 ? rightX : 0,
                rotateY,
                rotateZ: index === 0 ? rotateZLeft : index === 2 ? rotateZRight : 0,
                zIndex: index,
                transformStyle: "preserve-3d",
              }}
            >
              <motion.div
                className="lp-flip-face lp-flip-front"
                style={{
                  borderRadius: radius,
                  boxShadow,
                }}
              >
                <img src={imageSrc} alt="" className="lp-split-slice" />
              </motion.div>
              <motion.div
                className="lp-flip-face lp-flip-back"
                style={{
                  backgroundColor: card.bgColor,
                  color: card.textColor,
                  borderRadius: radius,
                  boxShadow,
                }}
              >
                <div className="lp-flip-copy">
                  <h3>{card.title}</h3>
                  <p className="lp-event-meta">
                    {card.date} <span>|</span> {card.place}
                  </p>
                  <a className="lp-event-more" href={card.moreHref || "#contacto"}>
                    Más info
                  </a>
                  <a
                    className="lp-event-register"
                    href={card.registerHref || "#contacto"}
                    {...(String(card.registerHref || "").startsWith("http")
                      ? { target: "_blank", rel: "noreferrer" }
                      : {})}
                  >
                    Inscribirme &gt;
                  </a>
                </div>
              </motion.div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
