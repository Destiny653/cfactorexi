// components/icons.tsx
'use client';

import * as React from 'react';
import {
  Loader2,
  Mail,
  Lock,
  User,
  User2,
  Phone,
  Calendar,
  ChevronDown,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

// Individual icon components
export function Spinner({ className, ...props }: React.ComponentProps<typeof Loader2>) {
  return <Loader2 className={`animate-spin ${className}`} {...props} />;
}

export function EmailIcon(props: React.ComponentProps<typeof Mail>) {
  return <Mail {...props} />;
}

export function PasswordIcon(props: React.ComponentProps<typeof Lock>) {
  return <Lock {...props} />;
}

export function UserIcon(props: React.ComponentProps<typeof User>) {
  return <User {...props} />;
}

export function ProfileIcon(props: React.ComponentProps<typeof User2>) {
  return <User2 {...props} />;
}

export function PhoneIcon(props: React.ComponentProps<typeof Phone>) {
  return <Phone {...props} />;
}

export function CalendarIcon(props: React.ComponentProps<typeof Calendar>) {
  return <Calendar {...props} />;
}

export function ChevronDownIcon(props: React.ComponentProps<typeof ChevronDown>) {
  return <ChevronDown {...props} />;
}

export function EyeIcon(props: React.ComponentProps<typeof Eye>) {
  return <Eye {...props} />;
}

export function EyeOffIcon(props: React.ComponentProps<typeof EyeOff>) {
  return <EyeOff {...props} />;
}

export function ArrowRightIcon(props: React.ComponentProps<typeof ArrowRight>) {
  return <ArrowRight {...props} />;
}

export function ErrorIcon(props: React.ComponentProps<typeof AlertCircle>) {
  return <AlertCircle {...props} />;
}

export function SuccessIcon(props: React.ComponentProps<typeof CheckCircle2>) {
  return <CheckCircle2 {...props} />;
}

// Consolidated Icons object
export const Icons = {
  Spinner,
  EmailIcon,
  PasswordIcon,
  UserIcon,
  ProfileIcon,
  PhoneIcon,
  CalendarIcon,
  ChevronDownIcon,
  EyeIcon,
  EyeOffIcon,
  ArrowRightIcon,
  ErrorIcon,
  SuccessIcon
};

// Type for the Icons object
export type IconType = keyof typeof Icons;