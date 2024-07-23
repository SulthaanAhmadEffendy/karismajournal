import React, { useState } from 'react';
import { Input, Button, Typography } from '@material-tailwind/react';
import { Link, useNavigate } from 'react-router-dom';

export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('All fields are required.');
      return;
    }

    try {
      const response = await fetch(
        'https://journal.bariqfirjatullah.pw/api/auth/login',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.data.token);
        console.log('Login successful');
        navigate('/dashboard');
      } else {
        setErrorMessage('Login failed: ' + data.message);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className='m-8 flex gap-4'>
      <div className='w-full lg:w-3/5 mt-24'>
        <div className='text-center'>
          <Typography variant='h2' className='font-bold mb-4'>
            Sign In
          </Typography>
          <Typography
            variant='paragraph'
            color='blue-gray'
            className='text-lg font-normal'
          >
            Enter your email and password to Sign In.
          </Typography>
        </div>
        <form
          className='mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2'
          onSubmit={handleSubmit}
        >
          <div className='mb-1 flex flex-col gap-6'>
            <Typography
              variant='small'
              color='blue-gray'
              className='-mb-3 font-medium'
            >
              Your email
            </Typography>
            <Input
              size='lg'
              placeholder='name@mail.com'
              className='!border-t-blue-gray-200 focus:!border-t-gray-900'
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Typography
              variant='small'
              color='blue-gray'
              className='-mb-3 font-medium'
            >
              Password
            </Typography>
            <Input
              type='password'
              size='lg'
              placeholder='********'
              className='!border-t-blue-gray-200 focus:!border-t-gray-900'
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {errorMessage && (
            <Typography variant='small' color='red' className='mt-2'>
              {errorMessage}
            </Typography>
          )}

          <Button className='mt-6' fullWidth type='submit'>
            {isLoading == true ? 'Loading' : 'Sign In'}
          </Button>

          <div className='flex items-center justify-between gap-2 mt-6'></div>

          <Typography
            variant='paragraph'
            className='text-center text-blue-gray-500 font-medium mt-4'
          >
            Not registered?
            <Link to='/auth/sign-up' className='text-gray-900 ml-1'>
              Create account
            </Link>
          </Typography>
        </form>
      </div>
      <div className='w-2/5 h-full hidden lg:block'>
        <img
          src='/img/pattern.png'
          className='h-full w-full object-cover rounded-3xl'
        />
      </div>
    </section>
  );
}

export default SignIn;
