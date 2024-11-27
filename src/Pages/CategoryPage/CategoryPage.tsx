import { Props } from "recharts/types/container/Surface";
import { useAuth } from "../../Context/useAuth";
import VendorCategoryPage from "../Vendor/Category/VendorCategoryPage";
import AdminCategoryPage from "../Admin/Category/AdminCategoryPage";

const CaptegoryPage = () => {
    const { isAdmin, isVendor } = useAuth();
  
    return (
      <>
        {isAdmin() && <AdminCategoryPage />}
        {isVendor() && <VendorCategoryPage />}
      </>
    );
  };
  
  export default CaptegoryPage;