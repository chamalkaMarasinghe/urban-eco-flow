import ImageSection from "../../components/Login/ImageSection";
import SignUpForm from "../../components/Login/SignUpForm";
import Image from "../../assets/login/signup.webp";
import Image_LQ from "../../assets/login/signup_lq.webp";

const SignUp = () => {
  return (
    <div className="flex items-center min-w-[320px] justify-center w-full min-h-screen px-[30px] md:px-[100px] bg-light">
      <div className="container max-w-[1240px] lg:max-h-[714px] flex flex-col md:flex-row justify-center items-center gap-[50px]">
        <div className="flex justify-center w-full lg:w-1/2">
          <SignUpForm />
        </div>
        <div className="hidden lg:flex lg:w-1/2">
          <ImageSection img={Image} imgLq={Image_LQ}/>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
