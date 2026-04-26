import { useEffect, useState } from "react";
import API from "../api/axios";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  AppBar,
  Toolbar,
  Stack,
  Divider,
} from "@mui/material";

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const [form, setForm] = useState({
    name: "",
    subject: "",
    class: "",
    section: "",
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

  // ---------------- LOAD ----------------
  const loadStudents = async () => {
    const res = await API.get("/students");
    setStudents(res.data);
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // ---------------- SEARCH ----------------
  const searchStudent = async () => {
    if (!search) return loadStudents();

    const res = await API.get(`/students/search?name=${search}`);
    setStudents(res.data);
  };

  // ---------------- EXPORT ----------------
  const handleExport = async () => {
    try {
      const response = await API.get("/students/export", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "students.xlsx");

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert("Export failed");
    }
  };

  // ---------------- OPEN MODAL ----------------
  const handleOpen = () => {
    setEditId(null);
    setForm({
      name: "",
      subject: "",
      class: "",
      section: "",
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
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  // ---------------- FORM ----------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (e) => {
    setForm({ ...form, [e.target.name]: e.target.checked });
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async () => {
    try {
      if (editId) {
        await API.patch(`/students/${editId}`, form);
      } else {
        await API.post("/students", form);
      }

      setOpen(false);
      setEditId(null);
      loadStudents();
    } catch {
      alert("Error saving student");
    }
  };

  // ---------------- EDIT ----------------
  const handleEdit = (s) => {
    setEditId(s.id);

    setForm({
      name: s.name || "",
      subject: s.subject || "",
      class: s.class || "",
      section: s.section || "",
      abs: s.abs || false,
      late: s.late || false,
      materials: s.materials || "",
      classwork: s.classwork || "",
      homework: s.homework || "",
      behavior: s.behavior || "",
      participation: s.participation || "",
      remarks: s.remarks || "",
      action: s.action || "",
      others: s.others || "",
    });

    setOpen(true);
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete student?")) return;
    await API.delete(`/students/${id}`);
    loadStudents();
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: darkMode ? "#0f172a" : "#f1f5f9" }}>

      {/* TOP BAR */}
      <AppBar position="static" sx={{ bgcolor: "#1e293b" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Marigold • Student Tracking
          </Typography>

          <Button
            variant="contained"
            onClick={() => setDarkMode(!darkMode)}
            sx={{ bgcolor: "#334155" }}
          >
            {darkMode ? "Light ☀️" : "Dark 🌙"}
          </Button>
        </Toolbar>
      </AppBar>

      {/* CONTENT */}
      <Box sx={{ p: 3 }}>

        <Typography variant="h5" fontWeight="bold" mb={2}>
          Dashboard
        </Typography>

        {/* TOOLBAR */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <TextField
              label="Search student..."
              size="small"
              onChange={(e) => setSearch(e.target.value)}
            />

            <Button variant="contained" onClick={searchStudent}>
              Search
            </Button>

            <Button variant="outlined" onClick={handleExport}>
              Export
            </Button>

            <Button variant="contained" color="success" onClick={handleOpen}>
              + Add Student
            </Button>
          </Stack>
        </Paper>

        {/* TABLE */}
        <Paper>
          <Table size="small">

            <TableHead sx={{ bgcolor: "#e2e8f0" }}>
              <TableRow>
                {[
                  "Name",
                  "Subject",
                  "Class",
                  "Section",
                  "Abs",
                  "Late",
                  "Materials",
                  "Classwork",
                  "Homework",
                  "Behavior",
                  "Participation",
                  "Remarks",
                  "Action",
                  "Others",
                  "Actions",
                ].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: "bold" }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {students.map((s) => (
                <TableRow key={s.id} hover>

                  <TableCell>{s.name}</TableCell>
                  <TableCell>{s.subject}</TableCell>
                  <TableCell>{s.class}</TableCell>
                  <TableCell>{s.section}</TableCell>
                  <TableCell>{s.abs ? "✔" : "—"}</TableCell>
                  <TableCell>{s.late ? "✔" : "—"}</TableCell>
                  <TableCell>{s.materials}</TableCell>
                  <TableCell>{s.classwork}</TableCell>
                  <TableCell>{s.homework}</TableCell>
                  <TableCell>{s.behavior}</TableCell>
                  <TableCell>{s.participation}</TableCell>
                  <TableCell>{s.remarks}</TableCell>
                  <TableCell>{s.action}</TableCell>
                  <TableCell>{s.others}</TableCell>

                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button size="small" onClick={() => handleEdit(s)}>
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDelete(s.id)}
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

      {/* MODAL */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">

        <DialogTitle>
          {editId ? "Edit Student" : "Add Student"}
        </DialogTitle>

        <DialogContent dividers>

          <Stack spacing={2}>
            <TextField name="name" label="Name" value={form.name} onChange={handleChange} />
            <TextField name="subject" label="Subject" value={form.subject} onChange={handleChange} />
            <TextField name="class" label="Class" value={form.class} onChange={handleChange} />
            <TextField name="section" label="Section" value={form.section} onChange={handleChange} />

            <FormControlLabel
              control={<Checkbox name="abs" checked={form.abs} onChange={handleCheckbox} />}
              label="Absent"
            />
            <FormControlLabel
              control={<Checkbox name="late" checked={form.late} onChange={handleCheckbox} />}
              label="Late"
            />

            <TextField name="materials" label="Materials" value={form.materials} onChange={handleChange} />
            <TextField name="classwork" label="Classwork" value={form.classwork} onChange={handleChange} />
            <TextField name="homework" label="Homework" value={form.homework} onChange={handleChange} />
            <TextField name="behavior" label="Behavior" value={form.behavior} onChange={handleChange} />
            <TextField name="participation" label="Participation" value={form.participation} onChange={handleChange} />
            <TextField name="remarks" label="Remarks" value={form.remarks} onChange={handleChange} />
            <TextField name="action" label="Action" value={form.action} onChange={handleChange} />
            <TextField name="others" label="Others" value={form.others} onChange={handleChange} />
          </Stack>

        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editId ? "Update" : "Save"}
          </Button>
        </DialogActions>

      </Dialog>

    </Box>
  );
}