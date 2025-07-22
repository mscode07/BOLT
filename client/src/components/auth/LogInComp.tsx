import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import supabase from "./supabaseClient";

const handleGoogleSignIn = async () => {
  console.log("Google Sign In");
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "http://localhost:5173/auth/callback",
    },
  });
  if (error) console.log(error.message);
};
const handleGithubSignIn = async () => {
  console.log("Github Sign In");
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: "http://localhost:5173/auth/callback",
    },
  });
  if (error) console.log(error.message);
};

export const LogInComp = () => {
  return (
    <>
      <div className="rounded-full bg-transparent font-bold border border-white/20 px-4 py-2">
        {/* <Dialog>
          <DialogTrigger>Login</DialogTrigger>
          <DialogContent>
            <DialogHeader className="items-center justify-center">
              <DialogTitle>Log In</DialogTitle>
              <DialogDescription className="flex flex-col max-w-64">
                <div className="flex flex-col max-w-64">
                  <Button
                    className="mt-10 px-36 rounded-2xl"
                    onClick={handleGoogleSignIn}
                  >
                    {" "}
                    <FaGoogle /> Sign UP with Google{" "}
                  </Button>
                  <Button
                    className="mt-2 px-36 rounded-2xl font-bold"
                    onClick={handleGithubSignIn}
                  >
                    {" "}
                    <FaGithub /> Sign UP with Github{" "}
                  </Button>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog> */}
        <Dialog>
          <DialogTrigger>Login</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Login </DialogTitle>
              <DialogDescription>
                <Auth
                  supabaseClient={supabase}
                  appearance={{ theme: ThemeSupa }}
                  providers={["google", "github"]}
                />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
