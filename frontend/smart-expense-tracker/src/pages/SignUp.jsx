
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/layouts/AuthLayout';
import Input from '../components/inputs/input';
import { Link } from 'react-router-dom';
import { validateEmail } from '../utils/helper';
import ProfilePhotoSelector from '../components/inputs/ProfilePhotoSelector';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { UserContext } from '../context/UserContext';
import { useContext } from 'react';
import uploadImage from '../utils/uploadimage';

const SignUp = () => {
    const [profilepic, setProfilePic] = useState('');
    const [fullname, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);


    const { updateUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        let profileImageUrl = "";

        if (!fullname) {
            setError('Please enter your name');
            return;
        }
        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }
        if (!password) {
            setError('Please enter your password');
            return;
        }
        setError("");

        // SignUp API call
        try {

            if (profilepic) {
                const imgUploadRes = await uploadImage(profilepic);
                profileImageUrl = imgUploadRes.imageUrl || "";
            }
            const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
                fullname,
                email,
                password,
                profileImageUrl
            });
            // Expect: message and userId (no token/user yet)
            navigate('/verify-otp', { state: { email } });

        } catch (error) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Something went wrong, please try again later');
            }
        }
    }
    return (
        <AuthLayout>
            <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
                <h3 className='text-xl font-semibold text-black'>Create an Account</h3>
                <p className='text-xs text-slate-700 mt-[5px] mb-6'>Join us toaday by entering your details below</p>

                <form onSubmit={handleSignUp } className=''>
                    <ProfilePhotoSelector image={profilepic} setImage={setProfilePic} />
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <Input
                            value={fullname}
                            onChange={({ target }) => setFullName(target.value)}
                            label="Full Name"
                            placeholder="Enter your full name"
                            type="text"
                        />
                        <Input
                            value={email}
                            onChange={({ target }) => setEmail(target.value)}
                            label="Email Address"
                            placeholder="Enter your email"
                            type="text"
                        />
                        <div className='col-span-2'>
                            <Input
                                value={password}
                                onChange={({ target }) => setPassword(target.value)}
                                label="Password"
                                placeholder="Minimum 8 characters"
                                type="password"
                            />
                        </div>

                    </div>
                    {error && <p className='text-red-500 text-sm pb-2.5'>{error}</p>}

                    <button
                        type="submit"
                        className="btn-primary"
                        >
                        SIGN UP
                    </button>

                    <p className='text-[13px] text-slate-800 mt-3'>
                        Already have an account?{' '}
                        <Link className='font-medium text-primary underline' to='/login'>
                            login
                        </Link>
                    </p>
                </form>
            </div>
        </AuthLayout>
    );
}
export default SignUp;