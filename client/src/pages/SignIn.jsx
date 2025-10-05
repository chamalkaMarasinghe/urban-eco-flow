import ImageSection from "../components/pagesSpecific/Login/ImageSection";
import SignInForm from "../components/pagesSpecific/Login/SignInForm";


const SignIn = () => {// NOTE: need to be removed
  return (
    <div className="flex items-center justify-center w-full min-h-screen min-w-[320px] px-[30px] md:px-[100px]">
      <div className="container max-w-[1240px] lg:max-h-[714px] flex flex-col md:flex-row justify-center items-center gap-[50px]">
        <div className="flex justify-center w-full lg:w-1/2">
          <SignInForm />
        </div>
        <div className="hidden lg:flex lg:w-1/2">
          {/* <ImageSection img={Image} imgLq={Image_LQ}/> */}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
