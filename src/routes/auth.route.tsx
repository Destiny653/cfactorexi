import { Routes, Route, Navigate } from 'react-router-dom'
import ResetPasswordForm from '../components/auth/resetPasswordForm'
import ForgotPasswordForm from '../components/auth/forgotPasswordForm'
import RegisterForm from '../components/auth/registrationForm'
import EmailVerified from '../components/auth/EmailVerified'
import VerificationSuccess from '../components/auth/VerificationSuccess'
import VerificationFailed from '../components/auth/VerificationFailed'
import LoginForm from '../components/auth/LoginForm'

export default function AuthRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="login" element={<Navigate to="/login" replace />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/forgot-password" element={<ForgotPasswordForm />} />
      <Route path="/reset-password" element={<ResetPasswordForm />} />
      <Route path="/email-verified" element={<EmailVerified />} />
      <Route path="/verification-success" element={<VerificationSuccess />} />
      <Route path="/verification-failed" element={<VerificationFailed />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
