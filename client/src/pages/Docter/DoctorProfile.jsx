import { useSelector, useDispatch } from 'react-redux';
import { useState, useRef, useEffect } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../../firebase'; // Import your Firebase app configuration
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOut } from '../../redux/user/userSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Use navigate for redirection
import Sidebar from '../../components/Sidebar';

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const specializations = [
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'General Surgery',
  'Gynecology',
  'Hematology',
  'Neurology',
  'Oncology',
  'Ophthalmology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Radiology',
  'Urology',
  'Family Medicine',
  'Internal Medicine',
  'Pulmonology',
  'Rheumatology',
  'Anesthesiology',
  'Pathology',
];

export default function DoctorProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // For navigation after signing out
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    email: '',
    availableDates: [],
    timeRanges: {},
    maxAppointmentsPerDay: '',
    channelingCost: ''
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const { currentUser } = useSelector((state) => state.user); // Assuming currentUser holds the logged-in doctor's data

  useEffect(() => {
    if (currentUser && currentUser.isDoctor) {
      const fetchDoctorData = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/doctors/doc/${currentUser._id}`); // Fetch doctor profile using current user ID
          setFormData(response.data);
        } catch (error) {
          console.error('Error fetching doctor details:', error);
        }
      };
      fetchDoctorData();
    }
  }, [currentUser]);

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, profilePicture: downloadURL });
        });
      }
    );
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters long';
    }
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (formData.maxAppointmentsPerDay <= 0) {
      newErrors.maxAppointmentsPerDay = 'Max appointments must be a positive number';
    }
    if (formData.channelingCost < 0) {
      newErrors.channelingCost = 'Channeling cost must be a non-negative number';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleDateToggle = (day) => {
    setFormData(prevState => ({
      ...prevState,
      availableDates: prevState.availableDates.includes(day)
        ? prevState.availableDates.filter(d => d !== day)
        : [...prevState.availableDates, day]
    }));
  };

  const handleTimeRangeChange = (day, field, value) => {
    setFormData(prevState => ({
      ...prevState,
      timeRanges: {
        ...prevState.timeRanges,
        [day]: {
          ...prevState.timeRanges[day],
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      dispatch(updateUserStart());
      const res = await axios.put(`http://localhost:3000/api/doctors/update/${currentUser._id}`, formData); // Update the doctor profile
      dispatch(updateUserSuccess(res.data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      await axios.delete(`http://localhost:3000/api/user/delete/${currentUser._id}`); // Delete the doctor account
      dispatch(deleteUserSuccess());
      alert('Account deleted successfully!');
      navigate('/sign-in'); // Redirect to sign-in after account deletion
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  // Sign-out function
  const handleSignOut = async () => {
    try {
      await axios.get('http://localhost:3000/api/auth/signout'); // Make a request to sign out
      dispatch(signOut()); // Clear Redux state for user
      navigate('/sign-in'); // Redirect to sign-in page after signing out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex-1 p-8 ml-64">
        <h1 className='text-3xl font-semibold text-center mb-7'>Doctor Profile</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 max-w-lg mx-auto'>
          <input
            type='file'
            ref={fileRef}
            hidden
            accept='image/*'
            onChange={(e) => setImage(e.target.files[0])}
          />
          <img
            src={formData.profilePicture || currentUser.profilePicture}
            alt='profile'
            className='h-24 w-24 self-center cursor-pointer rounded-full object-cover'
            onClick={() => fileRef.current.click()}
          />

          <p className='text-sm self-center'>
            {imageError ? (
              <span className='text-red-700'>
                Error uploading image (file size must be less than 2 MB)
              </span>
            ) : imagePercent > 0 && imagePercent < 100 ? (
              <span className='text-slate-700'>{`Uploading: ${imagePercent} %`}</span>
            ) : imagePercent === 100 ? (
              <span className='text-green-700'>Image uploaded successfully</span>
            ) : (
              ''
            )}
          </p>

          <input
            value={formData.name}
            type='text'
            id='name'
            placeholder='Name'
            className='bg-slate-100 rounded-lg p-3'
            onChange={handleChange}
          />
          {errors.name && <p className="text-red-500">{errors.name}</p>}

          <div>
            <label className="block text-gray-600">Specialization</label>
            <select
              id="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select specialization</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
          {errors.specialization && <p className="text-red-500">{errors.specialization}</p>}

          <input
            value={formData.email}
            type='email'
            id='email'
            placeholder='Email'
            className='bg-slate-100 rounded-lg p-3'
            onChange={handleChange}
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}

          <input
            value={formData.maxAppointmentsPerDay}
            type='number'
            id='maxAppointmentsPerDay'
            placeholder='Max Appointments Per Day'
            className='bg-slate-100 rounded-lg p-3'
            onChange={handleChange}
          />
          {errors.maxAppointmentsPerDay && <p className="text-red-500">{errors.maxAppointmentsPerDay}</p>}

          <input
            value={formData.channelingCost}
            type='number'
            id='channelingCost'
            placeholder='Channeling Cost'
            className='bg-slate-100 rounded-lg p-3'
            onChange={handleChange}
          />
          {errors.channelingCost && <p className="text-red-500">{errors.channelingCost}</p>}

          <div className="grid grid-cols-2 gap-4">
            {daysOfWeek.map((day) => (
              <label key={day} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.availableDates.includes(day)}
                  onChange={() => handleDateToggle(day)}
                  className="mr-2"
                />
                {day}
              </label>
            ))}
          </div>

          {formData.availableDates.map((day) => (
            <div key={day} className="mt-4 border border-gray-300 p-4 rounded-md">
              <h3 className="text-lg font-semibold">{day}</h3>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <label className="block text-gray-600">From</label>
                  <input
                    type="time"
                    value={formData.timeRanges[day]?.from || ''}
                    onChange={(e) => handleTimeRangeChange(day, 'from', e.target.value)}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="block text-gray-600">To</label>
                  <input
                    type="time"
                    value={formData.timeRanges[day]?.to || ''}
                    onChange={(e) => handleTimeRangeChange(day, 'to', e.target.value)}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}

          <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
            Update Profile
          </button>
        </form>

        <div className='flex justify-between max-w-lg mx-auto mt-5'>
          <span
            onClick={handleDeleteAccount}
            className='text-red-700 cursor-pointer'
          >
            Delete Account
          </span>
          <span
            onClick={handleSignOut}
            className='text-red-700 cursor-pointer'
          >
            Sign Out
          </span>
        </div>

        <p className='text-red-700 text-center mt-5'>{errors.error && 'Something went wrong!'}</p>
        <p className='text-green-700 text-center mt-5'>
          {updateSuccess && 'Profile updated successfully!'}
        </p>
      </div>
    </div>
  );
}
