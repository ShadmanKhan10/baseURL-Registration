import React, { useState } from "react";
import axios from "axios";
import dummyUserImage from "../assets/dummyUserPic.png";
import loader from "../assets/loader.svg";
import CaptureImage from "../Capture-Container/CaptureImage";

export default function Registration() {
  const [capturedImage, setCapturedImage] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [gender, setGender] = useState("male");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [conflictError, setConflictError] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [responseName, setResponseName] = useState("");
  const [responseImg, setResponseImg] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const [showCaptureImage, setShowCaptureImage] = useState(false);

  const [imageError, setImageError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [organizationError, setOrganizationError] = useState(false);

  const backendBaseURL = import.meta.env.VITE_BASE_URL;

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNameChange = (event) => {
    const inputValue = event.target.value;
    setName(inputValue);

    if (inputValue.trim()) {
      setNameError(false);
    } else {
      setNameError(true);
    }
  };

  const handleEmailChange = (event) => {
    const inputValue = event.target.value;
    setEmail(inputValue);

    if (validateEmail(inputValue)) {
      setEmailError(false);
    } else {
      setEmailError(true);
    }
  };

  const handleOrganizationChange = (event) => {
    const inputValue = event.target.value;
    setOrganization(inputValue);

    if (inputValue.trim()) {
      setOrganizationError(false);
    } else {
      setOrganizationError(true);
    }
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const openCaptureContainer = (event) => {
    event.preventDefault();
    setShowCaptureImage(true);
  };

  const clearFields = () => {
    setName("");
    setEmail("");
    setOrganization("");
    setGender("male");
    setCapturedImage(null);
  };

  const validateForm = () => {
    let valid = true;

    if (!capturedImage) {
      setImageError(true);
      valid = false;
    } else {
      setImageError(false);
    }

    if (!name.trim()) {
      setNameError(true);
      valid = false;
    }

    if (!email.trim() || !validateEmail(email)) {
      setEmailError(true);
      valid = false;
    }

    if (!organization.trim()) {
      setOrganizationError(true);
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newParticipant = {
      name,
      email,
      organization,
      gender,
      userImage: capturedImage,
    };
    setLoading(true);
    try {
      const response = await axios.post(
        `${backendBaseURL}/register-user`,
        newParticipant
      );
      setLoading(false);
      setSuccess(true);
      setResponseName(response.data.data.name);
      setResponseImg(response.data.data.user_image);
      clearFields();
    } catch (error) {
      if (error.response.status === 409) {
        setSuccess(false);
        setErrorMsg(error.response.data.message);
        setConflictError(true);
      } else {
        setError(true);
        setErrorMessage(error.response.data.message);
      }
      setLoading(false);
      clearFields();
    }
  };

  if (success && !conflictError && !error) {
    return (
      <div className="success-msg-container">
        <img
          src={`${backendBaseURL}/generatedImagesAI/${responseImg}`}
          alt="user"
          className="success-user-image"
        />
        <p className="name">{responseName}</p>
        <p className="success-msg">Successfully Registered</p>
      </div>
    );
  }

  if (conflictError && !success && !error) {
    return (
      <div className="success-msg-container">
        <p className="name">{errorMsg}</p>
      </div>
    );
  }

  if (!conflictError && !success && error) {
    return (
      <div className="success-msg-container">
        <p className="name">Error Registering User</p>
        <p className="error-msg">{errorMessage}</p>
      </div>
    );
  }

  return (
    <>
      {!success && !conflictError && !error && (
        <div>
          <form className="form-container">
            <div className="input-image-container">
              <img
                src={capturedImage === null ? dummyUserImage : capturedImage}
                className="input-img"
                alt="user-img"
              />
            </div>
            <button
              type="button"
              onClick={openCaptureContainer}
              className="chose-img-btn"
            >
              {capturedImage === null
                ? "Capture your Image"
                : "Profile Pic.png"}
            </button>

            <div className="img-error-container">
              {imageError && (
                <p className="error-text">Please provide your image</p>
              )}
            </div>

            <div className="inputs-field-container">
              <input
                className="input-field"
                type="text"
                placeholder="Enter your Name"
                onChange={handleNameChange}
                value={name}
              />
            </div>

            <div className="error-container">
              {nameError && (
                <p className="error-text">Please enter your name</p>
              )}
            </div>

            <div className="inputs-field-container">
              <input
                className="input-field"
                type="text"
                placeholder="Enter your Email"
                onChange={handleEmailChange}
                value={email}
              />
            </div>

            <div className="error-container">
              {emailError && (
                <p className="error-text">Please enter a valid email</p>
              )}
            </div>

            <div className="inputs-field-container">
              <input
                className="input-field"
                type="text"
                placeholder="Organization"
                onChange={handleOrganizationChange}
                value={organization}
              />
            </div>

            <div className="error-container">
              {organizationError && (
                <p className="error-text">Please enter your organization</p>
              )}
            </div>

            <div className="dropdown-container">
              <select
                className="dropdown-select"
                id="gender"
                name="gender"
                onChange={handleGenderChange}
                value={gender}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="submit-btn-container">
              <button onClick={handleSubmit} className="submit-btn">
                {loading ? (
                  <img src={loader} alt="loading" className="loading" />
                ) : (
                  "SUBMIT"
                )}
              </button>
            </div>
          </form>
          <div
            className={
              !showCaptureImage ? "hide-capture-image" : "capture-image-popup"
            }
          >
            <CaptureImage
              capturedImage={capturedImage}
              setCapturedImage={setCapturedImage}
              setShowCaptureImage={setShowCaptureImage}
              loading={loading}
              setLoading={setLoading}
              setImageError={setImageError}
            />
          </div>
        </div>
      )}
    </>
  );
}
