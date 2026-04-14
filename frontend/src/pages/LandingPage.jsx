import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Zap, TrendingUp, Cpu, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { BankAppLogo } from '../components/BankAppLogo';

function LandingPage() {
  const { user, loading } = useAuth();

  // If user is already authenticated, skip the landing page
  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  const features = [
    {
      title: 'Secure Transfers',
      description: 'Send and receive money globally with bank-grade encryption and real-time fraud monitoring.',
      icon: <Shield className="h-8 w-8 text-blue-500" />,
    },
    {
      title: 'Smart AI Assistant',
      description: 'Get 24/7 personalized financial advice and customer support powered by advanced AI.',
      icon: <Cpu className="h-8 w-8 text-indigo-500" />,
    },
    {
      title: 'Instant Validation',
      description: 'Say goodbye to paperwork. Upload your documents for lightning-fast automated KYC approval.',
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
    },
    {
      title: 'Real-Time Insights',
      description: 'Track your spending habits and watch your savings grow with intelligent, interactive analytics.',
      icon: <TrendingUp className="h-8 w-8 text-emerald-500" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-200">
      {/* Navbar Alternative for Landing Page */}
      <header className="absolute top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BankAppLogo className="h-10 w-10 text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
              SmartBank
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <Link to="/login" className="text-slate-600 font-medium hover:text-blue-600 transition-colors">
              Sign In
            </Link>
            <Link to="/register">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 font-medium rounded-full px-6 transition-all transform hover:scale-105 active:scale-95">
                Open Account
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-1/4 -left-64 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold tracking-wide text-sm mb-6 border border-blue-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            Banking Reimagined
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-8">
            The Future of Banking
            <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              {' '}is Now Smart
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Experience seamless transactions, AI-driven insights, and enterprise-grade security. Join the next generation of financial technology designed for your lifestyle.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white h-14 px-8 text-lg rounded-full shadow-xl shadow-blue-500/30 transition-all transform hover:scale-105 group">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full border-2 border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 transition-all">
                Access Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything you need to build wealth</h2>
            <p className="text-slate-600 text-lg">Powerful features wrapped in an elegant experience.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 ease-out transform hover:-translate-y-2"
              >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <Shield className="h-12 w-12 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Bank-Grade Security</h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            Your money and data are protected by industry-leading 256-bit encryption and multi-factor authenticaton frameworks.
          </p>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} SmartBank Hackathon Project. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
