import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    const { firstName, lastName, email, password, image } = formData;

    const formDataToSend = new FormData();
    formDataToSend.append("first_name", firstName);
    formDataToSend.append("last_name", lastName);
    formDataToSend.append("email", email);
    formDataToSend.append("password", password);
    if (image && image.length > 0) {
      formDataToSend.append("image", image[0]);
    }

    console.log(formDataToSend); // Log the FormData object

    try {
      const response = await axios.post(
        "https://api.zonesparks.org/register/",
        formDataToSend
      );

      if (response.status === 200) {
        alert("Registration successful!");
        navigate("/login");
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        console.log(data); // Log the server response data
        setError(data.message || "Registration failed. Please try again.");
      } else {
        setError("An error occurred during registration.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="first_name" className="block font-bold mb-2">
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              {...register("firstName", { required: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.firstName && (
              <p className="text-red-500">First Name is required</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="last_name" className="block font-bold mb-2">
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              {...register("lastName", { required: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.lastName && (
              <p className="text-red-500">Last Name is required</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: true,
                pattern: /^\S+@\S+$/i,
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500">Please enter a valid email address</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password", {
                required: true,
                pattern: /^(?=.*[A-Z]).{8,}$/,
              })}
              autoComplete="current-password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-500">
                Password must be at least 8 characters long and contain at least
                one uppercase letter
              </p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block font-bold mb-2">
              Profile Image
            </label>
            <input
              type="file"
              id="image"
              {...register("image")}
              accept="image/*"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
