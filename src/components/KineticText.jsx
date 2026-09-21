import { motion, useReducedMotion } from "framer-motion";

function getSegments(text, splitBy) {
  let animatedIndex = 0;

  if (splitBy === "lines") {
    return text.split("\n").map((line) => {
      const animated = line.length > 0;
      return { value: line, animated, index: animated ? animatedIndex++ : -1 };
    });
  }

  if (splitBy === "characters") {
    return Array.from(text).map((character) => {
      const animated = !/\s/.test(character);
      return { value: character === " " ? "\u00a0" : character, animated, index: animated ? animatedIndex++ : -1 };
    });
  }

  return text.split(/(\s+)/).map((part) => {
    const animated = !/^\s+$/.test(part) && part.length > 0;
    return { value: part, animated, index: animated ? animatedIndex++ : -1 };
  });
}

function getOffset(direction, distance) {
  if (direction === "down") return { x: 0, y: -distance };
  if (direction === "left") return { x: distance, y: 0 };
  if (direction === "right") return { x: -distance, y: 0 };
  return { x: 0, y: distance };
}

export function KineticText({
  text,
  splitBy = "words",
  direction = "up",
  distance = 20,
  stagger = 0.075,
  delay = 0,
  blur = true,
  className = "",
  as: Tag = "p",
}) {
  const shouldReduceMotion = useReducedMotion();
  const segments = getSegments(text, splitBy);
  const offset = getOffset(direction, distance);

  return (
    <Tag className={`lp-kinetic ${className}`.trim()}>
      <span className="sr-only">{text}</span>
      {segments.map((segment, index) => {
        if (!segment.animated) {
          return (
            <span key={`${segment.value}-${index}`} aria-hidden="true">
              {segment.value}
            </span>
          );
        }

        return (
          <span key={`${segment.value}-${index}`} className="lp-kinetic-mask" aria-hidden="true">
            <motion.span
              className="lp-kinetic-segment"
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: offset.x, y: offset.y, filter: blur ? "blur(6px)" : "blur(0px)" }
              }
              whileInView={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, x: 0, y: 0, filter: "blur(0px)" }
              }
              viewport={{ once: true, amount: 0.35 }}
              transition={{
                duration: shouldReduceMotion ? 0.01 : 0.72,
                delay: delay + segment.index * stagger,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {segment.value}
            </motion.span>
          </span>
        );
      })}
    </Tag>
  );
}
