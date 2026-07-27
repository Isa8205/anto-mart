import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const Onboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [currency, setCurrency] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNext = () => {
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!businessName || !currency) {
      setError('Business Name and Currency are required.');
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);

    // Simulate success
    console.log('Onboarding data:', { businessName, address, phone, email, currency });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      {step === 1 && (
        <Card className="w-full max-w-lg p-6 text-center">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Welcome to AntoMart!</CardTitle>
            <CardDescription className="mt-2 text-lg">
              Your ultimate solution for Point of Sale and Inventory Management.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-md text-gray-700 dark:text-gray-300">
              Get ready to streamline your business operations, manage your inventory with ease,
              and track your sales like never before. AntoMart is designed to be intuitive,
              powerful, and efficient.
            </p>
            <Button onClick={handleNext} className="w-full">
              Let's Get Started!
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="w-full max-w-lg p-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Business Information</CardTitle>
            <CardDescription>
              Please provide some basic details about your business to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name <span className="text-red-500">*</span></Label>
                <Input
                  id="businessName"
                  placeholder="e.g., AntoMart Supermarket"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="e.g., 123 Main St, City, Country"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="e.g., +123 456 7890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g., info@antomart.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency <span className="text-red-500">*</span></Label>
                <Select onValueChange={setCurrency} value={currency} required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - United States Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="KES">KES - Kenyan Shilling</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Saving...' : 'Complete Setup'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Onboarding;
