import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent} from "../../components/ui/card";
import { 
  Loader2, 
  Lock, 
  User, 
  Eye, 
  EyeOff,
  AlertCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface LoginFormData {
  username: string;
  password: string;
}

const loginSchema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
});

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const success = await login(data.username, data.password);
      if (success) {
        navigate('/dashboard');
      } else {
        setErrorMessage('Invalid username or password');
      }
    } catch (error) {
      console.error('Login failed', error);
      setErrorMessage('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md md:max-w-xl lg:max-w-2xl"
      >
        <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 sm:h-3 w-full"></div>
          <CardHeader className="space-y-2 px-6 sm:px-8 md:px-12 pt-8 sm:pt-10 md:pt-12 pb-6 sm:pb-8">
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4 sm:p-5 rounded-xl shadow-md">
                <Lock className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center text-gray-500 text-base sm:text-lg md:text-xl">
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 sm:space-y-8 px-6 sm:px-8 md:px-12 py-6 sm:py-8">
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-50 text-red-600 p-3 sm:p-4 md:p-5 rounded-lg flex items-start gap-3 sm:gap-4"
              >
                <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 mt-0.5" />
                <span className="text-sm sm:text-base md:text-lg">{errorMessage}</span>
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
              <div className="space-y-3 sm:space-y-4">
                <Label htmlFor="username" className="text-gray-700 text-base sm:text-lg md:text-xl">
                  Username
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 md:pl-5 flex items-center pointer-events-none">
                    <User className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-gray-400" />
                  </div>
                  <Input
                    id="username"
                    {...register('username')}
                    placeholder="john.doe"
                    className="pl-10 sm:pl-12 md:pl-14 py-4 sm:py-5 md:py-7 text-base sm:text-lg md:text-xl"
                    disabled={isLoading}
                  />
                </div>
                {errors.username && (
                  <p className="text-red-500 text-base sm:text-lg">
                    {errors.username.message}
                  </p>
                )}
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <Label htmlFor="password" className="text-gray-700 text-base sm:text-lg md:text-xl">
                  Password
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 md:pl-5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    placeholder="••••••••"
                    className="pl-10 sm:pl-12 md:pl-14 py-4 sm:py-5 md:py-7 text-base sm:text-lg md:text-xl pr-10 sm:pr-12 md:pr-14"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 sm:pr-4 md:pr-5 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-base sm:text-lg">
                    {errors.password.message}
                  </p>
                )}
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm sm:text-base md:text-lg text-blue-600 hover:underline"
                  onClick={() => navigate('/forgot-password')}
                >
                  Forgot password?
                </button>
              </div>
              
              <Button
                type="submit" 
                className="w-full py-5 sm:py-6 md:py-8 text-base sm:text-lg md:text-xl font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 animate-spin" />
                    Signing in...
                  </>
                ) : 'Sign In'}
              </Button>
            </form>
          </CardContent> 
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginForm;