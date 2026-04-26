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
  Grid,
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

  const loadStudents = async () => {
    const res = await API.get("/students");
    setStudents(res.data);
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const searchStudent = async () => {
    if (!search) return loadStudents();
    const res = await API.get(`/students/search?name=${search}`);
    setStudents(res.data);
  };

  const handleExport = async () => {
    try {
      const response = await API.get("/students/export", {
        params: search ? { name: search } : {},
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (e) => {
    setForm({ ...form, [e.target.name]: e.target.checked });
  };

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

  const handleEdit = (s) => {
    setEditId(s.id);
    setForm({ ...s });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete student?")) return;
    await API.delete(`/students/${id}`);
    loadStudents();
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: darkMode ? "#0f172a" : "#f1f5f9" }}>

      {/* TOP BAR */}
      <AppBar position="static" sx={{ bgcolor: "#1e293b" }}>
        <Toolbar sx={{ flexWrap: "wrap", gap: 1 }}>
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
      <Box sx={{ p: { xs: 1, md: 3 } }}>

        <Typography variant="h5" fontWeight="bold" mb={2}>
          Dashboard
        </Typography>

        {/* TOOLBAR - RESPONSIVE */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Search student..."
                size="small"
                onChange={(e) => setSearch(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={8}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
              >
                <Button variant="contained" onClick={searchStudent} fullWidth>
                  Search
                </Button>

                <Button variant="outlined" onClick={handleExport} fullWidth>
                  Export
                </Button>

                <Button
                  variant="contained"
                  color="success"
                  onClick={handleOpen}
                  fullWidth
                >
                  + Add Student
                </Button>
              </Stack>
            </Grid>

          </Grid>
        </Paper>

        {/* TABLE WRAPPER (IMPORTANT FOR MOBILE SCROLL) */}
        <Paper sx={{ overflowX: "auto" }}>
          <Table size="small" sx={{ minWidth: 1200 }}>

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
                  <TableCell key={h} sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
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
                      <Button size="small" color="error" onClick={() => handleDelete(s.id)}>
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

      {/* MODAL - FIXED STRUCTURE */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">

        <DialogTitle>
          {editId ? "Edit Student" : "Add Student"}
        </DialogTitle>

        <DialogContent dividers>

          <Grid container spacing={2}>

            {[
              "name",
              "subject",
              "class",
              "section",
              "materials",
              "classwork",
              "homework",
              "behavior",
              "participation",
              "remarks",
              "action",
              "others",
            ].map((field) => (
              <Grid item xs={12} sm={6} key={field}>
                <TextField
                  fullWidth
                  name={field}
                  label={field.toUpperCase()}
                  value={form[field]}
                  onChange={handleChange}
                />
              </Grid>
            ))}

          </Grid>

          <Box mt={2}>
            <FormControlLabel
              control={<Checkbox name="abs" checked={form.abs} onChange={handleCheckbox} />}
              label="Absent"
            />
            <FormControlLabel
              control={<Checkbox name="late" checked={form.late} onChange={handleCheckbox} />}
              label="Late"
            />
          </Box>

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