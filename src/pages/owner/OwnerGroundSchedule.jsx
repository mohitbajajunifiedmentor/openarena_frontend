import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ownerApi } from '../../api/services.js';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Loader from '../../components/ui/Loader.jsx';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function OwnerGroundSchedule() {
  const { id } = useParams();
  const [ground, setGround] = useState(null);
  const [openingTime, setOpeningTime] = useState('06:00');
  const [closingTime, setClosingTime] = useState('22:00');
  const [slotDuration, setSlotDuration] = useState(60);
  const [weekly, setWeekly] = useState({});
  const [blockDate, setBlockDate] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    ownerApi.grounds().then((r) => {
      const g = r.data.find((x) => x._id === id);
      if (g) {
        setGround(g);
        setOpeningTime(g.openingTime || '06:00');
        setClosingTime(g.closingTime || '22:00');
        setSlotDuration(g.slotDurationMinutes || 60);
        setWeekly(g.weeklySchedule || {});
      }
    });
  }, [id]);

  const saveSchedule = async () => {
    await ownerApi.setSchedule(id, { openingTime, closingTime, slotDurationMinutes: Number(slotDuration), weeklySchedule: weekly });
    setMsg('Schedule saved');
  };

  const addBlock = async () => {
    if (!blockDate) return;
    await ownerApi.blockDate(id, { date: blockDate, reason: 'Owner blocked' });
    const r = await ownerApi.grounds();
    setGround(r.data.find((x) => x._id === id));
    setBlockDate('');
    setMsg('Date blocked');
  };

  if (!ground) return <Loader />;

  return (
    <section className="mx-auto max-w-2xl space-y-8 px-4 py-10 sm:px-6">
      <header>
        <Link to="/owner/grounds" className="text-sm text-brand-700">← Back</Link>
        <h1 className="font-display text-2xl font-bold">Schedule: {ground.name}</h1>
      </header>

      <section className="rounded-2xl border bg-white p-6 space-y-4">
        <h2 className="font-semibold">Operating hours</h2>
        <section className="grid grid-cols-3 gap-3">
          <Input label="Opens" type="time" value={openingTime} onChange={(e) => setOpeningTime(e.target.value)} />
          <Input label="Closes" type="time" value={closingTime} onChange={(e) => setClosingTime(e.target.value)} />
          <Input label="Slot (min)" type="number" value={slotDuration} onChange={(e) => setSlotDuration(e.target.value)} />
        </section>
        <h3 className="text-sm font-medium">Weekly schedule</h3>
        {DAYS.map((day) => (
          <section key={day} className="flex flex-wrap items-center gap-2 text-sm capitalize">
            <span className="w-24">{day}</span>
            <input type="checkbox" checked={!weekly[day]?.closed} onChange={(e) => setWeekly({ ...weekly, [day]: { ...weekly[day], closed: !e.target.checked, open: weekly[day]?.open || openingTime, close: weekly[day]?.close || closingTime } })} />
            <input type="time" value={weekly[day]?.open || openingTime} onChange={(e) => setWeekly({ ...weekly, [day]: { ...weekly[day], open: e.target.value, closed: false } })} className="rounded border px-2 py-1" />
            <span>–</span>
            <input type="time" value={weekly[day]?.close || closingTime} onChange={(e) => setWeekly({ ...weekly, [day]: { ...weekly[day], close: e.target.value, closed: false } })} className="rounded border px-2 py-1" />
          </section>
        ))}
        <Button onClick={saveSchedule}>Save schedule</Button>
      </section>

      <section className="rounded-2xl border bg-white p-6 space-y-3">
        <h2 className="font-semibold">Block dates (holidays / maintenance)</h2>
        <section className="flex gap-2">
          <Input type="date" value={blockDate} onChange={(e) => setBlockDate(e.target.value)} />
          <Button type="button" onClick={addBlock}>Block</Button>
        </section>
        <ul className="text-sm text-muted">
          {ground.blockedDates?.map((bd) => (
            <li key={bd._id}>{new Date(bd.date).toLocaleDateString()} {bd.reason && `— ${bd.reason}`}</li>
          ))}
        </ul>
      </section>
      {msg && <p className="text-sm text-brand-700">{msg}</p>}
    </section>
  );
}
