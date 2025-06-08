// src/pages/ProfilePage.tsx
import { Card, CardContent, CardTitle } from '@/components/ui/card';

export default function ProfilePage() {
  return (
    <Card>
      <CardTitle>My Profile</CardTitle>
      <CardContent>
        {/* TODO: fetch /api/profiles/me/ and render form */}
        <p>Update your personal info, cycle settings, etc.</p>
      </CardContent>
    </Card>
  );
}
