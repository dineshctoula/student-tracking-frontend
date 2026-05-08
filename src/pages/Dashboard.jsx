import { useEffect, useState } from "react";
import API from "../api/axios";

import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Paper,
  Stack,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  const [studentOpen, setStudentOpen] = useState(false);
  const [recordOpen, setRecordOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [studentForm, setStudentForm] = useState({
    name: "",
    subject: "",
    class: "",
    section: "",
  });

  const [recordForm, setRecordForm] = useState({
    abs: false,
    late: false,
    materials: "",
    classwork: "",
    homework: "",
    behavior: "",
    participation: "",
    remarks: "",
    action: "",
    others: "",
  });

  // ================= LOAD =================
  const loadStudents = async () => {
    const res = await API.get("/students");
    setStudents(res.data);
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // ================= SEARCH =================
  const searchStudent = async () => {
    if (!search) return loadStudents();
    const res = await API.get(`/students/search?name=${search}`);
    setStudents(res.data);
  };

  // ================= EXPORT (CORRECT PLACE) =================
  const handleExport = async () => {
    const res = await API.get("/students/export", {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = "students.xlsx";
    a.click();
  };

  // ================= STUDENT CREATE/UPDATE =================
  const handleStudentChange = (e) => {
    setStudentForm({ ...studentForm, [e.target.name]: e.target.value });
  };

  const openAddStudent = () => {
    setEditMode(false);
    setStudentForm({ name: "", subject: "", class: "", section: "" });
    setStudentOpen(true);
  };

  const openEditStudent = (student) => {
    setEditMode(true);
    setSelectedStudent(student);
    setStudentForm(student);
    setStudentOpen(true);
  };

  const saveStudent = async () => {
    if (editMode) {
      await API.patch(`/students/${selectedStudent.id}`, studentForm);
    } else {
      await API.post("/students", studentForm);
    }

    setStudentOpen(false);
    loadStudents();
  };

  // ================= RECORD =================
  const handleRecordChange = (e) => {
    setRecordForm({ ...recordForm, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (e) => {
    setRecordForm({ ...recordForm, [e.target.name]: e.target.checked });
  };

  const openRecord = (student) => {
    setSelectedStudent(student);
    setRecordOpen(true);
  };

  const addRecord = async () => {
    await API.post(
      `/students/${selectedStudent.id}/records`,
      recordForm
    );

    setRecordOpen(false);
    loadStudents();
  };

  // ================= FILTER =================
  const filterRecords = async (studentId) => {
    const res = await API.get(`/students/${studentId}/records`, {
      params: {
        from: fromDate || undefined,
        to: toDate || undefined,
      },
    });

    setSelectedStudent({ ...selectedStudent, records: res.data });
  };

  // ================= DELETE =================
  const deleteStudent = async (id) => {
    if (!window.confirm("Delete student?")) return;
    await API.delete(`/students/${id}`);
    loadStudents();
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>

      {/* TOP BAR */}
      <AppBar position="static">
        <Toolbar>
          <Typography sx={{ flexGrow: 1 }}>
            Student Tracking System
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>

        <Typography variant="h4" mb={2}>
          Dashboard
        </Typography>

        {/* SEARCH + EXPORT (CORRECT PLACE) */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>

            <TextField
              label="Search student"
              fullWidth
              onChange={(e) => setSearch(e.target.value)}
            />

            <Button variant="contained" onClick={searchStudent}>
              Search
            </Button>

            <Button variant="outlined" color="success" onClick={handleExport}>
              Export Excel
            </Button>

            <Button variant="contained" onClick={openAddStudent}>
              + Add Student
            </Button>

          </Stack>
        </Paper>

        {/* TABLE */}
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Section</TableCell>
                <TableCell>Records</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {students.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{s.class}</TableCell>
                  <TableCell>{s.section}</TableCell>
                  <TableCell>{s.records?.length || 0}</TableCell>

                  <TableCell>
                    <Stack direction="row" spacing={1}>

                      <Button onClick={() => openRecord(s)}>
                        Add
                      </Button>

                      <Button onClick={() => {
                        API.get(`/students/${s.id}`).then(res => {
                          setSelectedStudent(res.data);
                          setViewOpen(true);
                        });
                      }}>
                        View
                      </Button>

                      <Button onClick={() => openEditStudent(s)}>
                        Edit
                      </Button>

                      <Button color="error" onClick={() => deleteStudent(s.id)}>
                        Delete
                      </Button>

                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>

      {/* ADD / EDIT STUDENT */}
      <Dialog open={studentOpen} onClose={() => setStudentOpen(false)}>
        <DialogTitle>
          {editMode ? "Edit Student" : "Add Student"}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField name="name" label="Name" value={studentForm.name} onChange={handleStudentChange} />
            <TextField name="subject" label="Subject" value={studentForm.subject} onChange={handleStudentChange} />
            <TextField name="class" label="Class" value={studentForm.class} onChange={handleStudentChange} />
            <TextField name="section" label="Section" value={studentForm.section} onChange={handleStudentChange} />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setStudentOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={saveStudent}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* VIEW + FILTER */}
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} fullWidth maxWidth="lg">
        <DialogTitle>
          Records - {selectedStudent?.name}
        </DialogTitle>

        <DialogContent>

          {/* FILTER */}
          <Stack direction="row" spacing={2} mb={2}>
            <TextField type="date" onChange={(e) => setFromDate(e.target.value)} />
            <TextField type="date" onChange={(e) => setToDate(e.target.value)} />

            <Button onClick={() => filterRecords(selectedStudent.id)}>
              Filter
            </Button>

            <Button onClick={async () => {
              const res = await API.get(`/students/${selectedStudent.id}`);
              setSelectedStudent(res.data);
            }}>
              Reset
            </Button>
          </Stack>

          {/* TABLE */}
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Abs</TableCell>
                <TableCell>Late</TableCell>
                <TableCell>Homework</TableCell>
                <TableCell>Behavior</TableCell>
                <TableCell>Remarks</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {selectedStudent?.records?.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{new Date(r.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{r.abs ? "Yes" : "No"}</TableCell>
                  <TableCell>{r.late ? "Yes" : "No"}</TableCell>
                  <TableCell>{r.homework}</TableCell>
                  <TableCell>{r.behavior}</TableCell>
                  <TableCell>{r.remarks}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

        </DialogContent>

        <DialogActions>
          <Button onClick={() => setViewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* ADD RECORD */}
      <Dialog open={recordOpen} onClose={() => setRecordOpen(false)}>
        <DialogTitle>Add Record</DialogTitle>

        <DialogContent>
          <Stack spacing={2}>
            <FormControlLabel control={<Checkbox name="abs" onChange={handleCheckbox} />} label="Absent" />
            <FormControlLabel control={<Checkbox name="late" onChange={handleCheckbox} />} label="Late" />

            <TextField name="homework" label="Homework" onChange={handleRecordChange} />
            <TextField name="behavior" label="Behavior" onChange={handleRecordChange} />
            <TextField name="remarks" label="Remarks" onChange={handleRecordChange} />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setRecordOpen(false)}>Cancel</Button>
          <Button onClick={addRecord}>Save</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}