import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { roles } from "../../constants/commonConstants";

// Loader component
const Loader = ({
  color
}) => {
  const { role } = useSelector((state) => state.auth);
  let loaderColor = color || (role === roles.USER ? "#00796B" : "#0F161E");
  return (
    <div className="flex justify-center items-center py-10">
      <ClipLoader
        color={loaderColor}
        size={50}
      />
    </div>
  );
};

export default Loader;
