import React, { useState } from "react";
import hopslogo from "../assets/hopslogo.png";
import axios from "axios";
import {  useNavigate } from "react-router-dom";

const Signup = () => {
 const Navigate=useNavigate()
    const [data, setData] = useState('')
    const [userDetails, setUserDetails] = useState({
        firstName: "",
        lastName: "",
        userName: "",
        password: "",
        confirmPassword: "",
        email: "",
        otp: "",
    });


    const [ourStep, setOurStep] = useState(0);
    const [error, setError] = useState("");

    // --- Handlers ---
    function nextStep() {
        setError("");
        if (ourStep < steps.length - 1) {
            setOurStep(ourStep + 1);
        }
    }

    async function handleMobileSubmit(e) {
        e.preventDefault();
        setError("");

        try {
            // Signup API
            const response = await axios.post(
                `${import.meta.env.VITE_BACKENDURL}/zoops/auth/signup`,
                {
                    username: userDetails.userName,
                    fullName:
                        (userDetails.firstName || "").trim() +
                        " " +
                        (userDetails.lastName || "").trim(),
                    email: userDetails.email,
                    password: userDetails.password,
                },{
                    withCredentials:true
                }
            );

            if (response.status === 201) {
                setData(response.data.id)
                nextStep(); // Move to OTP step
                return
            }
        } catch (err) {
            if (err.response) {
                const status = err.response.status;
                if (status === 409) {
                    // Username exists
                    setOurStep(1);
                    setError(err.response.data.message || "Username already exists");
                } else if (status === 422) {
                    // Phone exists
                    setError(err.response.data.message || "Phone number already exists");
                } else {
                    setError("Something went wrong. Please try again.");
                }
            } else {
                setError("Network error. Please check your connection.");
            }
        }
    }

    // --- Step Forms ---
    const nameDetails = (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                nextStep();
            }}
            style={formStyle}
        >
            <h3 className="mb-4">Welcome</h3>

            <InputField
                label="First Name"
                value={userDetails.firstName}
                onChange={(val) =>
                    setUserDetails((prev) => ({ ...prev, firstName: val }))
                }
            />
            <InputField
                label="Last Name"
                value={userDetails.lastName}
                onChange={(val) =>
                    setUserDetails((prev) => ({ ...prev, lastName: val }))
                }
            />

            <SubmitButton />
        </form>
    );

    const userName = (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                nextStep();
            }}
            style={formStyle}
        >
            <h3 className="mb-4">Choose Username</h3>

            <InputField
                label="Username"
                value={userDetails.userName}
                onChange={(val) =>
                    setUserDetails((prev) => ({ ...prev, userName: val }))
                }
            />

            {error && <p style={{ color: "red" }}>{error}</p>}
            <SubmitButton />
        </form>
    );

    const password = (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                nextStep();
            }}
            style={formStyle}
        >
            <h3 className="mb-4">Set Password</h3>

            <InputField
                label="Password"
                type="password"
                value={userDetails.password}
                onChange={(val) =>
                    setUserDetails((prev) => ({ ...prev, password: val }))
                }
            />
            <InputField
                label="Confirm Password"
                type="password"
                value={userDetails.confirmPassword}
                onChange={(val) =>
                    setUserDetails((prev) => ({ ...prev, confirmPassword: val }))
                }
            />

            <SubmitButton />
        </form>
    );

    const email = (
        <form onSubmit={handleMobileSubmit} style={formStyle}>
            <h3 className="mb-4">email Id</h3>

            <InputField
                label="email Id"
                value={userDetails.email}
                onChange={(val) =>
                    setUserDetails((prev) => ({ ...prev, email: val }))
                }
            />

            {error && <p style={{ color: "red" }}>{error}</p>}
            <SubmitButton />
        </form>
    );

    const Otp = (
        <form
            onSubmit={async (e) => {
                e.preventDefault();
                try {
                    const otpResponse = await axios.post(
                        `${import.meta.env.VITE_BACKENDURL}/zoops/auth/otpverify`,
                        {
                            otp: userDetails.otp,
                            email: userDetails.email, // or get from signup response
                        }
                    );
                    if (otpResponse.status === 200) {

                        return Navigate('/login')
                    }
                } catch (err) {
                    console.log("OTP error:", err);
                }
            }}
            style={formStyle}
        >
            <h3 className="mb-4">OTP</h3>

            <InputField
                label="OTP"
                value={userDetails.otp}
                onChange={(val) =>
                    setUserDetails((prev) => ({ ...prev, otp: val }))
                }
            />

            <SubmitButton />
        </form>
    );

    const steps = [nameDetails, userName, password,email , Otp];

    return (
        <div style={containerStyle}>
            <div className="input d-flex flex-column justify-content-center">
                <nav style={{ width: "120px", margin: "12px auto" }}>
                    <img src={hopslogo} className="img-fluid" alt="Logo" />
                </nav>

                {/* Step indicators */}
                <div className="d-flex justify-content-center mb-4">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            style={{
                                width: "20px",
                                height: "20px",
                                borderRadius: "50%",
                                margin: "0 5px",
                                backgroundColor: ourStep === i ? "#0d6efd" : "#555",
                            }}
                        ></div>
                    ))}
                </div>

                {/* Current step */}
                {steps[ourStep]}
            </div>
        </div>
    );
};

// --- Helper Components ---
const InputField = ({ label, type = "text", value, onChange }) => (
    <div className="w-100 mb-3">
        <label className="form-label">{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="form-control"
            style={{
                backgroundColor: "transparent",
                color: "white",
                border: "1px solid #555",
            }}
            required
        />
    </div>
);

const SubmitButton = () => (
    <button
        type="submit"
        className="btn btn-light mt-2 w-100"
        style={{ borderRadius: "8px", fontWeight: "bold" }}
    >
        Next
    </button>
);

// --- Styles ---
const containerStyle = {
    backgroundColor: "#282828",
    color: "white",
    width: "90%",
    margin: "15vh auto",
    borderRadius: "12px",
    padding: "20px",
};

const formStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "transparent",
    width: "100%",
    maxWidth: "350px",
    margin: "0 auto",
};

export default Signup;
