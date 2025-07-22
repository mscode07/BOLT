import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Auth } from "@supabase/auth-ui-react";
import supabase from "./supabaseClient";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Code } from "lucide-react";
import { Button } from "../ui/button";

export const SignUpComp = () => {
  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      console.log("Google SignIn Error", error);
    }
  };
  const handleGithubSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
    });
    if (error) {
      console.log("Github SignIn Error", error);
    }
  };

  const signInWithCredentials = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: "",
      password: "",
    });
    if (error) {
      console.log("Sign In Error", error);
    }
  };

  return (
    <>
      <div className="rounded-full bg-white text-black font-bold border border-white/20 px-4 py-2">
        <Dialog>
          <DialogTrigger>Get Started</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center justify-center">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Code
                      className="h-8 w-8"
                      style={{
                        background:
                          "linear-gradient(to right, rgb(168, 85, 247), rgb(236, 72, 153))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg blur opacity-75 animate-pulse"></div>
                  </div>
                  <span
                    className="text-2xl font-bold cursor-pointer"
                    style={{
                      background:
                        "linear-gradient(to right, white, rgb(209, 213, 219))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    codeINN
                  </span>
                  <div className="px-2 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full text-xs text-purple-300 border border-purple-500/30">
                    AI-Powered
                  </div>
                </div>
              </DialogTitle>
              <DialogDescription>
                <div className="text-white">
                  {/* <Auth
                    supabaseClient={supabase}
                    appearance={{ theme: ThemeSupa }}
                    providers={["google", "github"]}
                    theme="dark"
                  /> */}
                  <div>
                    <div className="flex flex-col justify-center items-center">
                      <div>
                        <div className="flex flex-col max-w-64">
                          <Button
                            className="mt-10 px-36 rounded-2xl"
                            onClick={handleGoogleSignIn}
                          >
                            {" "}
                            {/* <FcGoogle /> */}
                            Sign UP with Google{" "}
                          </Button>
                          <Button
                            className="mt-2 px-36 rounded-2xl font-bold"
                            onClick={handleGithubSignIn}
                          >
                            {" "}
                            {/* <FaGithub />  */}
                            Sign UP with Github{" "}
                          </Button>
                        </div>
                        <div className="flex items-center justify-center max-w-64 ml-4">
                          <hr className="w-72 h-0.5 my-4 bg-gray-200 border-0 rounded dark:bg-gray-700"></hr>
                          <p className="px-2 text-slate-500">or</p>
                          <hr className="w-72 h-0.5 my-4 bg-gray-200 border-0 rounded dark:bg-gray-700"></hr>
                        </div>
                        <Dialog>
                          <DialogTrigger className="bg-twitterBlue hover:bg-blue-500 py-1 px-24 mt-0 rounded-2xl text-white">
                            Create Account
                          </DialogTrigger>
                          <DialogContent className="bg-black min-w-96 max-w-96">
                            <DialogHeader>
                              <DialogTitle className="w-4/5 flex items-center justify-center ">
                                {/* <UserCredentials /> */}
                              </DialogTitle>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                        <p className="text-xs text-slate-600 mt-0.5 w-64">
                          By signing up, you agree to the{" "}
                          <span className="text-twitterBlue">
                            Terms of Service
                          </span>{" "}
                          and
                          <span className="text-twitterBlue">
                            {" "}
                            Privacy Policy
                          </span>
                          , including
                          <span className="text-twitterBlue"> Cookie Use.</span>
                        </p>
                        <div className="mt-12 font-semibold">
                          Already have an account?
                        </div>

                        <Dialog>
                          <DialogTrigger className=" border border-slate-500 py-1 px-32 mt-1 rounded-2xl text-twitterBlue font-semibold hover:bg-slate-900 ">
                            Sign In
                          </DialogTrigger>
                          <DialogContent className="bg-black min-w-96 max-w-96">
                            <DialogHeader>
                              <DialogTitle className="flex flex-col justify-center items-center"></DialogTitle>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
