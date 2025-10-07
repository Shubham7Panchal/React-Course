// MarkAttendance.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MarkAttendance({ classId, date /* ISO yyyy-mm-dd */ }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // local state: { [studentId]: { status: "present"|"absent"|"late", note: "" } }
  const [localMarks, setLocalMarks] = useState({});

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/classes/${classId}/students`)
      .then(res => {
        setStudents(res.data);
        // optionally fetch existing attendance
        return axios.get("/api/attendance", { params: { classId, date }});
      })
      .then(res => {
        const marks = {};
        (res?.data || []).forEach(rec => {
          marks[rec.student_id] = { status: rec.status, note: rec.note || "", recordId: rec.id };
        });
        setLocalMarks(marks);
      })
      .catch(err => setError(err.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, [classId, date]);

  const setStatus = (studentId, status) => {
    setLocalMarks(prev => ({ ...prev, [studentId]: { ...(prev[studentId]||{}), status }}));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    // prepare payload
    const payload = students.map(s => {
      const mark = localMarks[s.id] || { status: "absent", note: "" };
      return { studentId: s.id, status: mark.status, note: mark.note };
    });
    try {
      // optimistic UI could update here; we're doing server save then refresh
      await axios.post("/api/attendance/bulk", { classId, date, entries: payload });
      // refresh attendance
      const res = await axios.get("/api/attendance", { params: { classId, date }});
      const marks = {};
      (res.data || []).forEach(rec => marks[rec.student_id] = { status: rec.status, note: rec.note, recordId: rec.id });
      setLocalMarks(marks);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading…</div>;
  if (error) return <div style={{color:"red"}}>{error}</div>;

  return (
    <div>
      <h2>Mark Attendance — {date}</h2>
      <table>
        <thead>
          <tr><th>Roll</th><th>Name</th><th>Present</th><th>Late</th><th>Absent</th><th>Note</th></tr>
        </thead>
        <tbody>
          {students.map(s => {
            const mark = localMarks[s.id] || {};
            return (
              <tr key={s.id}>
                <td>{s.roll_no}</td>
                <td>{s.name}</td>
                <td><input type="radio" name={`st-${s.id}`} checked={mark.status==="present"} onChange={()=>setStatus(s.id,"present")} /></td>
                <td><input type="radio" name={`st-${s.id}`} checked={mark.status==="late"} onChange={()=>setStatus(s.id,"late")} /></td>
                <td><input type="radio" name={`st-${s.id}`} checked={mark.status==="absent"} onChange={()=>setStatus(s.id,"absent")} /></td>
                <td><input value={mark.note||""} onChange={e=>setLocalMarks(prev=>({...prev,[s.id]:{...(prev[s.id]||{}),note:e.target.value}}))} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{marginTop:12}}>
        <button onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save Attendance"}</button>
      </div>
    </div>
  );
}
