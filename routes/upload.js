import express from 'express';
import multer from 'multer';
import ExcelJS from 'exceljs';
import db from '../db.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // temp folder for uploaded files

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);

    const worksheet = workbook.worksheets[0]; // first sheet
    const insert = db.prepare(
      'INSERT INTO contacts (name, surname, email, age) VALUES (?, ?, ?, ?)'
    );

    let count = 0;

worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // skip header row

      const name = row.getCell(1).value ?? null;
      const surname = row.getCell(2).value ?? null;
      const emailCell = row.getCell(3).value;
      const email = (typeof emailCell === 'object' && emailCell !== null)
        ? emailCell.text ?? null
        : emailCell ?? null;
      const age = row.getCell(4).value ?? null;

      console.log('Row', rowNumber, '→', { name, surname, email, age });

      if (!name) return; // skip empty rows

      insert.run(name, surname, email, age);
      count++;
    });

    res.json({ message: `Inserted ${count} contacts.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process file.' });
  }
});

export default router;