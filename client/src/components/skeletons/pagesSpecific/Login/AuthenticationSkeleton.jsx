// Skeleton component to show while authentication is in progress
const AuthenticationSkeleton = () => {
  return (
    <div className="mt-[48px] mb-[88px] px-[20px] md:px-[40px] lg:px-[100px] min-h-screen ">
      <div className="py-10">
        <div className="">
          <div className="animate-pulse">
            {/* Header skeleton */}
            <div className="h-8 bg-gray-200 rounded-md w-full mb-6"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-40 bg-gray-200 rounded-md"></div>
              <div className="h-40 bg-gray-200 rounded-md"></div>
              <div className="h-40 bg-gray-200 rounded-md"></div>
            </div>

            <div className="h-12 bg-gray-200 rounded-md w-full my-6"></div>

            <div className="h-6 bg-gray-200 rounded-md w-3/4 mt-8"></div>
            <div className="h-6 bg-gray-200 rounded-md w-full mt-4"></div>
            <div className="h-6 bg-gray-200 rounded-md w-full mt-8"></div>
            <div className="h-6 bg-gray-200 rounded-md w-1/2 mt-4"></div>

            <div className="h-16 bg-gray-200 rounded-md w-full mt-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationSkeleton;
