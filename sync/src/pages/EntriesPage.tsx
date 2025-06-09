// src/pages/EntriesPage.tsx
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Table } from '@/components/ui/table'; // or your own list

export default function EntriesPage() {
  return (
    <Card>
      <CardTitle>Daily Entries</CardTitle>
      <CardContent>
        {/* TODO: list last 7 days, link to individual entry forms */}
        <p>Log and review your daily symptoms here.</p>
      </CardContent>
    </Card>
  );
}
