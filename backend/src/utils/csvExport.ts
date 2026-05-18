import { ILead } from '../types';

interface CsvRow {
  Name: string;
  Email: string;
  Status: string;
  Source: string;
  Notes: string;
  'Created At': string;
}

export const generateCsvContent = (leads: ILead[]): string => {
  const headers: (keyof CsvRow)[] = [
    'Name',
    'Email',
    'Status',
    'Source',
    'Notes',
    'Created At',
  ];

  const escapeField = (field: string): string => {
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  };

  const rows: CsvRow[] = leads.map((lead) => ({
    Name: lead.name,
    Email: lead.email,
    Status: lead.status,
    Source: lead.source,
    Notes: lead.notes ?? '',
    'Created At': new Date(lead.createdAt).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
  }));

  const csvLines = [
    headers.map(escapeField).join(','),
    ...rows.map((row) =>
      headers.map((h) => escapeField(row[h])).join(',')
    ),
  ];

  return csvLines.join('\n');
};
