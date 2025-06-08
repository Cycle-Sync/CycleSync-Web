import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { Check } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    'Personalized cycle tracking',
    'Daily symptom logging',
    'Predictive calendar view',
    'Hormone dashboard & insights',
    'Secure JWT-based authentication',
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <header className="flex items-center justify-between p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          CycleSync
        </h1>
        <ModeToggle />
      </header>

      <main className="flex-grow flex items-center justify-center px-6">
        <Card className="w-full max-w-4xl">
          <CardHeader>
            <CardTitle className="text-4xl">Welcome to CycleSync</CardTitle>
            <CardDescription className="mt-2 text-lg">
              Your all-in-one menstrual cycle tracker—stay in tune with your body,
              log daily symptoms, and get predictive insights tailored just for you.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ul className="space-y-3">
              {features.map((feat) => (
                <li key={feat} className="flex items-center">
                  <Check className="mr-2 h-5 w-5 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-200">
                    {feat}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>

          <CardFooter className="flex justify-center space-x-4">
            <Button size="lg" onClick={() => navigate('/register')}>Get Started</Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/login')}>Login</Button>
          </CardFooter>
        </Card>
      </main>

      <footer className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} CycleSync. All rights reserved.
      </footer>
    </div>
  );
}
