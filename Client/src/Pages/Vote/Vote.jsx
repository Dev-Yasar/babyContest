import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import "./Vote.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { Link } from "react-router-dom"

const customModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "300px",
    padding: "20px",
    backgroundColor: "#1BB295",
    color: "#fff",
    height: "200px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
};

const Vote = () => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [imageSource, setImageSource] = useState();

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);

    const selectedImage = event.target.files[0];

    if (selectedImage) {
      const imageUrl = URL.createObjectURL(selectedImage);
      setImageSource(imageUrl);
      setIsImageSelected(true);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = {};

    if (!name) {
      newErrors.name = "Name is required";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!mobile) {
      newErrors.mobile = "Number is required";
    } else if (mobile.length < 10) {
      newErrors.mobile = "Mobile must be at least 10 digits";
    }

    if (!image) {
      newErrors.photo = "File is required";
    }

    setErrors(newErrors);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("mobile", mobile);

    try {
      const response = await axios.post(
        "https://babycontest.onrender.com/vote",
        formData
      );
      console.log("Image uploaded successfully:", response.data.message);
      toast.error(response.data.message1);

      if (response.data.message1 != "Already used email") {
        setIsOpen(true);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }

    return Object.keys(newErrors).length === 0;
  };

  const [isOpen, setIsOpen] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    mobile: "",
    image: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrors({
        name: "",
        email: "",
        mobile: "",
        photo: "",
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [errors]);

  return (
    <div className="formHolder">

      <Link to="/result"><button className="routeBtn">Result Page</button></Link>
      <form onSubmit={handleSubmit}>
        <h2> Baby Vote Contest</h2>
        <div className="form-group fullname">
          {errors.name && (
            <div className="ErrorBoxHolder">
              <div className="ErrorBox">
                <p>
                  <i class="fa-solid fa-circle-exclamation"></i>
                  {errors.name}
                </p>
              </div>
            </div>
          )}
          <label htmlFor="fullname">Baby Name</label>
          <input
            type="text"
            id="fullname"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group email">
          {errors.email && (
            <div className="ErrorBoxHolder">
              <div className="ErrorBox">
                <p>
                  <i class="fa-solid fa-circle-exclamation"></i>
                  {errors.email}
                </p>
              </div>
            </div>
          )}
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group Number">
          {errors.mobile && (
            <div className="ErrorBoxHolder">
              <div className="ErrorBox">
                <p>
                  <i class="fa-solid fa-circle-exclamation"></i>
                  {errors.mobile}
                </p>
              </div>
            </div>
          )}
          <label htmlFor="Number">Number</label>
          <input
            type="number"
            id="Number"
            placeholder="Enter your Number"
            onkeydown="return false"
            onwheel="return false"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
          {errors.photo && (
            <div className="ErrorBoxHolder">
              <div className="ErrorBox">
                <p>
                  <i class="fa-solid fa-circle-exclamation"></i>
                  {errors.photo}
                </p>
              </div>
            </div>
          )}
        </div>
        <div class="upload-btn-wrapper">
          {isImageSelected && (
            <img className="BabyImgDisplay" src={imageSource} alt="img" />
          )}
          <button class="btn teal">
            Upload Photo <i class="fa-solid fa-cloud-arrow-up"></i>
          </button>

          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <div className="form-group submit-btn">
          <input type="submit" defaultValue="Submit" />
        </div>
      </form>
      <ToastContainer />
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        style={customModalStyles}
      >
        <h2>
          {" "}
          <i class="fa-solid fa-circle-check"></i> Success!
        </h2>
        <p>Your vote has been submitted successfully.</p>
      </Modal>
    </div>
  );
};

export default Vote;
