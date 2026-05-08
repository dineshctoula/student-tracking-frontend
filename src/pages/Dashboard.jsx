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
  Grid,
} from "@mui/material";

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  const [studentOpen, setStudentOpen] = useState(false);
  const [recordOpen, setRecordOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState(null);

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

  // ================= STUDENT =================
  const handleStudentChange = (e) => {
    setStudentForm({ ...studentForm, [e.target.name]: e.target.value });
  };

  const createStudent = async () => {
    await API.post("/students", studentForm);
    setStudentOpen(false);
    setStudentForm({ name: "", subject: "", class: "", section: "" });
    loadStudents();
  };

  // ================= RECORD =================
  const handleRecordChange = (e) => {
    setRecordForm({ ...recordForm, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (e) => {
    setRecordForm({ ...recordForm, [e.target.name]: e.target.checked });
  };

  const openRecordModal = (student) => {
    setSelectedStudent(student);
    setRecordOpen(true);
  };

  const addRecord = async () => {
    await API.post(
      `/students/${selectedStudent.id}/records`,
      recordForm
    );

    setRecordForm({
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

    const res = await API.get(`/students/${selectedStudent.id}`);
    setSelectedStudent(res.data);

    setRecordOpen(false);
    loadStudents();
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
      <AppBar position="static" sx={{ bgcolor: "#0f172a" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Marigold • Student Tracking
          </Typography>
        </Toolbar>
      </AppBar>

      {/* CONTENT */}
      <Box sx={{ p: { xs: 2, md: 4 } }}>

        <Typography variant="h4" fontWeight="bold" mb={3}>
          Dashboard
        </Typography>

        {/* TOOLBAR */}
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

            <Button variant="contained" onClick={() => setStudentOpen(true)}>
              + Add Student
            </Button>
          </Stack>
        </Paper>

        {/* TABLE */}
        <Paper sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: "#e2e8f0" }}>
              <TableRow>
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>Subject</b></TableCell>
                <TableCell><b>Class</b></TableCell>
                <TableCell><b>Section</b></TableCell>
                <TableCell><b>Total Records</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.subject}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>{student.section}</TableCell>

                  <TableCell>
                    {student.records?.length || 0}
                  </TableCell>

                  <TableCell>
                    <Stack direction="row" spacing={1} flexWrap="wrap">

                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => openRecordModal(student)}
                      >
                        Add Record
                      </Button>

                      <Button
                        size="small"
                        variant="outlined"
                        onClick={async () => {
                          const res = await API.get(`/students/${student.id}`);
                          setSelectedStudent(res.data);
                          setViewOpen(true);
                        }}
                      >
                        View
                      </Button>

                      <Button
                        size="small"
                        color="error"
                        variant="contained"
                        onClick={() => deleteStudent(student.id)}
                      >
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

      {/* VIEW RECORDS */}
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} fullWidth maxWidth="lg">
        <DialogTitle>Records - {selectedStudent?.name}</DialogTitle>

        <DialogContent dividers>

          {selectedStudent?.records?.length ? (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Abs</TableCell>
                  <TableCell>Late</TableCell>
                  <TableCell>Materials</TableCell>
                  <TableCell>Classwork</TableCell>
                  <TableCell>Homework</TableCell>
                  <TableCell>Behavior</TableCell>
                  <TableCell>Participation</TableCell>
                  <TableCell>Remarks</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Others</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {selectedStudent.records.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{new Date(r.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{r.abs ? "Yes" : "No"}</TableCell>
                    <TableCell>{r.late ? "Yes" : "No"}</TableCell>
                    <TableCell>{r.materials}</TableCell>
                    <TableCell>{r.classwork}</TableCell>
                    <TableCell>{r.homework}</TableCell>
                    <TableCell>{r.behavior}</TableCell>
                    <TableCell>{r.participation}</TableCell>
                    <TableCell>{r.remarks}</TableCell>
                    <TableCell>{r.action}</TableCell>
                    <TableCell>{r.others}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography>No records found</Typography>
          )}

        </DialogContent>

        <DialogActions>
          <Button onClick={() => setViewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* ADD RECORD */}
      <Dialog open={recordOpen} onClose={() => setRecordOpen(false)} fullWidth maxWidth="md">

        <DialogTitle>Add Record</DialogTitle>

        <DialogContent>
          <Grid container spacing={2}>

            <Grid item xs={6}>
              <FormControlLabel
                control={<Checkbox name="abs" checked={recordForm.abs} onChange={handleCheckbox} />}
                label="Absent"
              />
            </Grid>

            <Grid item xs={6}>
              <FormControlLabel
                control={<Checkbox name="late" checked={recordForm.late} onChange={handleCheckbox} />}
                label="Late"
              />
            </Grid>

            {["materials","classwork","homework","behavior","participation","remarks","action","others"].map((f) => (
              <Grid item xs={12} key={f}>
                <TextField
                  fullWidth
                  name={f}
                  label={f}
                  value={recordForm[f]}
                  onChange={handleRecordChange}
                />
              </Grid>
            ))}

          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setRecordOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={addRecord}>Save</Button>
        </DialogActions>

      </Dialog>

      {/* ADD STUDENT */}
      <Dialog open={studentOpen} onClose={() => setStudentOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Student</DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField name="name" label="Name" onChange={handleStudentChange} />
            <TextField name="subject" label="Subject" onChange={handleStudentChange} />
            <TextField name="class" label="Class" onChange={handleStudentChange} />
            <TextField name="section" label="Section" onChange={handleStudentChange} />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setStudentOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={createStudent}>Save</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}