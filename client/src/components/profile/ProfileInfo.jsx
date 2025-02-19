import { useState } from 'react';
import { profileService } from '../../services/api';
import PropTypes from 'prop-types';

export default function ProfileInfo({ profile, onUpdate }) {
	const [formData, setFormData] = useState({
		name: profile?.name || '',
		email: profile?.email || '',
		phone: profile?.phone || '',
		address: profile?.address || '',
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [isEditing, setIsEditing] = useState(false);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			setError('');
			setSuccess('');
			await profileService.updateProfile(formData);
			setSuccess('Profile updated successfully');
			setIsEditing(false);
			onUpdate();
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to update profile');
		} finally {
			setLoading(false);
		}
	};

	const handleAvatarChange = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		const formData = new FormData();
		formData.append('avatar', file);

		try {
			setLoading(true);
			setError('');
			setSuccess('');
			await profileService.uploadAvatar(formData);
			setSuccess('Avatar updated successfully');
			onUpdate();
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to update avatar');
		} finally {
			setLoading(false);
		}
	};

	const toggleEditMode = () => {
		setIsEditing(!isEditing);
		setError('');
		setSuccess('');
	};

	return (
		<div className='max-w-2xl p-6 bg-white dark:bg-neutral-800 rounded-2xl'>
			<h2 className='text-2xl font-extrabold text-neutral-900 dark:text-neutral-100 mb-4'>
				Profile Information
			</h2>
			<div className='flex items-center space-x-4'>
				<img
					src={
						profile?.avatar ||
						'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
					}
					alt='Profile'
					className='h-24 w-24 rounded-full object-cover shadow-md'
				/>
				<label className='btn cursor-pointer'>
					Change
					<input
						type='file'
						className='hidden'
						accept='image/*'
						onChange={handleAvatarChange}
					/>
				</label>
			</div>

			{/* <button onClick={toggleEditMode} className='btn mt-6'>
				{isEditing ? 'Cancel' : 'Edit Profile'}
			</button> */}

			{isEditing ? (
				<form onSubmit={handleSubmit} className='space-y-6 mt-6'>
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
						<div>
							<label className='block text-sm font-medium'>Full Name</label>
							<input
								type='text'
								name='name'
								value={formData.name}
								onChange={handleChange}
								className='appearance-none dark:text-neutral-100 relative text-neutral-800 block w-full px-3 py-2 dark:bg-neutral-600 placeholder-neutral-500 rounded-md outline-none focus:ring transition-all duration-300 focus:!ring-blue-500 focus:z-10 sm:text-sm border dark:border-neutral-500'
							/>
						</div>

						<div>
							<label className='block text-sm font-medium'>Email</label>
							<input
								type='email'
								name='email'
								value={formData.email}
								onChange={handleChange}
								className='appearance-none dark:text-neutral-100 relative text-neutral-800 block w-full px-3 py-2 dark:bg-neutral-600 placeholder-neutral-500 rounded-md outline-none focus:ring transition-all duration-300 focus:!ring-blue-500 focus:z-10 sm:text-sm border dark:border-neutral-500'
							/>
						</div>

						<div>
							<label className='block text-sm font-medium'>Phone Number</label>
							<input
								type='tel'
								name='phone'
								value={formData.phone}
								onChange={handleChange}
								className='appearance-none dark:text-neutral-100 relative text-neutral-800 block w-full px-3 py-2 dark:bg-neutral-600 placeholder-neutral-500 rounded-md outline-none focus:ring transition-all duration-300 focus:!ring-blue-500 focus:z-10 sm:text-sm border dark:border-neutral-500'
							/>
						</div>

						<div>
							<label className='block text-sm font-medium'>Address</label>
							<input
								type='text'
								name='address'
								value={formData.address}
								onChange={handleChange}
								className='appearance-none dark:text-neutral-100 relative text-neutral-800 block w-full px-3 py-2 dark:bg-neutral-600 placeholder-neutral-500 rounded-md outline-none focus:ring transition-all duration-300 focus:!ring-blue-500 focus:z-10 sm:text-sm border dark:border-neutral-500'
							/>
						</div>
					</div>

					{error && <div className='text-sm text-red-500'>{error}</div>}
					{success && <div className='text-sm text-green-600'>{success}</div>}

					<button type='submit' disabled={loading} className='btn'>
						{loading ? 'Saving...' : 'Save Changes'}
					</button>
				</form>
			) : (
				<div className='mt-6 space-y-4'>
					<p className='text-lg'>
						<strong>Name:</strong> {profile?.name}
					</p>
					<p className='text-lg'>
						<strong>Email:</strong> {profile?.email}
					</p>
					<p className='text-lg'>
						<strong>Phone:</strong> {profile?.phone}
					</p>
					<p className='text-lg'>
						<strong>Address:</strong> {profile?.address}
					</p>
				</div>
			)}
			<button onClick={toggleEditMode} className='btn mt-6'>
				{isEditing ? 'Cancel' : 'Edit Profile'}
			</button>
		</div>
	);
}

ProfileInfo.propTypes = {
	profile: PropTypes.shape({
		name: PropTypes.string,
		avatar: PropTypes.string,
		email: PropTypes.string,
		phone: PropTypes.string,
		address: PropTypes.string,
	}),
	onUpdate: PropTypes.func.isRequired,
};
