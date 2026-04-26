import { useEffect, useState } from "react";
import API from "../api/axios";
import {
  Table, TableHead, TableRow, TableCell,
  TableBody, Paper, Button, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions,
  FormControlLabel, Checkbox
} from "@mui/material";

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // ✅ FULL FORM STATE (INCLUDING SECTION)
  const [form, setForm] = useState({
    name: "",
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
    action: ""
  });

  // LOAD STUDENTS
  const loadStudents = async () => {
    const res = await API.get("/students");
    setStudents(res.data);
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // SEARCH
  const searchStudent = async () => {
    const res = await API.get(`/students/search?name=${search}`);
    setStudents(res.data);
  };

  // EXPORT
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

  // OPEN ADD
  const handleOpen = () => {
    setEditId(null);
    setForm({
      name: "",
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
      action: ""
    });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  // INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // CHECKBOX CHANGE
  const handleCheckbox = (e) => {
    setForm({ ...form, [e.target.name]: e.target.checked });
  };

  // SUBMIT (ADD / UPDATE)
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

  // EDIT
  const handleEdit = (s) => {
    setEditId(s.id);
    setForm({
      name: s.name || "",
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
      action: s.action || ""
    });
    setOpen(true);
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete student?")) return;

    await API.delete(`/students/${id}`);
    loadStudents();
  };

  return (
    <div
      style={{
        padding: 20,
        minHeight: "100vh",
        background: darkMode ? "#121212" : "#f5f6fa",
        color: darkMode ? "#fff" : "#000"
      }}
    >

      <h2>Student Tracking System</h2>

      {/* TOOLBAR */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <TextField
          label="Search student"
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button variant="contained" onClick={searchStudent}>
          Search
        </Button>

        <Button variant="outlined" onClick={handleExport}>
          Export Excel
        </Button>

        <Button variant="contained" color="success" onClick={handleOpen}>
          + Add Student
        </Button>

        <Button
          variant="contained"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
        </Button>
      </div>

      {/* TABLE */}
      <Paper style={{ background: darkMode ? "#1e1e1e" : "#fff", overflowX: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {[
                "Name",
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
                "Actions"
              ].map((h) => (
                <TableCell key={h} style={{ color: darkMode ? "#fff" : "#000" }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {students.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.name}</TableCell>
                <TableCell>{s.class}</TableCell>
                <TableCell>{s.section}</TableCell>

                <TableCell>{s.abs ? "Yes" : "No"}</TableCell>
                <TableCell>{s.late ? "Yes" : "No"}</TableCell>

                <TableCell>{s.materials}</TableCell>
                <TableCell>{s.classwork}</TableCell>
                <TableCell>{s.homework}</TableCell>

                <TableCell>{s.behavior}</TableCell>
                <TableCell>{s.participation}</TableCell>

                <TableCell>{s.remarks}</TableCell>
                <TableCell>{s.action}</TableCell>

                <TableCell>
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* MODAL */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>{editId ? "Edit Student" : "Add Student"}</DialogTitle>

        <DialogContent>

          <h4>Basic Info</h4>
          <TextField fullWidth margin="dense" name="name" label="Name" value={form.name} onChange={handleChange} />
          <TextField fullWidth margin="dense" name="class" label="Class" value={form.class} onChange={handleChange} />
          <TextField fullWidth margin="dense" name="section" label="Section" value={form.section} onChange={handleChange} />

          <h4>Attendance</h4>
          <FormControlLabel
            control={<Checkbox checked={form.abs} name="abs" onChange={handleCheckbox} />}
            label="Absent"
          />

          <FormControlLabel
            control={<Checkbox checked={form.late} name="late" onChange={handleCheckbox} />}
            label="Late"
          />

          <h4>Academic</h4>
          <TextField fullWidth margin="dense" name="materials" label="Materials" value={form.materials} onChange={handleChange} />
          <TextField fullWidth margin="dense" name="classwork" label="Classwork" value={form.classwork} onChange={handleChange} />
          <TextField fullWidth margin="dense" name="homework" label="Homework" value={form.homework} onChange={handleChange} />
          <TextField fullWidth margin="dense" name="participation" label="Participation" value={form.participation} onChange={handleChange} />

          <h4>Behavior</h4>
          <TextField fullWidth margin="dense" name="behavior" label="Behavior" value={form.behavior} onChange={handleChange} />
          <TextField fullWidth margin="dense" name="remarks" label="Remarks" value={form.remarks} onChange={handleChange} />
          <TextField fullWidth margin="dense" name="action" label="Action" value={form.action} onChange={handleChange} />

        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editId ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
}