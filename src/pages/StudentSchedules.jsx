import { ScheduleGrid } from "../components/ScheduleGrid";
import { useGame } from "../context/GameContext";
import { ageLabel, normalizeGroup } from "../data/org";

export default function StudentSchedules() {
  const { user, schedules } = useGame();
  const mine = schedules.filter((item) => item.ageGroup === "all" || normalizeGroup(item.ageGroup) === normalizeGroup(user?.ageGroup));

  return (
    <section className="panel">
      <h2>Horarios</h2>
      <p>Turnos de tu grupo: {ageLabel(user?.ageGroup)}.</p>
      <ScheduleGrid items={mine} emptyHint="Coordinación aún no publicó horarios para tu grupo en este dispositivo." />
    </section>
  );
}
