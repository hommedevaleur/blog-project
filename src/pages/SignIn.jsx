import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';
import axios from 'axios';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Veuillez remplir tous les champs'));
    }
    try {
      dispatch(signInStart());
      const res = await axios.post('https://blog-crud-xo4b.onrender.com/api/auth/signin', formData, { withCredentials: true });
      console.log('Server response:', res);
      const data = res.data;
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      } else {
        dispatch(signInSuccess(data));
        navigate('/');
      }
    } catch (error) {
      console.error('Error during sign in:', error);
      dispatch(signInFailure(error.response?.data?.message || error.message));
    }
  };
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* left */}
        <div className='flex-1'>
        <Link
              to="/"
              className="self-center whitespace-nowrap text-sm sm:text-4xl font-semibold dark:text-white bg-gradient-to-r from-orange-700 via-white to-green-700 p-2 rounded-lg"
            >
        My Modern Blog
      </Link>
          <p className='text-sm mt-5'>
            Ceci est la page de connexion. Vous pouvez vous connecter avec votre email et mot de passe
            ou avec Google.
          </p>
        </div>
        {/* right */}

        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Votre email' />
              <TextInput
                type='email'
                placeholder='name@company.com'
                id='email'
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value='Votre mot de passe' />
              <TextInput
                type='password'
                placeholder='**********'
                id='password'
                onChange={handleChange}
              />
            </div>
            <Button
              gradientMonochrome="success"
              type='submit'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Chargement...</span>
                </>
              ) : (
                'Se connecter'
              )}
            </Button>
            <OAuth />
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Vous n'avez pas de compte ?</span>
            <Link to='/sign-up' className='text-blue-500'>
              S'inscrire
            </Link>
          </div>
          {errorMessage && (
            <Alert className='mt-5' color='failure'>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
