import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'

export default function LoginScreen() {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const success = await login(username, password)
      if (success) {
        toast.success('Logged in successfully!')
      } else {
        setError('Invalid username or password')
        toast.error('Invalid credentials')
      }
    } catch (err) {
      setError('An error occurred during login')
      toast.error('Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickLogin = async (quickUsername: string, quickPassword: string) => {
    setIsLoading(true)
    try {
      const success = await login(quickUsername, quickPassword)
      if (success) {
        toast.success(`Logged in as ${quickUsername}`)
      }
    } catch (err) {
      toast.error('Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">AntoMart</h1>
          <p className="text-muted-foreground">Retail Management System</p>
        </div>

        {/* Login Card */}
        <Card className="p-8 mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Sign In</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-sm font-medium text-foreground">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="mt-1"
              />
            </div>

            {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

            <Button
              type="submit"
              disabled={isLoading || !username || !password}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </Card>

        {/* Demo Credentials */}
        <Card className="p-6 bg-muted/50">
          <h3 className="text-sm font-semibold text-foreground mb-4">Demo Credentials</h3>
          <div className="space-y-3">
            <div className="bg-background p-3 rounded-md">
              <p className="text-xs text-muted-foreground">Admin Account</p>
              <p className="text-sm font-mono text-foreground">Username: admin</p>
              <p className="text-sm font-mono text-foreground">Password: admin123</p>
              <Button
                size="sm"
                variant="outline"
                className="w-full mt-2 text-xs"
                onClick={() => handleQuickLogin('admin', 'admin123')}
                disabled={isLoading}
              >
                Login as Admin
              </Button>
            </div>

            <div className="bg-background p-3 rounded-md">
              <p className="text-xs text-muted-foreground">Cashier Account</p>
              <p className="text-sm font-mono text-foreground">Username: cashier1</p>
              <p className="text-sm font-mono text-foreground">Password: cashier123</p>
              <Button
                size="sm"
                variant="outline"
                className="w-full mt-2 text-xs"
                onClick={() => handleQuickLogin('cashier1', 'cashier123')}
                disabled={isLoading}
              >
                Login as Cashier
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
