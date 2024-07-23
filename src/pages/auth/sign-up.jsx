import React, { useState } from 'react';
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from '@material-tailwind/react';

import { Link, useNavigate } from 'react-router-dom';

export function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    if (!name || !email || !password || !passwordConfirmation) {
      setErrorMessage('All fields are required.');
      return;
    }

    try {
      const response = await fetch(
        'https://journal.bariqfirjatullah.pw/api/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name: name,
            email: email,
            password: password,
            password_confirmation: passwordConfirmation,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log('Registration successful');
        navigate('/auth/sign-in');
      } else {
        setErrorMessage('Regitration failed: ' + data.message);
      }
    } catch (error) {
      setErrorMessage('An error occurred during login');
    } finally {
      setIsLoading('false');
    }
  };
  return (
    <section className='m-8 flex'>
      <div className='w-2/5 h-full hidden lg:block'>
        <img
          src='/img/pattern.png'
          className='h-full w-full object-cover rounded-3xl'
        />
      </div>
      <div className='w-full lg:w-3/5 flex flex-col items-center justify-center'>
        <div className='text-center'>
          <Typography variant='h2' className='font-bold mb-4'>
            Join Us Today
          </Typography>
          <Typography
            variant='paragraph'
            color='blue-gray'
            className='text-lg font-normal'
          >
            Enter your email and password to register.
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
              Name
            </Typography>
            <Input
              size='lg'
              placeholder='John Doe'
              className=' !border-t-blue-gray-200 focus:!border-t-gray-900'
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Typography
              variant='small'
              color='blue-gray'
              className='-mb-3 font-medium'
            >
              Email
            </Typography>
            <Input
              size='lg'
              placeholder='name@mail.com'
              className=' !border-t-blue-gray-200 focus:!border-t-gray-900'
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
              placeholder='**********'
              className=' !border-t-blue-gray-200 focus:!border-t-gray-900'
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Typography
              variant='small'
              color='blue-gray'
              className='-mb-3 font-medium'
            >
              Password Confirmation
            </Typography>
            <Input
              type='password'
              size='lg'
              placeholder='**********'
              className=' !border-t-blue-gray-200 focus:!border-t-gray-900'
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
          </div>

          {errorMessage && (
            <Typography variant='small' color='red' className='mt-2'>
              {errorMessage}
            </Typography>
          )}

          <Button className='mt-6' fullWidth type='submit'>
            {isLoading == true ? 'Loading' : 'Sign Up'}
          </Button>

          <Typography
            variant='paragraph'
            className='text-center text-blue-gray-500 font-medium mt-4'
          >
            Already have an account?
            <Link to='/auth/sign-in' className='text-gray-900 ml-1'>
              Sign in
            </Link>
          </Typography>
        </form>
      </div>
    </section>
  );
}

export default SignUp;
