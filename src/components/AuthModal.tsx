import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  MapPin,
  Crown,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo.tsx';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'owner' | 'customer';
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser, isOwner: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [tab, setTab] = useState<'signin' | 'register'>('signin');
  const [identifier, setIdentifier] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Kolkata');
  const [pincode, setPincode] = useState('700001');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const endpoint = tab === 'signin' ? '/api/auth/login' : '/api/auth/register';
      const payload =
        tab === 'signin'
          ? { identifier: identifier.trim(), password }
          : { name: name.trim(), phone: phone.trim(), email: email.trim(), password, address, city, state: 'West Bengal', pincode };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Authentication failed. Please verify your details.');
      }

      setSuccessMsg(data.message);

      setTimeout(() => {
        onLoginSuccess(data.user, data.isOwner);
        onClose();
      }, 600);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error connecting to authentication service');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#071710] border border-[#c5a880]/40 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col text-[#f7f4ee]">
        {/* Top Header */}
        <div className="p-5 sm:p-6 text-center border-b border-[#c5a880]/30 bg-[#091f16] relative">
          <button
            onClick={onClose}
            aria-label="Close Authentication Modal"
            className="absolute top-4 right-4 p-1.5 text-[#c5a880] hover:text-[#fae2b4] hover:bg-[#132d20] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <BrandLogo size="md" />
          <p className="font-serif-luxury text-sm text-[#fae2b4] mt-2">
            Sanctuary of Handcrafted Luxury
          </p>
          <p className="text-[11px] text-[#c5a880]">
            Sign in with your Phone or Gmail to continue
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[#c5a880]/20 bg-[#05140e] text-xs font-cinzel tracking-wider">
          <button
            type="button"
            onClick={() => {
              setTab('signin');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-3 font-bold border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              tab === 'signin'
                ? 'border-[#fae2b4] text-[#fae2b4] bg-[#0a1e14]'
                : 'border-transparent text-[#c5a880] hover:text-[#fae2b4]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTab('register');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-3 font-bold border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              tab === 'register'
                ? 'border-[#fae2b4] text-[#fae2b4] bg-[#0a1e14]'
                : 'border-transparent text-[#c5a880] hover:text-[#fae2b4]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Registration</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-red-950/80 border border-red-500/40 rounded-lg text-xs text-red-200">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-lg text-xs text-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* SIGN IN VIEW */}
            {tab === 'signin' ? (
              <>
                {/* Phone or Email Identifier */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#fae2b4] font-cinzel mb-1 font-semibold">
                    Phone Number or Gmail / Email Address *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#c5a880] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="8536943389 or debrajdutta200de@gmail.com"
                      className="w-full text-xs pl-9 pr-3 py-2.5 bg-[#05110a] border border-[#c5a880]/30 rounded text-[#f7f4ee] placeholder-[#b89565]/50 focus:outline-none focus:border-[#fae2b4]"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#fae2b4] font-cinzel mb-1 font-semibold">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#c5a880] absolute left-3 top-2.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your account password"
                      className="w-full text-xs pl-9 pr-10 py-2.5 bg-[#05110a] border border-[#c5a880]/30 rounded text-[#f7f4ee] placeholder-[#b89565]/50 focus:outline-none focus:border-[#fae2b4]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-[#c5a880] hover:text-[#fae2b4]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* REGISTRATION VIEW */
              <>
                {/* Full Name */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#fae2b4] font-cinzel mb-1 font-semibold">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#c5a880] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full text-xs pl-9 pr-3 py-2 bg-[#05110a] border border-[#c5a880]/30 rounded text-[#f7f4ee] placeholder-[#b89565]/50 focus:outline-none focus:border-[#fae2b4]"
                    />
                  </div>
                </div>

                {/* Mobile Phone Number */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#fae2b4] font-cinzel mb-1 font-semibold">
                    Mobile Phone Number *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs font-mono text-[#c5a880] font-bold">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="10-digit mobile number"
                      className="w-full text-xs pl-12 pr-3 py-2 bg-[#05110a] border border-[#c5a880]/30 rounded text-[#f7f4ee] placeholder-[#b89565]/50 font-mono tracking-wider focus:outline-none focus:border-[#fae2b4]"
                    />
                  </div>
                </div>

                {/* Gmail / Email Address */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#fae2b4] font-cinzel mb-1 font-semibold">
                    Gmail / Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#c5a880] absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. name@gmail.com"
                      className="w-full text-xs pl-9 pr-3 py-2 bg-[#05110a] border border-[#c5a880]/30 rounded text-[#f7f4ee] placeholder-[#b89565]/50 focus:outline-none focus:border-[#fae2b4]"
                    />
                  </div>
                </div>

                {/* Set Password */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#fae2b4] font-cinzel mb-1 font-semibold">
                    Set Account Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#c5a880] absolute left-3 top-2.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Choose a secure password"
                      className="w-full text-xs pl-9 pr-10 py-2 bg-[#05110a] border border-[#c5a880]/30 rounded text-[#f7f4ee] placeholder-[#b89565]/50 focus:outline-none focus:border-[#fae2b4]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-[#c5a880] hover:text-[#fae2b4]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Delivery Address & City (Optional) */}
                <div className="space-y-2 pt-1 border-t border-[#c5a880]/20">
                  <label className="block text-[11px] uppercase tracking-wider text-[#c5a880] font-cinzel font-semibold">
                    Delivery Address (Optional)
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#c5a880] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Apartment, Street address"
                      className="w-full text-xs pl-9 pr-3 py-2 bg-[#05110a] border border-[#c5a880]/30 rounded text-[#f7f4ee] placeholder-[#b89565]/50 focus:outline-none focus:border-[#fae2b4]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className="w-full px-3 py-2 bg-[#05110a] border border-[#c5a880]/30 rounded text-[#f7f4ee] placeholder-[#b89565]/50 focus:outline-none focus:border-[#fae2b4]"
                    />
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="Pincode"
                      className="w-full px-3 py-2 bg-[#05110a] border border-[#c5a880]/30 rounded text-[#f7f4ee] placeholder-[#b89565]/50 focus:outline-none focus:border-[#fae2b4]"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-[#c5a880] via-[#fae2b4] to-[#b89565] text-[#07150e] font-cinzel text-xs font-bold uppercase tracking-[0.2em] rounded-lg shadow-lg flex items-center justify-center space-x-2 transition-all disabled:opacity-60 cursor-pointer mt-3"
            >
              <span>
                {isLoading
                  ? 'Authenticating...'
                  : tab === 'signin'
                  ? 'Sign In'
                  : 'Complete Registration'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Footer Guarantee */}
        <div className="p-3 bg-[#05120a] border-t border-[#c5a880]/20 text-[10px] text-center text-[#c5a880] flex items-center justify-center gap-1.5 font-cinzel">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Encrypted Account Security • Mahira Select Luxury Couture</span>
        </div>
      </div>
    </div>
  );
};
