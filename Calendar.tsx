import React, { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/layouts/AppShell";
import { Button, Card, CardBody, Alert, Tabs, Tab } from "@heroui/react";
import { DayGrid } from "@/components/calendar/DayGrid";
import MonthGrid from "@/components/calendar/MonthGrid";
import EncounterModal from "@/components/calendar/EncounterModal";
import ReservationModal from "@/components/calendar/ReservationModal";
import BusyModal from "@/components/calendar/BusyModal";
import { fetchCalendarDay, fetchCalendarRange, setReservationStatus } from "@/utils/reservations";
import type { CalendarEvent } from "@/types/calendar";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight, Calendar as CalIcon, RefreshCcw, Plus, Ban, Hospital } from "lucide-react";

const fmt = (d: Date) => dayjs(d).format("YYYY-MM-DD");

const CalendarPage: React.FC = () => {
  const [view, setView] = useState<"day"|"month"|"year">("day"); // (week view can be added similarly)
  const [dateISO, setDateISO] = useState(fmt(new Date()));
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [openRes, setOpenRes] = useState(false);
  const [openBusy, setOpenBusy] = useState(false);

  // encounter
  const [openEncounter, setOpenEncounter] = useState(false);
  const [encResId, setEncResId] = useState<string>("");
  const [encPatientName, setEncPatientName] = useState<string>("");

  const load = async () => {
    setLoading(true); setErr(null);
    try {
      if (view === "day") {
        const d = await fetchCalendarDay(dateISO);
        setEvents(d.data || []);
      } else if (view === "month") {
        const from = dayjs(dateISO).startOf("month").startOf("week").toISOString();
        const to = dayjs(dateISO).endOf("month").endOf("week").toISOString();
        const d = await fetchCalendarRange(from, to);
        setEvents(d.data || []);
      } else {
        // year view: load current month for speed
        const from = dayjs(dateISO).startOf("month").startOf("week").toISOString();
        const to = dayjs(dateISO).endOf("month").endOf("week").toISOString();
        const d = await fetchCalendarRange(from, to);
        setEvents(d.data || []);
      }
    } catch (e: any) {
      setErr(e?.message || "Failed to load calendar");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [dateISO, view]);

  const goPrev = () => {
    setDateISO(fmt(dayjs(dateISO)[view==="day" ? "subtract" : "subtract"](view==="day" ? 1 : 1, view==="day" ? "day" : "month").toDate()));
  };
  const goNext = () => {
    setDateISO(fmt(dayjs(dateISO)[view==="day" ? "add" : "add"](view==="day" ? 1 : 1, view==="day" ? "day" : "month").toDate()));
  };
  const goToday = () => { setDateISO(fmt(new Date())); setView("day"); };

  const onAction = async (id: string, action: 'confirm' | 'start' | 'done' | 'cancel' | 'noshow') => {
    setErr(null); setSuccess(null);
    try {
      const map: any = { confirm: 'confirmed', start: 'in_progress', done: 'completed', cancel: 'canceled', noshow: 'no_show' };
      const status = map[action];
      await setReservationStatus(id, status);
      setSuccess(`Status set to ${status}.`);
      await load();
    } catch (e: any) {
      setErr(e?.message || "Failed to update status");
    }
  };

  // click event → open encounter (only for reservations)
  const onEventClick = (ev: CalendarEvent) => {
    if (ev.type !== 'reservation') return;
    setEncResId(ev._id);
    setEncPatientName(ev.patientName || "Patient");
    setOpenEncounter(true);
  };

  return (
    <AppShell>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button variant="light" isIconOnly onPress={goPrev}><ChevronLeft /></Button>
          <Button variant="light" isIconOnly onPress={goNext}><ChevronRight /></Button>
          <Button variant="flat" startContent={<CalIcon className="size-4" />} onPress={goToday}>Today</Button>
          <div className="text-default-600 font-medium">{dayjs(dateISO).format("ddd DD MMM YYYY")}</div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="flat" startContent={<Hospital className="size-4" />} onPress={() => { setOpenRes(true); /* you can seed kind='surgery' via prop if you modified modal */ }}>
            New Surgery
          </Button>
          <Button variant="flat" startContent={<Plus className="size-4" />} onPress={() => setOpenRes(true)}>
            New Reservation
          </Button>
          <Button variant="flat" startContent={<Ban className="size-4" />} onPress={() => setOpenBusy(true)}>
            Add Busy Block
          </Button>
          <Button variant="light" startContent={<RefreshCcw className="size-4" />} onPress={load} isDisabled={loading}>
            Refresh
          </Button>
        </div>
      </div>

      {err && <Alert color="danger" variant="flat" title="Error" description={err} isClosable onClose={() => setErr(null)} className="mb-4" />}
      {success && <Alert color="success" variant="flat" title="Success" description={success} isClosable onClose={() => setSuccess(null)} className="mb-4" />}

      <Tabs selectedKey={view} onSelectionChange={(k)=>setView(k as any)} className="mb-4" variant="underlined">
        <Tab key="day" title="Day" />
        <Tab key="month" title="Month" />
        <Tab key="year" title="Year" />
      </Tabs>

      <Card className="mb-6">
        <CardBody>
          {view === "day" && (
            <DayGrid
              dateISO={dateISO}
              events={events}
              startHour={8}
              endHour={20}
              // @ts-ignore - extend DayGrid to accept onEventClick if not already
              onEventClick={onEventClick}
            />
          )}
          {view === "month" && (
            <MonthGrid
              monthISO={dateISO}
              events={events}
              onPickDay={(iso)=>{ setDateISO(iso); setView("day"); }}
            />
          )}
          {view === "year" && (
            <div className="space-y-3">
              <div className="text-sm text-default-500">Pick a month:</div>
              {/* simple year strip */}
              <div className="grid grid-cols-6 gap-2">
                {Array.from({length:12}).map((_,i) => {
                  const mISO = dayjs(dateISO).month(i).date(1).format("YYYY-MM-DD");
                  return <Button key={i} size="sm" variant="flat" onPress={()=>{ setDateISO(mISO); setView("month"); }}>{dayjs(mISO).format("MMM")}</Button>;
                })}
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Optional: Today board kept in day view only */}
      {/* {view==="day" && <TodayBoard events={events} onAction={onAction} />} */}

      {/* Modals */}
      <ReservationModal
        open={openRes}
        dateISO={dateISO}
        onClose={() => setOpenRes(false)}
        onSaved={load}
      />
      <BusyModal
        open={openBusy}
        dateISO={dateISO}
        onClose={() => setOpenBusy(false)}
        onSaved={load}
      />
      <EncounterModal
        open={openEncounter}
        reservationId={encResId}
        patientName={encPatientName}
        onClose={() => setOpenEncounter(false)}
      />
    </AppShell>
  );
};

export default CalendarPage;
