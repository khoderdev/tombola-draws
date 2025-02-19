import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { login } = useAuth();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setError('');
			setLoading(true);
			await login(formData);
			navigate('/draws');
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to sign in');
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<div className='min-h-screen flex items-start justify-center py-12 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-md w-full space-y-8'>
				<div>
					<h2 className='mt-6 text-center text-3xl font-extrabold '>
						Sign in to your account
					</h2>
				</div>
				<form className='mt-8 space-y-6' onSubmit={handleSubmit}>
					<div className='rounded-md shadow-sm space-y-2'>
						<div>
							<input
								name='email'
								type='email'
								required
								className='appearance-none dark:text-neutral-100 relative text-neutral-800 block w-full px-3 py-2 dark:bg-neutral-600 placeholder-neutral-500 rounded-md outline-none focus:ring transition-all duration-300 focus:!ring-blue-500 focus:z-10 sm:text-sm'
								placeholder='Email address'
								value={formData.email}
								onChange={handleChange}
							/>
						</div>
						<div>
							<input
								name='password'
								type='password'
								required
							className='appearance-none dark:text-neutral-100 relative text-neutral-800 block w-full px-3 py-2 dark:bg-neutral-600 placeholder-neutral-500 rounded-md outline-none focus:ring transition-all duration-300 focus:!ring-blue-500 focus:z-10 sm:text-sm'
								placeholder='Password'
								value={formData.password}
								onChange={handleChange}
							/>
						</div>
					</div>

					{error && (
						<div className='text-red-500 text-sm text-center'>{error}</div>
					)}

					<div>
						<button
							type='submit'
							disabled={loading}
							className='btn !place-self-center !w-full !justify-center'
						>
							{loading ? 'Signing in...' : 'Sign in'}
						</button>
					</div>

					<div className='text-sm text-center'>
						<Link
							to='/register'
							className='font-medium text-blue-600 hover:text-blue-500'
						>
							Don&apos;t have an account? Sign up
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}
