import axios from "axios";

const handleGoogleSignIn = async () => {
  try {
    const response = await axios.post(
      "http://localhost:3000/auth/oauth",
      {
        provider: "google",
      },
      {
        headers: { origin: "http://localhost:5173" },
      }
    );
    console.log("OAuth Response", response.data);
  } catch (error) {
    console.log(error);
  }
};

const handleGithubSignIn = async () => {
  try {
    const response = await axios.post(
      "http://localhost:3000/auth/oauth",
      {
        provider: "github",
      },
      {
        headers: { origin: "http://localhost:5173" },
      }
    );
    console.log("OAuth Response", response.data);
  } catch (error) {
    console.log(error);
  }
};

const handleSigninIn = async () => {
  try {
    const response = await axios.post("http://localhost:3000/auth/signin", {
      email: "",
      password: "",
    });
    console.log("This is the Sign In with Email Data", response.data);
  } catch (error) {
    console.log(error);
  }
};

export { handleGoogleSignIn, handleGithubSignIn, handleSigninIn };
